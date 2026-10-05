import { NextRequest, NextResponse } from 'next/server';
import { buildNewspaperHTML } from '@/lib/newspaper-template';
import { adminStorage } from '@/lib/firebase-admin';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const maxDuration = 60;

// Global in-memory cache for rendered broadsheets
const htmlCache = new Map<string, { html: string; createdAt: number }>();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id || !htmlCache.has(id)) {
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head><title>Edition Expired</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 60px;">
          <h2>This newspaper preview session has expired.</h2>
          <p>Please return to the Page Planner and click "Export PDF" again to generate a new edition.</p>
        </body>
      </html>`,
      { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  const cached = htmlCache.get(id)!;
  return new NextResponse(cached.html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}

export async function POST(req: NextRequest) {
  let browser: any = null;

  try {
    const { publication, pages } = await req.json();

    // Get protocol and host from request to construct absolute URL
    const protocol = req.nextUrl.protocol || 'https:';
    const host = req.headers.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}//${host}`;

    // 1. Build the full broadsheet HTML
    const baseHtml = buildNewspaperHTML(publication, pages, baseUrl);
    
    // 2. Inline images to base64
    const inlinedHtml = await inlineImages(baseHtml);

    // 3. Inject Print & Save toolbar + auto-trigger for browsers
    const printableHtml = injectPrintToolbar(inlinedHtml, publication?.name);

    let pdfBuffer: Buffer | null = null;

    // 4. Try headless browser PDF generation (Vercel-aware)
    try {
      const isVercel = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

      if (isVercel) {
        // On Vercel serverless: use @sparticuz/chromium + puppeteer-core
        // (regular puppeteer bundles its own Chrome which is too large for Vercel)
        const chromium = (await import('@sparticuz/chromium')).default;
        const puppeteerCore = (await import('puppeteer-core')).default;

        browser = await puppeteerCore.launch({
          args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
          defaultViewport: { width: 1200, height: 800 },
          executablePath: await chromium.executablePath(),
          headless: true,
        });
      } else {
        // Locally: regular puppeteer ships its own Chromium — just works
        const puppeteer = (await import('puppeteer')).default;
        browser = await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--font-render-hinting=none',
          ],
        });
      }

      const page = await browser.newPage();

      try {
        await page.setContent(inlinedHtml, {
          waitUntil: 'networkidle2',
          timeout: 15000,
        });
      } catch (e) {
        console.warn('[PDF Engine] setContent timed out, proceeding to generate PDF from available DOM:', e);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const rawPdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      });

      pdfBuffer = Buffer.from(rawPdf);
      await browser.close();
      browser = null;
    } catch (puppeteerErr: any) {
      console.warn('[PDF Engine] Headless browser unavailable or failed:', puppeteerErr?.message || puppeteerErr);
      if (browser) {
        try { await browser.close(); } catch {}
        browser = null;
      }
    }

    // 5. If Puppeteer successfully produced a binary PDF:
    if (pdfBuffer) {
      const safeName = (publication?.name || 'newspaper').replace(/[^a-zA-Z0-9-]/g, '_');
      const filename = `${safeName}_${publication?.date || Date.now()}_${Date.now()}.pdf`;
      const useFirebase = !!process.env.FIREBASE_SERVICE_ACCOUNT;

      if (useFirebase) {
        try {
          const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
          const bucket = adminStorage.bucket(bucketName);
          const destinationPath = `newspapers/${filename}`;
          const file = bucket.file(destinationPath);

          await file.save(pdfBuffer, {
            metadata: { contentType: 'application/pdf' },
          });

          try {
            await file.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
            return NextResponse.json({ url: publicUrl }, { status: 200 });
          } catch {
            // Signed URL fallback for buckets with uniform bucket-level access
            const [signedUrl] = await file.getSignedUrl({
              action: 'read',
              expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
            });
            return NextResponse.json({ url: signedUrl }, { status: 200 });
          }
        } catch (fbErr) {
          console.warn('[PDF Engine] Firebase storage upload failed, serving data URI:', fbErr);
          const base64Data = pdfBuffer.toString('base64');
          return NextResponse.json({ url: `data:application/pdf;base64,${base64Data}` }, { status: 200 });
        }
      } else {
        // Try local disk output
        try {
          const outputDir = path.join(process.cwd(), 'public', 'outputs');
          await mkdir(outputDir, { recursive: true });
          const filepath = path.join(outputDir, filename);
          await writeFile(filepath, pdfBuffer);
          return NextResponse.json({ url: `/outputs/${filename}` }, { status: 200 });
        } catch {
          const base64Data = pdfBuffer.toString('base64');
          return NextResponse.json({ url: `data:application/pdf;base64,${base64Data}` }, { status: 200 });
        }
      }
    }

    // 6. Resilient Fallback: When Puppeteer is not available (e.g. Vercel serverless):
    // Save to HTML cache and return dynamic printable URL with zero errors (HTTP 200)
    const docId = uuidv4();
    htmlCache.set(docId, {
      html: printableHtml,
      createdAt: Date.now(),
    });

    // Clean entries older than 2 hours
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    for (const [key, item] of htmlCache.entries()) {
      if (item.createdAt < twoHoursAgo) {
        htmlCache.delete(key);
      }
    }

    return NextResponse.json({ 
      url: `/api/render-pdf?id=${docId}`,
      mode: 'print'
    }, { status: 200 });

  } catch (error: any) {
    console.error('Fatal PDF rendering error:', error);
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function injectPrintToolbar(html: string, publicationName?: string): string {
  const title = publicationName || 'Daily Broadsheet Edition';
  const toolbarHtml = `
    <!-- Pre-Press Print Navigation Bar -->
    <div class="press-print-toolbar">
      <div class="press-print-info">
        <span class="press-print-title">${title}</span>
        <span class="press-print-badge">300 DPI Pre-Press Ready</span>
      </div>
      <div class="press-print-actions">
        <button onclick="window.print()" class="press-print-btn">
          <span>🖨️ Save as PDF / Print</span>
        </button>
        <button onclick="window.close()" class="press-close-btn">
          Close Window
        </button>
      </div>
    </div>

    <style>
      .press-print-toolbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 999999;
        background: #0f172a;
        color: #f8fafc;
        padding: 10px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 4px 20px rgba(0,0,0,0.35);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .press-print-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .press-print-title {
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
      }
      .press-print-badge {
        font-size: 11px;
        font-weight: 700;
        background: rgba(37,99,235,0.25);
        color: #60a5fa;
        border: 1px solid rgba(59,130,246,0.4);
        padding: 2px 8px;
        border-radius: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .press-print-actions {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .press-print-btn {
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: white;
        border: none;
        padding: 7px 16px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 13px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        box-shadow: 0 2px 10px rgba(37,99,235,0.35);
        transition: all 0.15s ease;
      }
      .press-print-btn:hover {
        background: linear-gradient(135deg, #1d4ed8, #1e40af);
        transform: translateY(-1px);
      }
      .press-close-btn {
        background: rgba(255,255,255,0.1);
        color: #94a3b8;
        border: 1px solid rgba(255,255,255,0.15);
        padding: 7px 14px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .press-close-btn:hover {
        background: rgba(255,255,255,0.18);
        color: #ffffff;
      }

      @media screen {
        body {
          padding-top: 55px !important;
          background: #334155 !important;
        }
        .page {
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
          margin-bottom: 30px !important;
        }
      }

      @media print {
        .press-print-toolbar {
          display: none !important;
        }
        body {
          padding-top: 0 !important;
        }
      }
    </style>

    <script>
      // Automatically prompt print dialog after page renders
      window.addEventListener('load', function() {
        setTimeout(function() {
          try {
            window.print();
          } catch (e) {
            console.warn('Auto print was intercepted by browser:', e);
          }
        }, 700);
      });
    </script>
  `;

  // Inject right after opening <body> tag
  if (html.includes('<body')) {
    return html.replace(/<body([^>]*)>/i, `<body$1>${toolbarHtml}`);
  }
  return toolbarHtml + html;
}

async function inlineImages(html: string): Promise<string> {
  const regex = /<img[^>]+src="([^"]+)"/gi;
  let match;
  const urlsToFetch = new Set<string>();
  
  while ((match = regex.exec(html)) !== null) {
    if (match[1] && match[1].startsWith('http')) {
      urlsToFetch.add(match[1]);
    }
  }

  const base64Map = new Map<string, string>();
  const fetchPromises = Array.from(urlsToFetch).map(async (url) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);
      
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Safari)',
          'Referer': 'https://www.google.com/',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        }
      });
      clearTimeout(timeoutId);
      
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const mimeType = res.headers.get('content-type') || 'image/jpeg';
        base64Map.set(url, `data:${mimeType};base64,${base64}`);
      }
    } catch {
      // Quietly continue if an image times out
    }
  });

  await Promise.allSettled(fetchPromises);

  let finalHtml = html;
  base64Map.forEach((base64, url) => {
    finalHtml = finalHtml.split(url).join(base64);
  });

  return finalHtml;
}