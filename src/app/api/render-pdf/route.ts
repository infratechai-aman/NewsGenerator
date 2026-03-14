import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { buildNewspaperHTML } from '@/lib/newspaper-template';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let browser = null;

  try {
    const { publication, pages } = await req.json();

    // Get protocol and host from the request to build base URL
    const protocol = req.nextUrl.protocol;
    const host = req.headers.get('host');
    const baseUrl = `${protocol}//${host}`;

    // Build the full HTML newspaper with base URL support
    const baseHtml = buildNewspaperHTML(publication, pages, baseUrl);
    
    // Convert all external images to base64 inline to bypass Puppeteer 403s and extreme network timeouts
    const html = await inlineImages(baseHtml);

    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--font-render-hinting=none',
      ],
    });

    const page = await browser.newPage();

    // Set content with high timeout for font loading, but catch timeouts
    // so we can still render the PDF even if some external tracking/images hang.
    try {
      await page.setContent(html, {
        waitUntil: 'networkidle2', // Wait for mostly quiet network
        timeout: 25000,
      });
    } catch (e) {
      console.warn('Puppeteer setContent timed out or threw, continuing anyway to generate PDF.', e);
    }

    // Wait a bit for fonts to fully load just in case
    await new Promise((resolve) => setTimeout(resolve, 2000));


    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    await browser.close();
    browser = null;

    // Convert Uint8Array to Buffer
    const buffer = Buffer.from(pdfBuffer);

    // Ensure the output directory exists
    const fs = await import('fs/promises');
    const path = await import('path');
    const outputDir = path.join(process.cwd(), 'public', 'outputs');
    
    try {
      await fs.access(outputDir);
    } catch {
      await fs.mkdir(outputDir, { recursive: true });
    }

    // Save PDF to public folder
    const safeName = publication.name.replace(/[^a-zA-Z0-9-]/g, '_');
    const filename = `${safeName}_${publication.date}_${Date.now()}.pdf`;
    const filepath = path.join(outputDir, filename);
    
    await fs.writeFile(filepath, buffer);

    // Return the URL for the client to download
    return NextResponse.json({ url: `/outputs/${filename}` }, { status: 200 });
  } catch (error) {
    console.error('PDF rendering error:', error);
    if (browser) {
      await browser.close();
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
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
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
      } else {
        console.warn(`[PDF Engine] Failed to fetch image ${url}: HTTP ${res.status}`);
      }
    } catch (e) {
      console.warn(`[PDF Engine] Network error inline image ${url}:`, e);
    }
  });

  await Promise.allSettled(fetchPromises);

  let finalHtml = html;
  base64Map.forEach((base64, url) => {
    finalHtml = finalHtml.split(url).join(base64);
  });

  return finalHtml;
}