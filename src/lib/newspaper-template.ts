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
  KeyIndicators,
  BriefItem,
  NewspaperTheme,
} from '@/types';
import { sanitizeImageUrl } from './images';
import { getThemeById } from './themes';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string, language: string): string {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const locale = language === 'hi' ? 'hi-IN' : language === 'bn' ? 'bn-IN' : 'en-IN';
  return date.toLocaleDateString(locale, options);
}

function shortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── Masthead ─────────────────────────────────────────────────────────────────

function renderMasthead(pub: PublicationConfig, theme: NewspaperTheme): string {
  const formattedDate = formatDate(pub.date, pub.language);
  const isBL = theme.mastheadStyle === 'blackletter';
  const taglineFont = isBL ? '' : `font-family: ${theme.uiFont};`;
  const titleStyle = `font-family: ${theme.mastheadFont}; color: ${theme.mastheadText};`;

  const borderMap: Record<string, string> = {
    'triple-line': `border-top: 3px double ${theme.mastheadText}; border-bottom: 1px solid ${theme.mastheadText};`,
    'double': `border-top: 2px solid ${theme.mastheadText}; border-bottom: 2px solid ${theme.mastheadText};`,
    'ornate': `border-top: 4px solid ${theme.accentColor}; border-bottom: 1px solid ${theme.accentColor};`,
    'minimal': `border-top: 1px solid ${theme.mastheadText}80;`,
  };

  return `
    <div class="masthead" style="background:${theme.mastheadBg}; border-bottom: 2px solid ${theme.mastheadText};">
      <div class="masthead-ticker" style="background:${theme.accentColor}; color:${theme.mastheadBg === '#0f0f0f' ? '#000' : '#fff'};">
        <span class="ticker-label">TODAY</span>
        <span class="ticker-text">Most important stories, big headlines, hero images — ${formattedDate}</span>
      </div>
      <div class="masthead-top-bar" style="color:${theme.mastheadText}; border-top: 1px solid ${theme.mastheadText}40; border-bottom: 1px solid ${theme.mastheadText}40;">
        <span class="masthead-info" style="${taglineFont}">Vol. ${pub.volume} &nbsp;|&nbsp; No. ${pub.issue}</span>
        <span class="masthead-tagline" style="${taglineFont}">${pub.tagline || ''}</span>
        <span class="masthead-info" style="${taglineFont}">${pub.edition || ''} &nbsp;|&nbsp; ${pub.price || ''}</span>
      </div>
      <div class="masthead-main" style="background:${theme.mastheadBg};">
        ${pub.mastheadLogo ? `<img src="${pub.mastheadLogo}" alt="Logo" class="masthead-logo" />` : ''}
        <h1 class="masthead-title" style="${titleStyle} font-size: ${theme.mastheadStyle === 'blackletter' ? '56pt' : '44pt'}; line-height:0.88;">${pub.name}</h1>
      </div>
      <div class="masthead-rule" style="${borderMap[theme.mastheadBorderStyle] || borderMap['triple-line']}"></div>
      <div class="masthead-date-bar" style="color:${theme.mastheadText}80; border-bottom: 1px solid ${theme.mastheadText}30;">
        ${formattedDate.toUpperCase()}
      </div>
    </div>
  `;
}

// ─── Category Header Strip ────────────────────────────────────────────────────

function renderCategoryStrip(page: NewspaperPage, theme: NewspaperTheme, pageNum: number): string {
  return `
    <div class="category-strip" style="background:${theme.categoryHeaderBg}; color:${theme.categoryHeaderText};">
      <span class="category-strip-left">
        <span class="category-strip-page">PAGE ${pageNum}</span>
        <span class="category-strip-sep">—</span>
        <span class="category-strip-name">${page.categoryLabel}</span>
      </span>
      <span class="category-strip-tagline">${page.categoryTagline}</span>
    </div>
  `;
}

// ─── In-Brief Sidebar (Page 1) ────────────────────────────────────────────────

function renderInBriefSidebar(briefs: BriefItem[], theme: NewspaperTheme): string {
  if (!briefs || briefs.length === 0) return '';
  return `
    <div class="in-brief-sidebar" style="border-right: 0.75pt solid ${theme.columnRuleColor};">
      <div class="in-brief-header" style="background:${theme.categoryHeaderBg}; color:${theme.categoryHeaderText};">IN BRIEF</div>
      <div class="in-brief-items">
        ${briefs.map((b) => `
          <div class="in-brief-item">
            <span class="in-brief-cat" style="color:${theme.accentColor};">${b.category.toUpperCase()}</span>
            <p class="in-brief-headline">${b.headline}</p>
            ${b.page ? `<span class="in-brief-page">▶ Page ${b.page}</span>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ─── Briefs Strip (Bottom Band) ───────────────────────────────────────────────

function renderBriefStrip(briefs: BriefItem[], categoryLabel: string, theme: NewspaperTheme): string {
  if (!briefs || briefs.length === 0) return '';
  const label = categoryLabel.split('(')[0].trim().toUpperCase() + ' BRIEFS';
  return `
    <div class="briefs-strip" style="border-top: 2pt solid ${theme.categoryHeaderBg};">
      <div class="briefs-strip-label" style="background:${theme.categoryHeaderBg}; color:${theme.categoryHeaderText};">${label}</div>
      <div class="briefs-strip-items">
        ${briefs.map((b, i) => `
          <div class="briefs-strip-item" style="${i < briefs.length - 1 ? `border-right: 0.5pt solid ${theme.columnRuleColor};` : ''}">
            <span class="briefs-strip-cat" style="color:${theme.accentColor};">${b.category.toUpperCase()}</span>
            <p class="briefs-strip-text">${b.headline}</p>
            ${b.page ? `<span class="briefs-strip-page">Page ${b.page}</span>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ─── Key Indicators Widget ────────────────────────────────────────────────────

function renderKeyIndicators(ki: KeyIndicators, theme: NewspaperTheme): string {
  return `
    <div class="key-indicators" style="border: 0.75pt solid ${theme.columnRuleColor}; border-top: ${theme.sectionBoxBorderTop};">
      <div class="key-indicators-title" style="font-family:${theme.uiFont}; background:${theme.categoryHeaderBg}; color:${theme.categoryHeaderText};">KEY INDICATORS</div>
      ${ki.indicators.map((ind) => `
        <div class="key-indicator-row">
          <span class="ki-name">${ind.name}</span>
          <span class="ki-value">${ind.value}</span>
          <span class="ki-change" style="color:${ind.direction === 'up' ? '#1a6b3c' : ind.direction === 'down' ? '#c0392b' : '#555'};">
            ${ind.direction === 'up' ? '▲' : ind.direction === 'down' ? '▼' : '—'} ${ind.change}
          </span>
        </div>
      `).join('')}
    </div>
  `;
}

// ─── Pull Quote ───────────────────────────────────────────────────────────────

function renderPullQuote(quote: string, theme: NewspaperTheme): string {
  return `
    <div class="pull-quote" style="border-top: 1pt solid ${theme.inkColor}; border-bottom: 1pt solid ${theme.inkColor};">
      <span class="pull-quote-mark" style="color:${theme.accentColor};">"</span>
      <p class="pull-quote-text" style="color:${theme.inkColor};">${quote}</p>
      <span class="pull-quote-mark pull-quote-close" style="color:${theme.accentColor};">"</span>
      <p class="pull-quote-attr">— Political Analyst</p>
    </div>
  `;
}

// ─── Articles ─────────────────────────────────────────────────────────────────

function renderArticle(article: NewsArticle, isLead: boolean, colSpan: number, pubDate: string, theme: NewspaperTheme): string {
  const paragraphs = article.content.split('\n').filter((p) => p.trim());
  const headlineClass = isLead ? 'headline-lead' : 'headline-secondary';
  const displayDate = article.date ? shortDate(article.date) : pubDate ? shortDate(pubDate) : '';

  let internalColumns = 1;
  if (colSpan >= 6) internalColumns = 4;
  else if (colSpan >= 4) internalColumns = 3;
  else if (colSpan >= 3) internalColumns = 2;

  const columns =
    internalColumns > 1
      ? `column-count: ${internalColumns}; column-gap: 14px; column-rule: 0.5pt solid ${theme.columnRuleColor};`
      : '';

  const images = (article.images || []).map((img) => ({
    ...img,
    url: sanitizeImageUrl(img.url, article.category),
  }));
  if (images.length === 0 && article.imageUrl) {
    images.push({ url: sanitizeImageUrl(article.imageUrl, article.category), caption: article.imageCaption || '' });
  }

  let imagesHtml = '';
  if (images.length > 0) {
    imagesHtml = images.length === 1
      ? `<div class="article-image-wrapper"><img src="${images[0].url}" class="article-image" />${images[0].caption ? `<p class="image-caption">${images[0].caption}</p>` : ''}</div>`
      : images.length === 2
      ? `<div class="article-image-grid-2"><div style="width:calc(50% - 2px)"><img src="${images[0].url}" class="article-image-half" style="width:100%" /></div><div style="width:calc(50% - 2px)"><img src="${images[1].url}" class="article-image-half" style="width:100%" /></div></div>${images[0].caption ? `<p class="image-caption">${images[0].caption}</p>` : ''}`
      : `<div class="article-image-wrapper"><img src="${images[0].url}" class="article-image" /></div><div class="article-image-grid-2 mt-1"><div style="width:calc(50% - 2px)"><img src="${images[1].url}" class="article-image-half" style="width:100%" /></div><div style="width:calc(50% - 2px)"><img src="${images[2].url}" class="article-image-half" style="width:100%" /></div></div>${images[0].caption ? `<p class="image-caption mt-1">${images[0].caption}</p>` : ''}`;
  }

  // Key Highlights box
  const highlightsHtml = article.keyHighlights && article.keyHighlights.length > 0
    ? `<div class="key-highlights-box" style="border-left: 3pt solid ${theme.accentColor}; border: 0.5pt solid ${theme.columnRuleColor};">
        <div class="key-highlights-title" style="color:${theme.accentColor}; font-family:${theme.uiFont};">KEY HIGHLIGHTS</div>
        <ul class="key-highlights-list">${article.keyHighlights.map((h) => `<li>● ${h}</li>`).join('')}</ul>
      </div>`
    : '';

  // Sub-headline
  const subHeadHtml = article.subHeadline
    ? `<p class="article-subheadline" style="font-family:${theme.headlineFont};">${article.subHeadline}</p>`
    : '';

  // Pull quote in middle of body
  const midpoint = Math.floor(paragraphs.length / 2);
  const beforePQ = paragraphs.slice(0, midpoint);
  const afterPQ = paragraphs.slice(midpoint);
  const pullQuoteHtml =
    article.pullQuote && paragraphs.length > 4
      ? renderPullQuote(article.pullQuote, theme)
      : '';

  const bodyHtml = `
    <div class="article-body" style="${columns} color:${theme.inkColor};">
      ${beforePQ.map((p) => `<p>${p.trim()}</p>`).join('')}
      ${pullQuoteHtml}
      ${afterPQ.map((p) => `<p>${p.trim()}</p>`).join('')}
    </div>
  `;

  const headlineSize = isLead
    ? `font-size: ${colSpan >= 4 ? '30pt' : '22pt'}; line-height: 0.93;`
    : `font-size: ${colSpan >= 3 ? '17pt' : colSpan >= 2 ? '14pt' : '11pt'}; line-height: 1.05;`;

  return `
    <div class="article ${isLead ? 'article-lead' : ''}">
      <h2 class="${headlineClass}" style="font-family:${theme.headlineFont}; color:${theme.inkColor}; ${headlineSize}">${article.headline}</h2>
      ${subHeadHtml}
      ${imagesHtml}
      <p class="article-byline" style="font-family:${theme.uiFont}; color:${theme.inkColor}80;">
        By ${article.source}
        <span class="byline-divider" style="color:${theme.bylineDividerColor};">|</span>
        ${article.category?.toUpperCase() || 'NEWS'}
        <span class="byline-divider" style="color:${theme.bylineDividerColor};">|</span>
        ${displayDate}
      </p>
      ${highlightsHtml}
      ${bodyHtml}
    </div>
  `;
}

function renderManualArticle(article: ManualArticle, isLead: boolean, colSpan: number, pubDate: string, theme: NewspaperTheme): string {
  const paragraphs = article.content.split('\n').filter((p) => p.trim());
  const headlineClass = isLead ? 'headline-lead' : 'headline-secondary';
  const displayDate = article.date ? shortDate(article.date) : pubDate ? shortDate(pubDate) : '';

  let internalColumns = 1;
  if (colSpan >= 6) internalColumns = 4;
  else if (colSpan >= 4) internalColumns = 3;
  else if (colSpan >= 3) internalColumns = 2;

  const columnStyle = internalColumns > 1
    ? `column-count: ${internalColumns}; column-gap: 14px; column-rule: 0.5pt solid ${theme.columnRuleColor};`
    : '';

  let imagesHtml = '';
  if (article.images && article.images.length > 0) {
    imagesHtml = article.images.length === 1
      ? `<div class="article-image-wrapper"><img src="${article.images[0].url}" class="article-image" /></div>`
      : article.images.length === 2
      ? `<div class="article-image-grid-2"><img src="${article.images[0].url}" class="article-image-half" /><img src="${article.images[1].url}" class="article-image-half" /></div>`
      : `<div class="article-image-wrapper"><img src="${article.images[0].url}" class="article-image" /></div><div class="article-image-grid-2 mt-1"><img src="${article.images[1].url}" class="article-image-half" /><img src="${article.images[2].url}" class="article-image-half" /></div>`;
  }

  const headlineSize = isLead
    ? `font-size: ${colSpan >= 4 ? '30pt' : '22pt'}; line-height: 0.93;`
    : `font-size: ${colSpan >= 3 ? '17pt' : colSpan >= 2 ? '14pt' : '11pt'}; line-height: 1.05;`;

  return `
    <div class="article ${isLead ? 'article-lead' : ''}">
      <h2 class="${headlineClass}" style="font-family:${theme.headlineFont}; color:${theme.inkColor}; ${headlineSize}">${article.headline}</h2>
      ${imagesHtml}
      <p class="article-byline" style="font-family:${theme.uiFont}; color:${theme.inkColor}80;">By ${article.author || 'Special Correspondent'} <span class="byline-divider" style="color:${theme.bylineDividerColor};">|</span> ${displayDate}</p>
      <div class="article-body" style="${columnStyle} color:${theme.inkColor};">
        ${article.shortDescription ? `<p class="article-short-desc"><strong>${article.shortDescription}</strong></p>` : ''}
        ${paragraphs.map((p) => `<p>${p.trim()}</p>`).join('')}
      </div>
    </div>
  `;
}

// ─── Special Blocks ───────────────────────────────────────────────────────────

function renderHoroscope(horoscope: Horoscope, theme: NewspaperTheme): string {
  const zodiacSymbols: Record<string, string> = {
    Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
    Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
    Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
  };
  return `
    <div class="section-box horoscope-section" style="border-top:${theme.sectionBoxBorderTop};">
      <h3 class="section-title" style="font-family:${theme.uiFont}; color:${theme.inkColor}; border-bottom:0.5pt solid ${theme.columnRuleColor};">TODAY'S HOROSCOPE</h3>
      <div class="horoscope-grid">
        ${horoscope.entries.slice(0, 6).map((e) => `
          <div class="horoscope-entry" style="border:0.5pt dotted ${theme.columnRuleColor};">
            <span class="horoscope-symbol" style="color:${theme.accentColor};">${zodiacSymbols[e.sign] || '★'}</span>
            <strong style="font-family:${theme.uiFont}; color:${theme.inkColor};">${e.sign}</strong>
            <p style="color:${theme.inkColor};">${e.prediction}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderFacts(facts: DoYouKnowFacts, theme: NewspaperTheme): string {
  return `
    <div class="section-box facts-section" style="border-top:${theme.sectionBoxBorderTop};">
      <h3 class="section-title" style="font-family:${theme.uiFont}; color:${theme.inkColor}; border-bottom:0.5pt solid ${theme.columnRuleColor};">DO YOU KNOW?</h3>
      <ul class="facts-list">
        ${facts.facts.map((f) => `<li style="color:${theme.inkColor}; border-bottom:0.5pt dotted ${theme.columnRuleColor};">▸ ${f}</li>`).join('')}
      </ul>
    </div>
  `;
}

function renderSudoku(sudoku: SudokuPuzzle, theme: NewspaperTheme): string {
  return `
    <div class="section-box sudoku-section" style="border-top:${theme.sectionBoxBorderTop};">
      <h3 class="section-title" style="font-family:${theme.uiFont}; color:${theme.inkColor}; border-bottom:0.5pt solid ${theme.columnRuleColor}; margin-bottom:3px;">SUDOKU</h3>
      <img src="${sudoku.imageDataUrl}" alt="Daily Sudoku" class="sudoku-image" />
    </div>
  `;
}

function renderCrypticClue(cryptic: CrypticClue, theme: NewspaperTheme): string {
  return `
    <div class="section-box cryptic-section" style="border-top:${theme.sectionBoxBorderTop};">
      <h3 class="section-title" style="font-family:${theme.uiFont}; color:${theme.inkColor}; border-bottom:0.5pt solid ${theme.columnRuleColor};">CRYPTIC CORNER</h3>
      <p class="cryptic-clue" style="color:${theme.inkColor};">"${cryptic.clue}"</p>
      <p class="cryptic-hint"><em>Hint: ${cryptic.hint}</em></p>
      <p class="cryptic-answer">Answer: <span class="answer-hidden">${cryptic.answer}</span></p>
    </div>
  `;
}

function renderHouseAd(ad: HouseAd, theme: NewspaperTheme): string {
  return `
    <div class="house-ad" style="border: 2px solid ${theme.inkColor};">
      <h4 class="house-ad-title" style="font-family:${theme.uiFont}; color:${theme.inkColor};">${ad.title}</h4>
      <p class="house-ad-desc" style="color:${theme.inkColor};">${ad.description}</p>
      <p class="house-ad-tagline" style="font-family:${theme.uiFont}; color:${theme.accentColor};">— ${ad.tagline} —</p>
    </div>
  `;
}

function renderUserAd(asset: UploadedAsset): string {
  return `<div class="user-ad"><img src="${asset.url}" alt="${asset.name}" class="user-ad-image" /></div>`;
}

function renderQuote(quote: QuoteOfTheDay, theme: NewspaperTheme): string {
  return `
    <div class="section-box quote-section" style="border-top:${theme.sectionBoxBorderTop};">
      <h3 class="section-title" style="font-family:${theme.uiFont}; color:${theme.inkColor}; border-bottom:0.5pt solid ${theme.columnRuleColor};">❝ QUOTE OF THE DAY ❞</h3>
      <div class="quote-text" style="color:${theme.inkColor};">"${quote.quote}"</div>
      <div class="quote-author" style="font-family:${theme.uiFont}; color:${theme.accentColor};">— ${quote.author}</div>
    </div>
  `;
}

function renderHistory(history: OnThisDay, theme: NewspaperTheme): string {
  return `
    <div class="section-box history-section" style="border-top:${theme.sectionBoxBorderTop};">
      <h3 class="section-title" style="font-family:${theme.uiFont}; color:${theme.inkColor}; border-bottom:0.5pt solid ${theme.columnRuleColor};">ON THIS DAY</h3>
      <ul class="history-list">
        ${history.events.map((e) => `<li style="color:${theme.inkColor}; border-bottom:0.5pt dashed ${theme.columnRuleColor};"><strong>${e.year}:</strong> ${e.event}</li>`).join('')}
      </ul>
    </div>
  `;
}

function renderWeather(weather: WeatherReport, theme: NewspaperTheme): string {
  // If new compact weather format
  if (weather.currentTemp) {
    const forecast = weather.forecast || [];
    return `
      <div class="section-box weather-section" style="border-top:${theme.sectionBoxBorderTop};">
        <h3 class="section-title" style="font-family:${theme.uiFont}; color:${theme.inkColor}; border-bottom:0.5pt solid ${theme.columnRuleColor};">WEATHER</h3>
        <div class="weather-current" style="color:${theme.inkColor};">
          <span class="weather-big-icon">${weather.currentIcon || '🌤️'}</span>
          <div>
            <div class="weather-big-temp" style="color:${theme.inkColor};">${weather.currentTemp}</div>
            <div class="weather-city-name" style="font-family:${theme.uiFont}; color:${theme.inkColor}80;">${weather.city || ''}</div>
            <div class="weather-condition" style="color:${theme.inkColor}80;">${weather.currentCondition || ''}</div>
          </div>
        </div>
        ${forecast.length > 0 ? `
          <div class="weather-forecast" style="border-top: 0.5pt solid ${theme.columnRuleColor};">
            ${forecast.map((f) => `
              <div class="weather-forecast-day">
                <span class="wf-day" style="font-family:${theme.uiFont}; color:${theme.inkColor}80;">${f.day}</span>
                <span class="wf-icon">${f.icon}</span>
                <span class="wf-high" style="color:${theme.inkColor};">${f.high}</span>
                <span class="wf-low" style="color:${theme.inkColor}80;">${f.low}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  // Legacy format fallback
  return `
    <div class="section-box weather-section" style="border-top:${theme.sectionBoxBorderTop};">
      <h3 class="section-title" style="font-family:${theme.uiFont}; color:${theme.inkColor}; border-bottom:0.5pt solid ${theme.columnRuleColor};">REGIONAL WEATHER</h3>
      <div class="weather-grid">
        ${(weather.reports || []).map((w) => `
          <div class="weather-item" style="background:${theme.paperBg}; border:0.5pt solid ${theme.columnRuleColor};">
            <span class="weather-icon">${w.conditionIcon}</span>
            <div class="weather-info">
              <strong style="font-family:${theme.uiFont}; color:${theme.inkColor};">${w.city}</strong>
              <span class="weather-temp" style="color:${theme.inkColor}80;">${w.temp} (${w.condition})</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderTvGuide(tvGuide: TvGuide, theme: NewspaperTheme): string {
  return `
    <div class="section-box tv-section" style="border-top:${theme.sectionBoxBorderTop};">
      <h3 class="section-title" style="font-family:${theme.uiFont}; color:${theme.inkColor}; border-bottom:0.5pt solid ${theme.columnRuleColor};">EVENING GUIDE</h3>
      <ul class="tv-list">
        ${tvGuide.listings.map((l) => `
          <li class="tv-item" style="border-bottom:0.5pt solid ${theme.columnRuleColor}40;">
            <span class="tv-time" style="font-family:${theme.uiFont}; color:${theme.inkColor};">${l.time}</span>
            <span class="tv-show" style="color:${theme.inkColor};"><strong>${l.show}</strong></span>
            <span class="tv-channel" style="color:${theme.inkColor}80;">${l.channel}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

// ─── Content Block Dispatcher ─────────────────────────────────────────────────

function renderContentBlock(block: ContentBlock, isLead: boolean, colSpan: number, pubDate: string, theme: NewspaperTheme): string {
  switch (block.type) {
    case 'article':       return renderArticle(block.data as NewsArticle, isLead, colSpan, pubDate, theme);
    case 'manual-article':return renderManualArticle(block.data as ManualArticle, isLead, colSpan, pubDate, theme);
    case 'horoscope':     return renderHoroscope(block.data as Horoscope, theme);
    case 'facts':         return renderFacts(block.data as DoYouKnowFacts, theme);
    case 'sudoku':        return renderSudoku(block.data as SudokuPuzzle, theme);
    case 'cryptic':       return renderCrypticClue(block.data as CrypticClue, theme);
    case 'house-ad':      return renderHouseAd(block.data as HouseAd, theme);
    case 'ad':            return renderUserAd(block.data as UploadedAsset);
    case 'quote':         return renderQuote(block.data as QuoteOfTheDay, theme);
    case 'history':       return renderHistory(block.data as OnThisDay, theme);
    case 'weather':       return renderWeather(block.data as WeatherReport, theme);
    case 'tv-guide':      return renderTvGuide(block.data as TvGuide, theme);
    case 'key-indicators':return renderKeyIndicators(block.data as KeyIndicators, theme);
    default:              return '';
  }
}

// ─── Page Renderer ────────────────────────────────────────────────────────────

function renderPage(page: NewspaperPage, pub: PublicationConfig, isFirstPage: boolean, theme: NewspaperTheme): string {
  const filledSlots = page.slots.filter((s) => s.assignedContent !== null);
  let content = '';

  if (isFirstPage) {
    content += renderMasthead(pub, theme);
    // In-Brief sidebar is rendered as a floating element over row 1 on front page
    const inBriefHtml = page.briefs.length > 0 ? renderInBriefSidebar(page.briefs, theme) : '';
    if (inBriefHtml) {
      content += `<div class="front-page-body">
        <div class="in-brief-col">${inBriefHtml}</div>
        <div class="front-page-main">`;
    }

    const rowGroups = new Map<number, typeof filledSlots>();
    filledSlots.forEach((slot) => {
      const row = slot.row;
      if (!rowGroups.has(row)) rowGroups.set(row, []);
      rowGroups.get(row)!.push(slot);
    });

    const sortedRows = Array.from(rowGroups.entries()).sort((a, b) => a[0] - b[0]);

    for (const [, slots] of sortedRows) {
      content += renderRowHtml(slots, false, pub.date, theme);
      content += `<div class="row-divider" style="background:${theme.columnRuleColor};"></div>`;
    }

    if (inBriefHtml) {
      content += `</div></div>`;
    }

    // Briefs strip at bottom of front page
    if (page.briefs.length > 0) {
      content += renderBriefStrip(page.briefs.slice(0, 5), page.categoryLabel, theme);
    }

  } else {
    // Inner pages: category header strip first
    content += renderCategoryStrip(page, theme, page.pageNumber);

    const rowGroups = new Map<number, typeof filledSlots>();
    filledSlots.forEach((slot) => {
      const row = slot.row;
      if (!rowGroups.has(row)) rowGroups.set(row, []);
      rowGroups.get(row)!.push(slot);
    });

    const sortedRows = Array.from(rowGroups.entries()).sort((a, b) => a[0] - b[0]);
    const isLead = true;
    let firstRow = true;

    for (const [, slots] of sortedRows) {
      content += renderRowHtml(slots, firstRow && isLead, pub.date, theme);
      content += `<div class="row-divider" style="background:${theme.columnRuleColor};"></div>`;
      firstRow = false;
    }

    // Briefs strip
    if (page.briefs.length > 0) {
      content += renderBriefStrip(page.briefs.slice(0, 4), page.categoryLabel, theme);
    }
  }

  return content;
}

function renderRowHtml(slots: any[], firstRow: boolean, pubDate: string, theme: NewspaperTheme): string {
  const totalColSpan = slots.reduce((sum: number, s: any) => sum + s.colSpan, 0);
  const isFullWidth = totalColSpan >= 6 || slots.length === 1;

  if (isFullWidth && slots.length === 1) {
    const slot = slots[0];
    return `<div class="row full-row">${renderContentBlock(slot.assignedContent!, firstRow, slot.colSpan, pubDate, theme)}</div>`;
  }

  let html = `<div class="row multi-col-row">`;
  for (const slot of slots) {
    const widthPercent = (slot.colSpan / 6) * 100;
    html += `
      <div class="column" style="width:${widthPercent}%; flex: 0 0 ${widthPercent}%; max-width:${widthPercent}%; border-right: 0.5pt solid ${theme.columnRuleColor};">
        <div class="column-inner">
          ${renderContentBlock(slot.assignedContent!, firstRow, slot.colSpan, pubDate, theme)}
        </div>
      </div>
    `;
    firstRow = false;
  }
  html += `</div>`;
  return html;
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function buildNewspaperHTML(pub: PublicationConfig, pages: NewspaperPage[], baseUrl: string = ''): string {
  const theme = getThemeById(pub.themeId || 'classic-broadsheet');

  const isHindi = pub.language === 'hi' || pub.language === 'bn';
  const devanagariStack = "'Noto Sans Devanagari', ";

  const bodyFontFinal = isHindi ? `${devanagariStack}${theme.bodyFont}` : theme.bodyFont;

  let pagesHTML = '';
  const activePages = pages.filter((page) => page.slots.some((slot) => slot.assignedContent !== null));

  activePages.forEach((page, idx) => {
    pagesHTML += `
      <div class="newspaper-page ${idx > 0 ? 'page-break' : ''}">
        <div class="newspaper-page-inner">
          ${renderPage(page, pub, idx === 0, theme)}
        </div>
      </div>
    `;
  });

  return `<!DOCTYPE html>
<html lang="${pub.language === 'hi' ? 'hi' : pub.language === 'bn' ? 'bn' : 'en'}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${baseUrl ? `<base href="${baseUrl}">` : ''}
  <link href="${theme.googleFontsUrl}" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    @page { size: A4; margin: 0; }

    body {
      font-family: ${bodyFontFinal};
      font-size: 8pt;
      line-height: 1.18;
      color: ${theme.inkColor};
      background: ${theme.paperBg};
      ${theme.paperTexture ? 'filter: none;' : ''}
    }

    /* ── Page Container ─────────────────────────────── */
    .newspaper-page {
      width: 210mm;
      min-height: 297mm;
      height: 297mm;
      background: ${theme.paperBg};
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    }

    .newspaper-page-inner {
      width: 280mm;
      min-height: 396mm;
      height: 396mm;
      transform: scale(0.75);
      transform-origin: top left;
      padding: 0 12mm 8mm 12mm;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }

    .page-break { page-break-before: always; }

    /* ── Masthead ────────────────────────────────────── */
    .masthead { text-align: center; margin-bottom: 4px; }

    .masthead-ticker {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 2px 8px;
      font-size: 6pt;
      font-weight: 600;
    }
    .ticker-label {
      font-family: ${theme.uiFont};
      font-size: 5.5pt;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      background: rgba(255,255,255,0.25);
      padding: 1px 4px;
      border-radius: 2px;
    }
    .ticker-text { font-size: 6pt; }

    .masthead-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 6pt;
      padding: 2px 0;
      margin-bottom: 2px;
    }
    .masthead-info {
      font-family: ${theme.uiFont};
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-weight: 600;
    }
    .masthead-tagline {
      font-family: ${theme.bodyFont};
      font-style: italic;
      font-size: 6pt;
      letter-spacing: 2px;
    }

    .masthead-main {
      padding: 2px 0 4px 0;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .masthead-logo {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      max-height: 40px;
      max-width: 80px;
      object-fit: contain;
    }
    .masthead-title {
      font-weight: 400;
      letter-spacing: -1px;
      padding: 4px 0 6px 0;
      text-align: center;
      flex: 1;
    }
    .masthead-rule {
      margin: 2px 0;
    }
    .masthead-date-bar {
      font-family: ${theme.uiFont};
      font-size: 5.5pt;
      letter-spacing: 2px;
      padding: 2px 0;
      text-align: center;
      text-transform: uppercase;
    }

    /* ── Category Strip ──────────────────────────────── */
    .category-strip {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 3px 8px;
      margin-bottom: 6px;
      font-family: ${theme.uiFont};
    }
    .category-strip-left { display: flex; align-items: center; gap: 6px; }
    .category-strip-page { font-size: 6pt; font-weight: 400; opacity: 0.8; }
    .category-strip-sep { font-size: 7pt; opacity: 0.6; }
    .category-strip-name { font-size: 7.5pt; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
    .category-strip-tagline { font-size: 6pt; font-weight: 400; opacity: 0.75; font-style: italic; }

    /* ── Front Page In-Brief Layout ──────────────────── */
    .front-page-body {
      display: flex;
      gap: 0;
      flex: 1;
    }
    .in-brief-col {
      width: 14%;
      flex: 0 0 14%;
      max-width: 14%;
    }
    .front-page-main {
      flex: 1;
      min-width: 0;
    }

    /* ── In-Brief Sidebar ────────────────────────────── */
    .in-brief-sidebar { height: 100%; }
    .in-brief-header {
      font-family: ${theme.uiFont};
      font-size: 7pt;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      text-align: center;
      padding: 3px 4px;
      margin-bottom: 4px;
    }
    .in-brief-items { padding: 0 6px 0 2px; }
    .in-brief-item {
      padding: 4px 0;
      border-bottom: 0.5pt dotted ${theme.columnRuleColor};
      margin-bottom: 3px;
    }
    .in-brief-item:last-child { border-bottom: none; }
    .in-brief-cat {
      font-family: ${theme.uiFont};
      font-size: 5.5pt;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      display: block;
      margin-bottom: 1px;
    }
    .in-brief-headline {
      font-size: 7pt;
      font-weight: 600;
      line-height: 1.15;
      color: ${theme.inkColor};
      margin-bottom: 1px;
    }
    .in-brief-page {
      font-family: ${theme.uiFont};
      font-size: 5.5pt;
      color: ${theme.inkColor};
      opacity: 0.6;
    }

    /* ── Key Highlights Box ──────────────────────────── */
    .key-highlights-box {
      padding: 5px 7px;
      margin: 5px 0;
      break-inside: avoid;
    }
    .key-highlights-title {
      font-size: 6.5pt;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .key-highlights-list {
      list-style: none;
      padding: 0;
    }
    .key-highlights-list li {
      font-size: 7pt;
      line-height: 1.2;
      padding: 1.5px 0;
      color: ${theme.inkColor};
    }

    /* ── Rows / Columns ──────────────────────────────── */
    .row { margin-bottom: 0; }
    .full-row { width: 100%; }
    .multi-col-row {
      display: flex;
      flex-wrap: nowrap;
      gap: 0;
    }
    .column {
      flex-shrink: 0;
      box-sizing: border-box;
    }
    .column:last-child { border-right: none !important; }
    .column-inner { padding: 0 10px 0 8px; }
    .column:last-child .column-inner { padding-right: 0; }

    .row-divider {
      height: 0.5pt;
      margin: 5px 0;
    }

    /* ── Articles ────────────────────────────────────── */
    .article {
      margin-bottom: 6px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .headline-lead {
      font-weight: 900;
      margin-bottom: 4px;
      letter-spacing: -0.5px;
      text-align: left;
    }
    .headline-secondary {
      font-weight: 700;
      margin-bottom: 3px;
      letter-spacing: -0.3px;
    }

    .article-subheadline {
      font-size: 10pt;
      font-style: italic;
      font-weight: 400;
      line-height: 1.2;
      margin-bottom: 4px;
      color: ${theme.inkColor};
      opacity: 0.85;
    }

    .article-byline {
      font-size: 6.5pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
      padding-bottom: 2px;
      font-weight: 600;
      border-bottom: 0.5pt solid ${theme.columnRuleColor};
    }
    .byline-divider {
      font-weight: 900;
      margin: 0 2px;
    }

    .article-image-wrapper { margin: 4px 0; }
    .article-image-grid-2 { display: flex; gap: 3px; margin: 4px 0; }
    .mt-1 { margin-top: 4px; }

    .article-image {
      width: 100%;
      max-height: 55mm;
      object-fit: cover;
      border: 1px solid ${theme.inkColor};
      display: block;
    }
    .article-image-half {
      width: calc(50% - 2px);
      max-height: 38mm;
      object-fit: cover;
      border: 1px solid ${theme.inkColor};
    }
    .image-caption {
      font-size: 5.5pt;
      margin-top: 2px;
      text-align: right;
      font-style: italic;
      color: ${theme.inkColor};
      opacity: 0.7;
    }

    .article-body {
      text-align: justify;
      -webkit-hyphens: auto;
      hyphens: auto;
      font-size: 8pt;
      line-height: 1.3;
      overflow: hidden;
      display: inline-block;
      width: 100%;
      vertical-align: top;
    }
    .article-short-desc {
      font-size: 8.5pt;
      font-style: italic;
      margin-bottom: 3px;
      line-height: 1.2;
    }
    .article-body p {
      text-indent: 10px;
      margin-bottom: 4px;
      font-size: 8pt;
      line-height: 1.25;
    }
    .article-body p:first-child { text-indent: 0; }
    .article-body p:first-child::first-letter {
      font-size: 28pt;
      font-weight: 900;
      font-family: ${theme.headlineFont};
      float: left;
      padding-right: 3px;
      line-height: 0.72;
      margin-top: 4px;
      color: ${theme.dropCapColor};
    }
    .article-lead .article-body p { font-size: 8.5pt; line-height: 1.3; }

    /* ── Pull Quote ──────────────────────────────────── */
    .pull-quote {
      margin: 6px 8px;
      padding: 5px 0;
      text-align: center;
      break-inside: avoid;
    }
    .pull-quote-mark {
      font-size: 28pt;
      font-family: ${theme.headlineFont};
      font-weight: 900;
      line-height: 0.6;
      display: inline-block;
    }
    .pull-quote-close { display: block; text-align: right; margin-top: -10px; }
    .pull-quote-text {
      font-size: 9.5pt;
      font-style: italic;
      line-height: 1.3;
      font-family: ${theme.bodyFont};
      margin: 2px 0;
    }
    .pull-quote-attr {
      font-family: ${theme.uiFont};
      font-size: 6pt;
      text-transform: uppercase;
      opacity: 0.7;
      margin-top: 2px;
    }

    /* ── Key Indicators ──────────────────────────────── */
    .key-indicators {
      padding: 0;
      break-inside: avoid;
    }
    .key-indicators-title {
      font-size: 7pt;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      text-align: center;
      padding: 3px 4px;
      margin-bottom: 2px;
    }
    .key-indicator-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px 4px;
      border-bottom: 0.5pt solid ${theme.columnRuleColor};
      font-size: 7pt;
    }
    .key-indicator-row:last-child { border-bottom: none; }
    .ki-name {
      font-family: ${theme.uiFont};
      font-size: 6.5pt;
      font-weight: 600;
      flex: 1;
    }
    .ki-value {
      font-size: 7pt;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      margin: 0 4px;
    }
    .ki-change {
      font-size: 6pt;
      font-weight: 700;
      font-family: ${theme.uiFont};
    }

    /* ── Briefs Strip ────────────────────────────────── */
    .briefs-strip {
      margin-top: auto;
      break-inside: avoid;
    }
    .briefs-strip-label {
      font-family: ${theme.uiFont};
      font-size: 6.5pt;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      padding: 2px 8px;
    }
    .briefs-strip-items {
      display: flex;
      gap: 0;
    }
    .briefs-strip-item {
      flex: 1;
      padding: 4px 6px;
      box-sizing: border-box;
    }
    .briefs-strip-cat {
      font-family: ${theme.uiFont};
      font-size: 5.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: block;
      margin-bottom: 1px;
    }
    .briefs-strip-text {
      font-size: 6.5pt;
      line-height: 1.2;
      color: ${theme.inkColor};
      font-weight: 600;
    }
    .briefs-strip-page {
      font-family: ${theme.uiFont};
      font-size: 5.5pt;
      opacity: 0.6;
      display: block;
      margin-top: 1px;
    }

    /* ── Section Boxes ───────────────────────────────── */
    .section-box {
      border: 0.5pt solid ${theme.columnRuleColor};
      padding: 5px;
      margin-bottom: 4px;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 9pt;
      font-weight: 700;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      margin-bottom: 4px;
      padding-bottom: 2px;
    }

    /* ── Horoscope ───────────────────────────────────── */
    .horoscope-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2px;
    }
    .horoscope-entry {
      text-align: center;
      padding: 3px;
      break-inside: avoid;
    }
    .horoscope-symbol { font-size: 9pt; display: block; margin-bottom: 1px; }
    .horoscope-entry strong { font-size: 6.5pt; text-transform: uppercase; display: block; margin: 1px 0; }
    .horoscope-entry p { font-size: 5.5pt; line-height: 1.15; }

    /* ── Facts ───────────────────────────────────────── */
    .facts-list { list-style: none; padding: 0; }
    .facts-list li { font-size: 7.5pt; padding: 2.5px 0; line-height: 1.3; break-inside: avoid; }

    /* ── Weather (compact) ───────────────────────────── */
    .weather-current { display: flex; align-items: center; gap: 6px; padding: 4px 0; }
    .weather-big-icon { font-size: 22pt; line-height: 1; }
    .weather-big-temp { font-size: 16pt; font-weight: 700; line-height: 1; }
    .weather-city-name { font-size: 7pt; text-transform: uppercase; letter-spacing: 0.5px; }
    .weather-condition { font-size: 6.5pt; font-style: italic; }
    .weather-forecast { display: flex; gap: 0; margin-top: 4px; padding-top: 3px; }
    .weather-forecast-day {
      flex: 1;
      text-align: center;
      padding: 2px 0;
      border-right: 0.5pt solid ${theme.columnRuleColor};
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1px;
    }
    .weather-forecast-day:last-child { border-right: none; }
    .wf-day { font-size: 5.5pt; text-transform: uppercase; }
    .wf-icon { font-size: 10pt; }
    .wf-high { font-size: 7pt; font-weight: 700; }
    .wf-low { font-size: 6pt; }

    /* Legacy weather grid */
    .weather-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
    .weather-item { display: flex; align-items: center; gap: 5px; padding: 3px; }
    .weather-icon { font-size: 14pt; }
    .weather-info { display: flex; flex-direction: column; }
    .weather-info strong { font-size: 6.5pt; text-transform: uppercase; }
    .weather-temp { font-size: 6.5pt; }

    /* ── TV Guide ────────────────────────────────────── */
    .tv-list { list-style: none; padding: 0; }
    .tv-item { display: flex; justify-content: space-between; font-size: 7pt; padding: 2.5px 0; }
    .tv-time { font-weight: bold; width: 38px; }
    .tv-show { flex: 1; padding: 0 6px; }
    .tv-channel { font-style: italic; opacity: 0.7; }

    /* ── Sudoku ──────────────────────────────────────── */
    .sudoku-image { width: 100%; max-width: 150px; display: block; margin: 0 auto; border: 0.5pt solid ${theme.inkColor}; }

    /* ── Cryptic ─────────────────────────────────────── */
    .cryptic-clue { font-size: 8.5pt; font-style: italic; text-align: center; margin: 3px 0; }
    .cryptic-hint { font-size: 6.5pt; text-align: center; opacity: 0.7; }
    .cryptic-answer { font-size: 6.5pt; text-align: center; margin-top: 2px; }
    .answer-hidden { background: ${theme.inkColor}; color: ${theme.inkColor}; padding: 0 4px; }

    /* ── Quote ───────────────────────────────────────── */
    .quote-text { font-size: 13pt; font-style: italic; text-align: center; line-height: 1.3; margin: 6px 10px; }
    .quote-author { font-size: 7.5pt; text-align: right; text-transform: uppercase; font-weight: 600; margin-right: 10px; }

    /* ── History ─────────────────────────────────────── */
    .history-list { list-style: none; padding: 0; }
    .history-list li { font-size: 7.5pt; padding: 3px 0; line-height: 1.25; break-inside: avoid; }

    /* ── House Ads ───────────────────────────────────── */
    .house-ad { padding: 7px; text-align: center; margin-bottom: 3px; break-inside: avoid; }
    .house-ad-title { font-size: 11pt; font-weight: 700; text-transform: uppercase; margin-bottom: 2px; }
    .house-ad-desc { font-size: 7.5pt; line-height: 1.3; margin-bottom: 2px; }
    .house-ad-tagline { font-size: 6.5pt; text-transform: uppercase; }

    /* ── User Ads ────────────────────────────────────── */
    .user-ad { margin-bottom: 3px; break-inside: avoid; }
    .user-ad-image { width: 100%; object-fit: contain; border: 0.5pt solid ${theme.inkColor}; }

    /* ── Print overrides ─────────────────────────────── */
    @media screen {
      .newspaper-page { box-shadow: 0 8px 30px rgba(0,0,0,0.18); margin-bottom: 30px; }
    }
    @media print {
      .newspaper-page { box-shadow: none; margin-bottom: 0; }
    }
  </style>
</head>
<body>
  ${pagesHTML}
</body>
</html>`;
}
