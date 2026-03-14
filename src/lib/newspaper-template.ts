import {
  NewspaperPage,
  PublicationConfig,
  ContentBlock,
  NewsArticle,
  DoYouKnowFacts,
  Horoscope,
  SudokuPuzzle,
  CrypticClue,
  HouseAd,
  UploadedAsset,
  ManualArticle,
  QuoteOfTheDay,
  OnThisDay,
  WeatherReport,
  TvGuide,
} from '@/types';

function formatDate(dateStr: string, language: string): string {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const locale = language === 'hi' ? 'hi-IN' : language === 'bn' ? 'bn-IN' : 'en-IN';
  return date.toLocaleDateString(locale, options);
}

function renderMasthead(publication: PublicationConfig): string {
  const formattedDate = formatDate(publication.date, publication.language);
  return `
    <div class="masthead">
      <div class="masthead-top-bar">
        <span class="masthead-info">Vol. ${publication.volume} | No. ${publication.issue}</span>
        <span class="masthead-info">${formattedDate}</span>
      </div>
      <div class="masthead-main">
        ${publication.mastheadLogo ? 
          `<img src="${publication.mastheadLogo}" alt="Logo" class="masthead-logo" />` : 
          ''
        }
        <h1 class="masthead-title">${publication.name}</h1>
      </div>
      <div class="masthead-bottom-bar">
        <div class="masthead-rule"></div>
      </div>
    </div>
  `;
}

function renderArticle(article: NewsArticle, isLead: boolean = false, colSpan: number = 1, pubDate: string = ''): string {
  const paragraphs = article.content.split('\n').filter((p) => p.trim());
  const headlineClass = isLead ? 'headline-lead' : 'headline-secondary';
  
  // Use article date or fallback to publication date
  const displayDate = article.date ? new Date(article.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 
                      pubDate ? new Date(pubDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

  // Calculate internal columns
  let internalColumns = 1;
  if (colSpan >= 6) internalColumns = 4;
  else if (colSpan >= 4) internalColumns = 3;
  else if (colSpan >= 3) internalColumns = 2;

  const columns = internalColumns > 1 
    ? `column-count: ${internalColumns}; column-gap: 15px; column-rule: 0.5pt solid #999;` 
    : '';

  const images = article.images || [];
  if (images.length === 0 && article.imageUrl) {
    images.push({ url: article.imageUrl, caption: article.imageCaption || '' });
  }

  let imagesHtml = '';
  if (images.length > 0) {
    if (images.length === 1) {
      imagesHtml = `<div class="article-image-wrapper"><img src="${images[0].url}" class="article-image" />${images[0].caption ? `<p class="image-caption">${images[0].caption}</p>` : ''}</div>`;
    } else if (images.length === 2) {
      imagesHtml = `
        <div class="article-image-grid-2">
          <div style="width: calc(50% - 2px)"><img src="${images[0].url}" class="article-image-half" style="width:100%" /></div>
          <div style="width: calc(50% - 2px)"><img src="${images[1].url}" class="article-image-half" style="width:100%" /></div>
        </div>
        ${images[0].caption ? `<p class="image-caption">${images[0].caption}</p>` : ''}
      `;
    } else {
      imagesHtml = `
        <div class="article-image-wrapper"><img src="${images[0].url}" class="article-image" /></div>
        <div class="article-image-grid-2 mt-1">
          <div style="width: calc(50% - 2px)"><img src="${images[1].url}" class="article-image-half" style="width:100%" /></div>
          <div style="width: calc(50% - 2px)"><img src="${images[2].url}" class="article-image-half" style="width:100%" /></div>
        </div>
        ${images[0].caption ? `<p class="image-caption mt-1">${images[0].caption}</p>` : ''}
      `;
    }
  }

  return `
    <div class="article ${isLead ? 'article-lead' : ''}">
      <h2 class="${headlineClass}">${article.headline}</h2>
      ${imagesHtml}
      <p class="article-byline">By ${article.source} <span class="byline-divider">|</span> ${article.category || 'NEWS'} <span class="byline-divider">|</span> ${displayDate}</p>
      <div class="article-body" style="${columns}">
        ${paragraphs.map((p) => `<p>${p.trim()}</p>`).join('')}
      </div>
    </div>
  `;
}

function renderManualArticle(article: ManualArticle, isLead: boolean = false, colSpan: number = 1, pubDate: string = ''): string {
  const paragraphs = article.content.split('\n').filter((p) => p.trim());
  const headlineClass = isLead ? 'headline-lead' : 'headline-secondary';
  
  const displayDate = article.date ? new Date(article.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 
                      pubDate ? new Date(pubDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

  // Calculate internal columns
  let internalColumns = 1;
  if (colSpan >= 6) internalColumns = 4;
  else if (colSpan >= 4) internalColumns = 3;
  else if (colSpan >= 3) internalColumns = 2;

  const columnStyle = internalColumns > 1 
    ? `column-count: ${internalColumns}; column-gap: 15px; column-rule: 0.5pt solid #999;` 
    : '';
  
  // Handle up to 3 images gracefully. If 1, full width. If 2, split width. If 3, one main, two smaller.
  let imagesHtml = '';
  if (article.images && article.images.length > 0) {
    if (article.images.length === 1) {
      imagesHtml = `<div class="article-image-wrapper"><img src="${article.images[0].url}" class="article-image" /></div>`;
    } else if (article.images.length === 2) {
      imagesHtml = `
        <div class="article-image-grid-2">
          <img src="${article.images[0].url}" class="article-image-half" />
          <img src="${article.images[1].url}" class="article-image-half" />
        </div>
      `;
    } else {
      imagesHtml = `
        <div class="article-image-wrapper"><img src="${article.images[0].url}" class="article-image" /></div>
        <div class="article-image-grid-2 mt-1">
          <img src="${article.images[1].url}" class="article-image-half" />
          <img src="${article.images[2].url}" class="article-image-half" />
        </div>
      `;
    }
  }

  return `
    <div class="article ${isLead ? 'article-lead' : ''}">
      <h2 class="${headlineClass}">${article.headline}</h2>
      ${imagesHtml}
      <p class="article-byline">By ${article.author || 'Special Correspondent'} <span class="byline-divider">|</span> ${displayDate}</p>
      <div class="article-body" style="${columnStyle}">
        ${article.shortDescription ? `<p class="article-short-desc"><strong>${article.shortDescription}</strong></p>` : ''}
        ${paragraphs.map((p) => `<p>${p.trim()}</p>`).join('')}
      </div>
    </div>
  `;
}

function renderHoroscope(horoscope: Horoscope): string {
  const zodiacSymbols: Record<string, string> = {
    Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
    Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
    Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
  };

  return `
    <div class="section-box horoscope-section">
      <h3 class="section-title">✦ DAILY HOROSCOPE ✦</h3>
      <div class="horoscope-grid">
        ${horoscope.entries.map((e) => `
          <div class="horoscope-entry">
            <span class="horoscope-symbol">${zodiacSymbols[e.sign] || '★'}</span>
            <strong>${e.sign}</strong>
            <p>${e.prediction}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderFacts(facts: DoYouKnowFacts): string {
  return `
    <div class="section-box facts-section">
      <h3 class="section-title">❓ DO YOU KNOW? ❓</h3>
      <ul class="facts-list">
        ${facts.facts.map((f) => `<li>▸ ${f}</li>`).join('')}
      </ul>
    </div>
  `;
}

function renderSudoku(sudoku: SudokuPuzzle): string {
  return `
    <div class="section-box sudoku-section">
      <img src="${sudoku.imageDataUrl}" alt="Daily Sudoku" class="sudoku-image" />
    </div>
  `;
}

function renderCrypticClue(cryptic: CrypticClue): string {
  return `
    <div class="section-box cryptic-section">
      <h3 class="section-title">🔑 CRYPTIC CORNER 🔑</h3>
      <p class="cryptic-clue">"${cryptic.clue}"</p>
      <p class="cryptic-hint"><em>Hint: ${cryptic.hint}</em></p>
      <p class="cryptic-answer">Answer: <span class="answer-hidden">${cryptic.answer}</span></p>
    </div>
  `;
}

function renderHouseAd(ad: HouseAd): string {
  const borderStyles: Record<string, string> = {
    classifieds: 'border: 2px solid #1a1a1a;',
    subscription: 'border: 3px double #1a1a1a;',
    event: 'border: 2px dashed #555;',
    general: 'border: 1px solid #333;',
  };
  return `
    <div class="house-ad" style="${borderStyles[ad.type] || borderStyles.general}">
      <h4 class="house-ad-title">${ad.title}</h4>
      <p class="house-ad-desc">${ad.description}</p>
      <p class="house-ad-tagline">— ${ad.tagline} —</p>
    </div>
  `;
}

function renderUserAd(asset: UploadedAsset): string {
  return `
    <div class="user-ad">
      <img src="${asset.url}" alt="${asset.name}" class="user-ad-image" />
    </div>
  `;
}

function renderQuote(quote: QuoteOfTheDay): string {
  return `
    <div class="section-box quote-section">
      <h3 class="section-title">❝ QUOTE OF THE DAY ❞</h3>
      <div class="quote-text">"${quote.quote}"</div>
      <div class="quote-author">— ${quote.author}</div>
    </div>
  `;
}

function renderHistory(history: OnThisDay): string {
  return `
    <div class="section-box history-section">
      <h3 class="section-title">🏛️ ON THIS DAY</h3>
      <ul class="history-list">
        ${history.events.map((e) => `<li><strong>${e.year}:</strong> ${e.event}</li>`).join('')}
      </ul>
    </div>
  `;
}

function renderWeather(weather: WeatherReport): string {
  return `
    <div class="section-box weather-section">
      <h3 class="section-title">🌤️ REGIONAL WEATHER</h3>
      <div class="weather-grid">
        ${weather.reports.map((w) => `
          <div class="weather-item">
            <span class="weather-icon">${w.conditionIcon}</span>
            <div class="weather-info">
              <strong>${w.city}</strong>
              <span class="weather-temp">${w.temp} (${w.condition})</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderTvGuide(tvGuide: TvGuide): string {
  return `
    <div class="section-box tv-section">
      <h3 class="section-title">📺 EVENING GUIDE</h3>
      <ul class="tv-list">
        ${tvGuide.listings.map((l) => `
          <li class="tv-item">
            <span class="tv-time">${l.time}</span>
            <span class="tv-show"><strong>${l.show}</strong></span>
            <span class="tv-channel">${l.channel}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

function renderContentBlock(block: ContentBlock, isLead: boolean = false, colSpan: number = 1, pubDate: string = ''): string {
  switch (block.type) {
    case 'article':
      return renderArticle(block.data as NewsArticle, isLead, colSpan, pubDate);
    case 'manual-article':
      return renderManualArticle(block.data as ManualArticle, isLead, colSpan, pubDate);
    case 'horoscope':
      return renderHoroscope(block.data as Horoscope);
    case 'facts':
      return renderFacts(block.data as DoYouKnowFacts);
    case 'sudoku':
      return renderSudoku(block.data as SudokuPuzzle);
    case 'cryptic':
      return renderCrypticClue(block.data as CrypticClue);
    case 'house-ad':
      return renderHouseAd(block.data as HouseAd);
    case 'ad':
      return renderUserAd(block.data as UploadedAsset);
    case 'quote':
      return renderQuote(block.data as QuoteOfTheDay);
    case 'history':
      return renderHistory(block.data as OnThisDay);
    case 'weather':
      return renderWeather(block.data as WeatherReport);
    case 'tv-guide':
      return renderTvGuide(block.data as TvGuide);
    default:
      return '';
  }
}

function renderPage(page: NewspaperPage, publication: PublicationConfig, isFirstPage: boolean): string {
  const filledSlots = page.slots.filter((s) => s.assignedContent !== null);

  let content = '';

  if (isFirstPage) {
    content += renderMasthead(publication);
  } else {
    content += `
      <div class="page-header">
        <span class="page-header-left">${publication.name}</span>
        <span class="page-header-center">PAGE ${page.pageNumber}</span>
        <span class="page-header-right">${formatDate(publication.date, publication.language)}</span>
      </div>
      <div class="page-header-rule"></div>
    `;
  }

  // Group slots by row
  const rowGroups = new Map<number, typeof filledSlots>();
  filledSlots.forEach((slot) => {
    const row = slot.row;
    if (!rowGroups.has(row)) rowGroups.set(row, []);
    rowGroups.get(row)!.push(slot);
  });

  const sortedRows = Array.from(rowGroups.entries()).sort((a, b) => a[0] - b[0]);

  for (const [rowIdx, slots] of sortedRows) {
    if (isFirstPage && rowIdx === 0) continue; // masthead row handled separately

    const totalColSpan = slots.reduce((sum, s) => sum + s.colSpan, 0);
    const isFullWidth = totalColSpan >= 6 || slots.length === 1;

    if (isFullWidth && slots.length === 1) {
      const slot = slots[0];
      const isLead = isFirstPage && rowIdx === 1;
      content += `<div class="row full-row">${renderContentBlock(slot.assignedContent!, isLead, slot.colSpan, publication.date)}</div>`;
    } else {
      content += `<div class="row multi-col-row">`;
      for (const slot of slots) {
        // Force width to be exact percentages and prevent flex shrinking/growing unexpectedly
        const widthPercent = (slot.colSpan / 6) * 100;
        content += `
          <div class="column" style="width: ${widthPercent}%; flex: 0 0 ${widthPercent}%; max-width: ${widthPercent}%;">
            <div class="column-inner">
              ${renderContentBlock(slot.assignedContent!, false, slot.colSpan, publication.date)}
            </div>
            ${slot.assignedContent?.type !== 'house-ad' && slot.assignedContent?.type !== 'ad' && slot.assignedContent?.type !== 'sudoku' && slot.assignedContent?.type !== 'horoscope' ? `<div class="column-filler-rule"></div>` : ''}
          </div>
        `;
      }
      content += `</div>`;
    }

    // Divider between rows
    content += `<div class="row-divider"></div>`;
  }

  return content;
}

export function buildNewspaperHTML(publication: PublicationConfig, pages: NewspaperPage[], baseUrl: string = ''): string {
  const fontFamily = publication.language === 'hi' || publication.language === 'bn'
    ? "'Noto Sans Devanagari', 'IBM Plex Serif', Georgia, serif"
    : "'IBM Plex Serif', Georgia, 'Times New Roman', serif";

  const headlineFont = "'Playfair Display', 'Georgia', serif";

  let pagesHTML = '';
  // Only render pages that actually have assigned content to completely eliminate massive blank white pages
  const activePages = pages.filter(page => page.slots.some(slot => slot.assignedContent !== null));

  activePages.forEach((page, idx) => {
    pagesHTML += `
      <div class="newspaper-page ${idx > 0 ? 'page-break' : ''}">
        <div class="newspaper-page-inner">
          ${renderPage(page, publication, idx === 0)}
        </div>
      </div>
    `;
  });

  return `<!DOCTYPE html>
<html lang="${publication.language === 'hi' ? 'hi' : publication.language === 'bn' ? 'bn' : 'en'}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${baseUrl ? `<base href="${baseUrl}">` : ''}
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@400;500;600;700;800;900&family=Oswald:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=UnifrakturMaguntia&family=Tinos:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    @page {
      size: A4;
      margin: 0;
    }

    body {
      font-family: ${fontFamily};
      font-size: 8pt; /* Much denser base font like real newsprint */
      line-height: 1.15; /* Extremely tight line height */
      color: #000000; /* Stricter black */
      background: white;
    }

    .newspaper-page {
      width: 210mm;
      height: 297mm;
      background: white;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    }

    .newspaper-page-inner {
      width: 280mm;   /* 33.3% larger Canvas */
      height: 396mm;  /* 33.3% larger Canvas */
      transform: scale(0.75);
      transform-origin: top left;
      padding: 10mm 12mm; /* Translates to ~7.5mm scaled padding */
      box-sizing: border-box;
    }

    .page-break {
      page-break-before: always;
    }

    /* MASTHEAD */
    .masthead {
      text-align: center;
      border-bottom: 2px solid #000;
      padding-bottom: 2px;
      margin-bottom: 6px;
    }

    .masthead-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 6pt;
      color: #000;
      padding: 1px 0;
      border-top: 1px solid #000;
      border-bottom: 1px solid #000;
      margin-bottom: 4px;
    }

    .masthead-info {
      font-family: 'Oswald', sans-serif;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-weight: 600;
    }

    .masthead-main {
      padding: 0;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 45px;
    }

    .masthead-logo {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      max-height: 45px;
      max-width: 80px;
      object-fit: contain;
    }

    .masthead-logo-fallback {
      max-height: 20mm;
      max-width: 50mm;
      object-fit: contain;
      margin-bottom: 4px;
      filter: grayscale(1) contrast(1.2);
    }

    .masthead-logo-text {
      font-family: 'UnifrakturMaguntia', ${headlineFont};
      font-size: 32pt;
      color: #000;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .masthead-title {
      font-family: 'UnifrakturMaguntia', ${headlineFont};
      font-size: 58pt;
      font-weight: 400;
      letter-spacing: -1px;
      line-height: 0.85;
      padding: 4px 0 8px 0;
      color: #000;
      text-align: center;
      flex: 1;
    }

    .masthead-rule {
      height: 4px;
      border-top: 2px solid #000;
      border-bottom: 1px solid #000;
      margin-top: 4px;
    }

    /* PAGE HEADER (inner pages) */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'Oswald', sans-serif;
      font-size: 7.5pt;
      color: #000;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding-bottom: 2px;
    }

    .page-header-rule {
      height: 3px;
      border-top: 1px solid #000;
      border-bottom: 1px double #000;
      margin-bottom: 8px;
    }

    /* ROWS */
    .row {
      margin-bottom: 0;
    }

    .full-row {
      width: 100%;
    }

    .multi-col-row {
      display: flex;
      flex-wrap: nowrap;
      gap: 0; /* Handle gaps inside columns to ensure math works */
    }

    .column {
      flex-shrink: 0;
      border-right: 0.5pt solid #888; /* Harsh grey column rules typical in broadsheets */
      box-sizing: border-box;
    }

    .column-inner {
      padding-right: 15px; /* Added internal padding instead of gap */
    }

    .column:last-child {
      border-right: none;
    }
    
    .column:last-child .column-inner {
      padding-right: 0;
    }

    .row-divider {
      height: 0.5pt;
      background: #888;
      margin: 6px 0;
    }

    .column-filler-rule {
      border-bottom: 2pt solid #1a1a1a;
      margin: 8px 15px 0 0;
      opacity: 0.2;
    }

    /* ARTICLES */
    .article {
      margin-bottom: 8px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .headline-lead {
      font-family: ${headlineFont};
      font-size: 32pt; /* Massive lead headlines */
      font-weight: 900;
      line-height: 0.95; /* Extremely tight line height */
      margin-bottom: 6px;
      color: #000;
      letter-spacing: -0.8px;
      text-align: left;
    }

    .headline-secondary {
      font-family: ${headlineFont};
      font-size: 18pt; /* Larger secondary headlines */
      font-weight: 700;
      line-height: 1.05;
      margin-bottom: 4px;
      color: #000;
      letter-spacing: -0.4px;
    }

    .article-byline {
      font-family: 'Oswald', sans-serif;
      font-size: 6.5pt;
      color: #444;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
      padding-bottom: 2px;
      font-weight: 600;
      border-bottom: 0.5pt solid #ccc; /* Tiny border under byline */
    }

    .byline-divider {
      color: #d41c1c; /* A touch of red for the classic TOI/HT feel */
      font-weight: 900;
      margin: 0 2px;
    }

    .article-image-wrapper {
      margin: 4px 0;
      padding-bottom: 2px;
    }

    .article-image-grid-2 {
      display: flex;
      gap: 4px;
      margin: 4px 0;
    }

    .mt-1 { margin-top: 4px; }

    .article-image {
      width: 100%;
      max-height: 50mm;
      object-fit: cover;
      border: 1px solid #000; /* Strict borders on images */
    }

    .article-image-half {
      width: calc(50% - 2px);
      max-height: 40mm;
      object-fit: cover;
      border: 1px solid #000;
    }

    .image-caption {
      font-family: 'Tinos', sans-serif;
      font-size: 6pt;
      color: #000;
      margin-top: 2px;
      text-align: right;
      font-style: italic;
    }

    .article-body {
      text-align: justify; /* Full justification ensures the blocky look */
      -webkit-hyphens: auto;
      hyphens: auto;
      font-size: 8.5pt;
      line-height: 1.35;
      color: #1a1a1a;
      overflow: hidden;
      display: inline-block;
      width: 100%;
      vertical-align: top;
    }

    .article-short-desc {
      font-family: 'Tinos', serif;
      font-size: 8.5pt;
      font-style: italic;
      margin-bottom: 4px;
      line-height: 1.2;
    }

    .article-body p {
      text-indent: 12px; /* Traditional newspaper indentation */
      margin-bottom: 5px; /* Zero bottom margin between paragraphs */
      font-size: 8pt;
      line-height: 1.15;
    }

    .article-body p:first-child {
      text-indent: 0;
    }

    .article-body p:first-child::first-letter {
      font-size: 32pt; /* Classic massive drop cap */
      font-weight: 900;
      font-family: 'Tinos', ${headlineFont};
      float: left;
      padding-right: 4px;
      line-height: 0.7; /* Adjust to ensure text flows beautifully around it */
      margin-top: 4px;
      margin-bottom: -2px;
    }

    .article-lead .article-body p {
      font-size: 8.5pt; /* Slightly larger text for the lead article */
      line-height: 1.2;
    }

    /* SECTIONS */
    .section-box {
      border: 0.5pt solid #000;
      border-top: 2pt solid #000; /* Heavier top borders on recurring boxes */
      padding: 6px;
      margin-bottom: 4px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .section-title {
      font-family: 'Oswald', sans-serif;
      font-size: 11pt;
      font-weight: 600;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 4px;
      padding-bottom: 2px;
      border-bottom: 0.5pt solid #888;
      color: #000;
    }

    /* HOROSCOPE */
    .horoscope-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2px;
    }

    .horoscope-entry {
      text-align: center;
      padding: 2px;
      border: 0.5pt dotted #888;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .horoscope-symbol {
      font-size: 10pt;
      display: block;
    }

    .horoscope-entry strong {
      font-size: 7.5pt;
      font-family: 'Oswald', sans-serif;
      text-transform: uppercase;
      display: block;
      margin: 1px 0;
    }

    .horoscope-entry p {
      font-size: 6pt;
      line-height: 1.15;
      color: #222;
    }

    /* FACTS */
    .facts-list {
      list-style: none;
      padding: 0;
    }

    .facts-list li {
      font-size: 8pt;
      padding: 3px 0;
      border-bottom: 0.5pt dotted #ccc;
      line-height: 1.3;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .facts-list li:last-child {
      border-bottom: none;
    }

    /* QUOTE OF THE DAY */
    .quote-text {
      font-family: 'Tinos', serif;
      font-size: 14pt;
      font-style: italic;
      text-align: center;
      line-height: 1.25;
      margin: 8px 12px;
      color: #222;
    }

    .quote-author {
      font-family: 'Oswald', sans-serif;
      font-size: 8pt;
      text-align: right;
      text-transform: uppercase;
      font-weight: 600;
      margin-right: 12px;
    }

    /* HISTORY */
    .history-list {
      list-style: none;
      padding: 0;
    }

    .history-list li {
      font-size: 8pt;
      padding: 4px 0;
      border-bottom: 0.5pt dashed #ccc;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    
    .history-list li:last-child {
      border-bottom: none;
    }

    /* WEATHER */
    .weather-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
    }

    .weather-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px;
      background: #f8f8f8;
      border: 0.5pt solid #ddd;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .weather-icon {
      font-size: 16pt;
    }

    .weather-info {
      display: flex;
      flex-direction: column;
    }

    .weather-info strong {
      font-family: 'Oswald', sans-serif;
      font-size: 7pt;
      text-transform: uppercase;
    }

    .weather-temp {
      font-size: 7pt;
      color: #333;
    }

    /* TV GUIDE */
    .tv-list {
      list-style: none;
      padding: 0;
    }

    .tv-item {
      display: flex;
      justify-content: space-between;
      font-size: 7.5pt;
      padding: 3px 0;
      border-bottom: 0.5pt solid #eee;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .tv-time {
      font-weight: bold;
      width: 40px;
      font-family: 'Oswald', sans-serif;
    }

    .tv-show {
      flex: 1;
      padding: 0 8px;
    }

    .tv-channel {
      font-style: italic;
      color: #555;
    }

    /* SUDOKU */
    .sudoku-image {
      width: 100%;
      max-width: 200px;
      display: block;
      margin: 0 auto;
      border: 0.5pt solid #000;
    }

    /* CRYPTIC */
    .cryptic-clue {
      font-size: 9pt;
      font-style: italic;
      text-align: center;
      margin: 4px 0;
      font-weight: 500;
    }

    .cryptic-hint {
      font-size: 7pt;
      text-align: center;
      color: #555;
    }

    .cryptic-answer {
      font-size: 7pt;
      text-align: center;
      margin-top: 3px;
    }

    .answer-hidden {
      background: #000;
      color: #000;
      padding: 0 4px;
      user-select: all;
    }

    /* HOUSE ADS */
    .house-ad {
      padding: 8px;
      text-align: center;
      margin-bottom: 4px;
      background: #fff;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .house-ad-title {
      font-family: 'Oswald', ${headlineFont};
      font-size: 12pt;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 2px;
    }

    .house-ad-desc {
      font-size: 8pt;
      line-height: 1.3;
      margin-bottom: 2px;
    }

    .house-ad-tagline {
      font-family: 'Oswald', sans-serif;
      font-size: 6.5pt;
      color: #333;
      text-transform: uppercase;
    }

    /* USER ADS */
    .user-ad {
      margin-bottom: 4px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .user-ad-image {
      width: 100%;
      object-fit: contain;
      border: 0.5pt solid #000;
    }
  </style>
</head>
<body>
  ${pagesHTML}
</body>
</html>`;
}
