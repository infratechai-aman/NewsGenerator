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
  PageCategory,
} from '@/types';
import { sanitizeImageUrl, getCategoryFallbackImage } from './images';
import { getThemeById } from './themes';

// ─── Category Visual Metadata ────────────────────────────────────────────────
interface CategoryColorSet {
  bg: string;
  text: string;
  accent: string;
}

const CATEGORY_COLORS: Record<string, CategoryColorSet> = {
  'front-page':             { bg: '#0f2b48', text: '#ffffff', accent: '#1d4ed8' },
  'politics':               { bg: '#991b1b', text: '#ffffff', accent: '#c0392b' },
  'international':          { bg: '#0f172a', text: '#ffffff', accent: '#2563eb' },
  'business-tech':          { bg: '#065f46', text: '#ffffff', accent: '#059669' },
  'education-science':      { bg: '#581c87', text: '#ffffff', accent: '#7c3aed' },
  'sports':                 { bg: '#c2410c', text: '#ffffff', accent: '#ea580c' },
  'entertainment-lifestyle':{ bg: '#831843', text: '#ffffff', accent: '#db2777' },
  'opinion-features':       { bg: '#1f2937', text: '#ffffff', accent: '#4b5563' },
};

function getCategoryColor(cat: string, theme: NewspaperTheme): CategoryColorSet {
  if (theme.id === 'dark-edition') {
    return { bg: '#1e293b', text: '#f5c842', accent: '#f5c842' };
  }
  return CATEGORY_COLORS[cat] || { bg: theme.categoryHeaderBg, text: theme.categoryHeaderText, accent: theme.accentColor };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr?: string, language?: string): string {
  if (!dateStr) return 'MONDAY, 5 OCTOBER 2026';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const locale = language === 'hi' ? 'hi-IN' : language === 'bn' ? 'bn-IN' : 'en-IN';
  return date.toLocaleDateString(locale, options);
}

function shortDate(dateStr?: string): string {
  if (!dateStr) return '05 OCT 2026';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
}

function cleanArticleText(text?: string): string[] {
  if (!text) return [];
  return text
    .split('\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

// ─── Category Header Strip ────────────────────────────────────────────────────
function renderCategoryStrip(page: NewspaperPage, theme: NewspaperTheme, pageNum: number): string {
  const colors = getCategoryColor(page.category, theme);
  const label = page.categoryLabel || 'NEWS';
  const tagline = page.categoryTagline || 'Authentic Daily Broadsheet Edition';

  return `
    <div class="cat-strip" style="background:${colors.bg}; color:${colors.text}; border-bottom: 1.5pt solid ${theme.inkColor};">
      <div class="cat-strip-left">
        <span class="cat-strip-page" style="font-family:${theme.uiFont};">PAGE ${pageNum}</span>
        <span class="cat-strip-sep">—</span>
        <span class="cat-strip-name" style="font-family:${theme.uiFont};">${label.toUpperCase()}</span>
      </div>
      <div class="cat-strip-tag" style="font-family:${theme.bodyFont};">${tagline}</div>
    </div>
  `;
}

// ─── Masthead (Page 1) ────────────────────────────────────────────────────────
function renderMasthead(pub: PublicationConfig, theme: NewspaperTheme): string {
  const formattedDate = formatDate(pub.date, pub.language);
  const isBL = theme.mastheadStyle === 'blackletter';
  const mastheadTitle = pub.name || 'The Daily Chronicle';
  const mastheadTagline = pub.tagline || 'TRUTH • PEOPLE • PERSPECTIVE';
  const vol = pub.volume || '18';
  const issue = pub.issue || '204';
  const edition = (pub.edition || 'PUNE EDITION').toUpperCase();
  const price = pub.price || '₹10';

  return `
    <header class="masthead">
      <div class="masthead-main">
        ${pub.mastheadLogo ? `<img src="${pub.mastheadLogo}" alt="Logo" class="masthead-logo" />` : ''}
        <h1 class="masthead-title" style="font-family:${theme.mastheadFont}; color:${theme.mastheadText};">
          ${mastheadTitle}
        </h1>
        <div class="masthead-tagline" style="font-family:${theme.bodyFont}; color:${theme.mastheadText};">
          — ${mastheadTagline.toUpperCase()} —
        </div>
      </div>

      <div class="masthead-dateline" style="border-top: 2pt solid ${theme.inkColor}; border-bottom: 0.75pt solid ${theme.inkColor}; font-family:${theme.uiFont}; color:${theme.mastheadText};">
        <div class="md-col md-left">VOL. ${vol} &nbsp;|&nbsp; NO. ${issue}</div>
        <div class="md-col md-center">${formattedDate.toUpperCase()}</div>
        <div class="md-col md-right">${edition} &nbsp;|&nbsp; ${price}</div>
      </div>
    </header>
  `;
}

// ─── In-Brief Sidebar (Page 1 Top-Left) ────────────────────────────────────────
function renderInBriefSidebar(briefs: BriefItem[], theme: NewspaperTheme): string {
  const defaultBriefs: BriefItem[] = [
    { category: 'MARKETS', headline: 'Markets end higher amid optimism on strong institutional inflows', page: '4' },
    { category: 'SPACE', headline: 'ISRO clears launch window for Chandrayaan-4 lunar sample return', page: '5' },
    { category: 'CRICKET', headline: 'India seals T20 series with record 9-wicket victory in Melbourne', page: '6' },
    { category: 'POLICY', headline: 'Cabinet approves ₹12,000-cr green hydrogen manufacturing incentives', page: '2' },
    { category: 'DIPLOMACY', headline: 'Global leaders convene in New Delhi for Sustainable Economy Summit', page: '3' },
  ];

  const items = briefs && briefs.length > 0 ? briefs.slice(0, 5) : defaultBriefs;
  const accent = theme.accentColor === '#0a0a0a' ? '#c0392b' : theme.accentColor;

  return `
    <aside class="in-brief-box" style="border-right: 0.5pt solid ${theme.columnRuleColor};">
      <div class="ib-header" style="background:${theme.accentColor === '#0a0a0a' ? '#0f2b48' : theme.accentColor}; color:#ffffff; font-family:${theme.uiFont};">
        IN BRIEF
      </div>
      <div class="ib-list">
        ${items.map((b) => `
          <div class="ib-item" style="border-bottom: 0.5pt dotted ${theme.columnRuleColor};">
            <span class="ib-cat" style="color:${accent}; font-family:${theme.uiFont};">${b.category.toUpperCase()}</span>
            <h4 class="ib-hl" style="font-family:${theme.headlineFont}; color:${theme.inkColor};">${b.headline}</h4>
            <span class="ib-pg" style="font-family:${theme.uiFont}; color:${theme.inkColor}; opacity:0.65;">${b.category} &nbsp;▸&nbsp; Pg ${b.page || '2'}</span>
          </div>
        `).join('')}
      </div>
    </aside>
  `;
}

// ─── Briefs Strip (Bottom Band of Any Page) ───────────────────────────────────
function renderBriefStrip(briefs: BriefItem[], categoryLabel: string, theme: NewspaperTheme): string {
  const colors = getCategoryColor(categoryLabel.toLowerCase(), theme);
  const title = categoryLabel.split('(')[0].trim().toUpperCase() + ' BRIEFS';
  const accent = theme.accentColor === '#0a0a0a' ? '#c0392b' : theme.accentColor;

  const defaultItems: BriefItem[] = [
    { category: 'Markets', headline: 'RBI keeps repo rate steady at 6.5% amid controlled core inflation', page: '4' },
    { category: 'Investments', headline: 'FDI inflows jump 18% in first half led by manufacturing & fintech', page: '4' },
    { category: 'Technology', headline: 'Indian IT firms secure major multi-billion global AI enterprise deals', page: '4' },
    { category: 'Startups', headline: 'Over 1 lakh new startups officially registered under DPIIT in 2026', page: '4' },
  ];

  const items = briefs && briefs.length > 0 ? briefs.slice(0, 4) : defaultItems;

  return `
    <div class="briefs-strip" style="border-top: 2pt solid ${colors.bg};">
      <div class="bs-tag" style="background:${colors.bg}; color:${colors.text}; font-family:${theme.uiFont};">
        ${title}
      </div>
      <div class="bs-content">
        ${items.map((b, i) => `
          <div class="bs-card" style="${i < items.length - 1 ? `border-right: 0.5pt solid ${theme.columnRuleColor};` : ''}">
            <span class="bs-cat" style="color:${accent}; font-family:${theme.uiFont};">${b.category.toUpperCase()}</span>
            <p class="bs-text" style="color:${theme.inkColor}; font-family:${theme.headlineFont};">${b.headline}</p>
            ${b.page ? `<span class="bs-pg" style="font-family:${theme.uiFont}; color:${theme.inkColor}; opacity:0.6;">Pg ${b.page}</span>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ─── Key Indicators (Page 4 Widget) ───────────────────────────────────────────
function renderKeyIndicatorsWidget(ki: KeyIndicators | null, theme: NewspaperTheme): string {
  const indicators = ki?.indicators && ki.indicators.length > 0 ? ki.indicators : [
    { name: 'SENSEX', value: '67,128.40', change: '1.2%', direction: 'up' as const },
    { name: 'NIFTY 50', value: '20,356.15', change: '1.1%', direction: 'up' as const },
    { name: 'USD / INR', value: '83.24', change: '0.2%', direction: 'down' as const },
    { name: 'GOLD (10g)', value: '₹61,250', change: '0.5%', direction: 'up' as const },
    { name: 'CRUDE OIL', value: '$78.45', change: '0.1%', direction: 'down' as const },
  ];

  return `
    <div class="ki-box" style="border: 0.75pt solid ${theme.columnRuleColor};">
      <div class="ki-title" style="background:${theme.accentColor === '#0a0a0a' ? '#0f2b48' : theme.accentColor}; color:#ffffff; font-family:${theme.uiFont};">
        KEY INDICATORS
      </div>
      <div class="ki-table">
        ${indicators.map((ind) => `
          <div class="ki-row" style="border-bottom: 0.5pt solid ${theme.columnRuleColor}; font-family:${theme.uiFont};">
            <span class="ki-label" style="color:${theme.inkColor}; font-weight:600;">${ind.name}</span>
            <span class="ki-val" style="color:${theme.inkColor}; font-weight:700;">${ind.value}</span>
            <span class="ki-dir" style="color:${ind.direction === 'up' ? '#0d7a3e' : ind.direction === 'down' ? '#c0392b' : '#666'}; font-weight:700;">
              ${ind.direction === 'up' ? '▲' : ind.direction === 'down' ? '▼' : '—'} ${ind.change}
            </span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ─── Pull Quote ───────────────────────────────────────────────────────────────
function renderPullQuote(quote: string, theme: NewspaperTheme): string {
  return `
    <div class="pull-quote" style="border-top: 1pt solid ${theme.inkColor}; border-bottom: 1pt solid ${theme.inkColor};">
      <p class="pq-text" style="font-family:${theme.bodyFont}; color:${theme.inkColor};">
        ❝ ${quote} ❞
      </p>
      <div class="pq-attr" style="font-family:${theme.uiFont}; color:${theme.accentColor === '#0a0a0a' ? '#737373' : theme.accentColor};">
        — SPECIAL CORRESPONDENT
      </div>
    </div>
  `;
}

// ─── Lead Story (Hero Section) ────────────────────────────────────────────────
function renderLeadStory(article: NewsArticle, theme: NewspaperTheme, pubDate?: string): string {
  const paragraphs = cleanArticleText(article.content);
  const displayDate = article.date ? shortDate(article.date) : shortDate(pubDate);
  const imgUrl = sanitizeImageUrl(article.imageUrl || article.images?.[0]?.url, article.category) || getCategoryFallbackImage(article.category);
  const caption = article.imageCaption || article.images?.[0]?.caption || 'National leadership outlines comprehensive modernization initiatives for the decade ahead.';

  const defaultHighlights = [
    'Third-generation infrastructure roadmap finalized',
    'Advanced digital governance and climate monitoring',
    'Stronger global partnerships and multilateral pacts',
    'Phased national rollout begins in current quarter',
  ];
  const highlights = article.keyHighlights && article.keyHighlights.length > 0 ? article.keyHighlights : defaultHighlights;
  const accent = theme.accentColor === '#0a0a0a' ? '#c0392b' : theme.accentColor;

  return `
    <div class="lead-story-container">
      <!-- Top split: Hero Image (left ~68%) + Key Highlights Card (right ~32%) -->
      <div class="lead-media-row">
        <div class="lead-img-col">
          <img src="${imgUrl}" alt="${article.headline}" class="lead-hero-photo" style="border: 0.5pt solid ${theme.inkColor};" />
          <p class="art-caption" style="font-family:${theme.bodyFont}; color:${theme.inkColor}; opacity:0.75;">${caption}</p>
        </div>
        <div class="lead-kh-col" style="border: 0.75pt solid ${theme.columnRuleColor}; border-left: 3pt solid ${accent}; background:${theme.paperBg === '#111827' ? '#1e293b' : 'rgba(0,0,0,0.02)'};">
          <div class="kh-header" style="color:${accent}; font-family:${theme.uiFont};">
            KEY HIGHLIGHTS
          </div>
          <ul class="kh-list" style="color:${theme.inkColor}; font-family:${theme.bodyFont};">
            ${highlights.map((h) => `
              <li><span class="kh-bullet" style="color:${accent};">●</span> ${h}</li>
            `).join('')}
          </ul>
        </div>
      </div>

      <!-- Lead Headline & Subdeck across full lead width -->
      <h2 class="lead-headline" style="font-family:${theme.headlineFont}; color:${theme.inkColor};">
        ${article.headline}
      </h2>
      ${article.subHeadline ? `
        <div class="lead-subdeck" style="font-family:${theme.bodyFont}; color:${theme.inkColor};">
          ${article.subHeadline}
        </div>
      ` : ''}

      <div class="art-byline" style="font-family:${theme.uiFont}; border-bottom: 0.5pt solid ${theme.columnRuleColor}; color:${theme.inkColor}; opacity:0.8;">
        BY ${(article.source || 'STAFF CORRESPONDENT').toUpperCase()} &nbsp;|&nbsp; ${(article.category || 'NATIONAL').toUpperCase()} &nbsp;|&nbsp; ${displayDate}
      </div>

      <!-- 3 Columns of Justified Newspaper Body Text -->
      <div class="lead-body-columns" style="column-rule: 0.4pt solid ${theme.columnRuleColor}; font-family:${theme.bodyFont}; color:${theme.inkColor};">
        ${paragraphs.map((p, idx) => `
          <p class="${idx === 0 ? 'first-paragraph' : ''}">
            ${idx === 0 ? `<strong>NEW DELHI:</strong> ` : ''}${p}
          </p>
        `).join('')}
      </div>
    </div>
  `;
}

// ─── Secondary Story (Compact Authentic Broadsheet) ──────────────────────────
function renderSecondaryStory(article: NewsArticle | null, theme: NewspaperTheme, pubDate?: string, pageJump: string = 'Page 2'): string {
  if (!article) return '';
  const paragraphs = cleanArticleText(article.content);
  const displayDate = article.date ? shortDate(article.date) : shortDate(pubDate);
  const imgUrl = sanitizeImageUrl(article.imageUrl || article.images?.[0]?.url, article.category) || getCategoryFallbackImage(article.category);
  const snippet = paragraphs[0] || 'Government delegates and trade envoys reached significant consensus during high-level bilateral deliberations, highlighting shared priorities and long-term economic alignment.';

  return `
    <article class="sec-story-card">
      <h3 class="sec-story-hl" style="font-family:${theme.headlineFont}; color:${theme.inkColor};">
        ${article.headline}
      </h3>
      ${imgUrl ? `
        <div class="sec-img-wrap">
          <img src="${imgUrl}" alt="${article.headline}" class="sec-thumb" style="border: 0.5pt solid ${theme.inkColor};" />
        </div>
      ` : ''}
      <div class="sec-byline" style="font-family:${theme.uiFont}; color:${theme.inkColor}; opacity:0.75;">
        BY ${(article.source || 'STAFF REPORTER').toUpperCase()} &nbsp;|&nbsp; ${displayDate}
      </div>
      <p class="sec-body" style="font-family:${theme.bodyFont}; color:${theme.inkColor};">
        ${snippet}
      </p>
      <div class="sec-jump" style="font-family:${theme.uiFont}; color:${theme.accentColor === '#0a0a0a' ? '#c0392b' : theme.accentColor};">
        ${pageJump} ▸
      </div>
    </article>
  `;
}

// ─── Special Features & Widgets ──────────────────────────────────────────────
function renderSudokuWidget(sudoku: SudokuPuzzle | null, theme: NewspaperTheme): string {
  return `
    <div class="feature-card" style="border: 0.5pt solid ${theme.columnRuleColor};">
      <div class="fc-header" style="background:${theme.accentColor === '#0a0a0a' ? '#0f2b48' : theme.accentColor}; color:#ffffff; font-family:${theme.uiFont};">
        DAILY SUDOKU
      </div>
      <div class="sudoku-canvas">
        <svg viewBox="0 0 180 180" class="sudoku-grid-svg">
          <rect width="180" height="180" fill="${theme.paperBg}" stroke="${theme.inkColor}" stroke-width="2"/>
          <!-- 3x3 Block Rules -->
          <line x1="60" y1="0" x2="60" y2="180" stroke="${theme.inkColor}" stroke-width="1.5"/>
          <line x1="120" y1="0" x2="120" y2="180" stroke="${theme.inkColor}" stroke-width="1.5"/>
          <line x1="0" y1="60" x2="180" y2="60" stroke="${theme.inkColor}" stroke-width="1.5"/>
          <line x1="0" y1="120" x2="180" y2="120" stroke="${theme.inkColor}" stroke-width="1.5"/>
          <!-- Minor Lines -->
          ${[20, 40, 80, 100, 140, 160].map((c) => `
            <line x1="${c}" y1="0" x2="${c}" y2="180" stroke="${theme.columnRuleColor}" stroke-width="0.5"/>
            <line x1="0" y1="${c}" x2="180" y2="${c}" stroke="${theme.columnRuleColor}" stroke-width="0.5"/>
          `).join('')}
          <!-- Authentic Puzzle Digits -->
          <text x="30" y="15" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">5</text>
          <text x="70" y="15" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">3</text>
          <text x="130" y="15" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">7</text>
          <text x="10" y="35" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">6</text>
          <text x="70" y="35" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">1</text>
          <text x="90" y="35" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">9</text>
          <text x="110" y="35" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">5</text>
          <text x="30" y="55" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">9</text>
          <text x="50" y="55" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">8</text>
          <text x="150" y="55" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">6</text>
          <text x="10" y="75" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">8</text>
          <text x="90" y="75" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">6</text>
          <text x="170" y="75" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">3</text>
          <text x="10" y="95" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">4</text>
          <text x="70" y="95" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">8</text>
          <text x="110" y="95" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">3</text>
          <text x="170" y="95" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">1</text>
          <text x="10" y="115" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">7</text>
          <text x="90" y="115" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">2</text>
          <text x="170" y="115" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">6</text>
          <text x="30" y="135" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">6</text>
          <text x="130" y="135" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">2</text>
          <text x="150" y="135" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">8</text>
          <text x="70" y="155" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">4</text>
          <text x="90" y="155" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">1</text>
          <text x="110" y="155" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">9</text>
          <text x="170" y="155" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">5</text>
          <text x="50" y="175" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">8</text>
          <text x="110" y="175" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">7</text>
          <text x="150" y="175" font-family="${theme.uiFont}" font-size="10" font-weight="700" fill="${theme.inkColor}" text-anchor="middle" dominant-baseline="middle">9</text>
        </svg>
      </div>
      <div class="fc-footer" style="font-family:${theme.uiFont}; color:${theme.inkColor}; opacity:0.7;">
        Difficulty: Moderate &nbsp;|&nbsp; Solution on Page 7
      </div>
    </div>
  `;
}

function renderWeatherWidget(weather: WeatherReport | null, theme: NewspaperTheme): string {
  const forecast = [
    { day: 'TUE', icon: '🌤️', hi: '28°', lo: '21°' },
    { day: 'WED', icon: '🌧️', hi: '26°', lo: '20°' },
    { day: 'THU', icon: '⛈️', hi: '25°', lo: '19°' },
    { day: 'FRI', icon: '🌤️', hi: '27°', lo: '20°' },
    { day: 'SAT', icon: '☀️', hi: '28°', lo: '21°' },
  ];

  return `
    <div class="feature-card" style="border: 0.5pt solid ${theme.columnRuleColor};">
      <div class="fc-header" style="background:${theme.accentColor === '#0a0a0a' ? '#0f2b48' : theme.accentColor}; color:#ffffff; font-family:${theme.uiFont};">
        REGIONAL WEATHER
      </div>
      <div class="wx-main-row">
        <div class="wx-temp-col">
          <span class="wx-huge-temp" style="font-family:${theme.headlineFont}; color:${theme.inkColor};">28°C</span>
          <span class="wx-city-name" style="font-family:${theme.uiFont}; color:${theme.inkColor};">PUNE &bull; PARTLY CLOUDY</span>
        </div>
        <div class="wx-icon-col">🌤️</div>
      </div>
      <div class="wx-table" style="border-top: 0.5pt solid ${theme.columnRuleColor}; font-family:${theme.uiFont};">
        ${forecast.map((f) => `
          <div class="wx-col">
            <span class="wx-day">${f.day}</span>
            <span class="wx-ic">${f.icon}</span>
            <span class="wx-hi" style="color:${theme.inkColor};">${f.hi}</span>
            <span class="wx-lo" style="color:${theme.inkColor}; opacity:0.6;">${f.lo}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderHoroscopeWidget(theme: NewspaperTheme): string {
  const signs = [
    { name: 'Aries', sym: '♈', text: 'Financial ventures gain momentum. Avoid impulsive decisions.' },
    { name: 'Taurus', sym: '♉', text: 'Cooperation with colleagues brings unexpected professional rewards.' },
    { name: 'Gemini', sym: '♊', text: 'Creative endeavors flourish today. Communications bring clarity.' },
    { name: 'Cancer', sym: '♋', text: 'Domestic harmony prevails. Time to recharge and focus on wellbeing.' },
    { name: 'Leo', sym: '♌', text: 'Leadership opportunities present themselves. Stand firm in your ideals.' },
    { name: 'Virgo', sym: '♍', text: 'Attention to detailed planning produces long-term structural success.' },
  ];

  return `
    <div class="feature-card" style="border: 0.5pt solid ${theme.columnRuleColor};">
      <div class="fc-header" style="background:${theme.accentColor === '#0a0a0a' ? '#0f2b48' : theme.accentColor}; color:#ffffff; font-family:${theme.uiFont};">
        TODAY'S HOROSCOPE
      </div>
      <div class="horo-grid">
        ${signs.map((s) => `
          <div class="horo-cell" style="border: 0.5pt dotted ${theme.columnRuleColor};">
            <span class="horo-sym" style="color:${theme.accentColor === '#0a0a0a' ? '#c0392b' : theme.accentColor}; font-family:${theme.uiFont};">${s.sym} ${s.name.toUpperCase()}</span>
            <p class="horo-txt" style="font-family:${theme.bodyFont}; color:${theme.inkColor};">${s.text}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderComicsStrip(theme: NewspaperTheme): string {
  return `
    <div class="comics-container" style="border-top: 1.5pt solid ${theme.inkColor};">
      <div class="comics-header" style="font-family:${theme.uiFont}; color:${theme.inkColor};">
        THE CHRONICLE COMICS &nbsp;|&nbsp; <em>By The Newsroom Syndicate</em>
      </div>
      <div class="comics-panels">
        <div class="comic-panel" style="border: 0.75pt solid ${theme.inkColor};">
          <div class="cp-bubble" style="font-family:${theme.bodyFont}; color:${theme.inkColor};">"Deadlines again?"</div>
          <div class="cp-art">☕ 📰 🏃</div>
          <div class="cp-num" style="font-family:${theme.uiFont};">PANEL 1</div>
        </div>
        <div class="comic-panel" style="border: 0.75pt solid ${theme.inkColor};">
          <div class="cp-bubble" style="font-family:${theme.bodyFont}; color:${theme.inkColor};">"Always. The ink never dries."</div>
          <div class="cp-art">🖨️ 📑 ⏳</div>
          <div class="cp-num" style="font-family:${theme.uiFont};">PANEL 2</div>
        </div>
        <div class="comic-panel" style="border: 0.75pt solid ${theme.inkColor};">
          <div class="cp-bubble" style="font-family:${theme.bodyFont}; color:${theme.inkColor};">"At least we have hot masala chai."</div>
          <div class="cp-art">☕ ✨ 🗞️</div>
          <div class="cp-num" style="font-family:${theme.uiFont};">PANEL 3</div>
        </div>
        <div class="comic-panel" style="border: 0.75pt solid ${theme.inkColor};">
          <div class="cp-bubble" style="font-family:${theme.bodyFont}; color:${theme.inkColor};">"That makes it all worthwhile!"</div>
          <div class="cp-art">🤝 🎉 ☕</div>
          <div class="cp-num" style="font-family:${theme.uiFont};">PANEL 4</div>
        </div>
      </div>
    </div>
  `;
}

// ─── Sports Stats Card ────────────────────────────────────────────────────────
function renderSportsStatCard(theme: NewspaperTheme): string {
  const accent = theme.accentColor === '#0a0a0a' ? '#c2410c' : theme.accentColor;
  return `
    <div class="stat-card-box" style="border: 0.75pt solid ${theme.columnRuleColor}; background:${theme.paperBg === '#111827' ? '#1e293b' : 'rgba(0,0,0,0.02)'};">
      <div class="sc-header" style="background:${accent}; color:#ffffff; font-family:${theme.uiFont};">
        PLAYER OF THE TOURNAMENT
      </div>
      <div class="sc-body">
        <div class="sc-stat-row">
          <div class="sc-num" style="font-family:${theme.headlineFont}; color:${accent};">784</div>
          <div class="sc-lbl" style="font-family:${theme.uiFont}; color:${theme.inkColor};">RUNS SCORED</div>
        </div>
        <div class="sc-stat-row">
          <div class="sc-num" style="font-family:${theme.headlineFont}; color:${accent};">5</div>
          <div class="sc-lbl" style="font-family:${theme.uiFont}; color:${theme.inkColor};">CENTURIES</div>
        </div>
        <div class="sc-stat-row">
          <div class="sc-num" style="font-family:${theme.headlineFont}; color:${accent};">92.3</div>
          <div class="sc-lbl" style="font-family:${theme.uiFont}; color:${theme.inkColor};">BATTING AVERAGE</div>
        </div>
      </div>
      <div class="sc-footer" style="font-family:${theme.uiFont}; color:${theme.inkColor}; opacity:0.7;">
        Record tournament tally across 11 matches
      </div>
    </div>
  `;
}

// ─── State Roundup Grid (Page 2) ──────────────────────────────────────────────
function renderStateRoundup(theme: NewspaperTheme): string {
  const states = [
    { state: 'MAHARASHTRA', headline: 'New industrial corridor plan announced for Marathwada region', tag: 'Mumbai' },
    { state: 'DELHI', headline: 'Air quality mitigation measures strengthened ahead of winter season', tag: 'New Delhi' },
    { state: 'KARNATAKA', headline: 'Tech and semiconductor investments cross ₹50,000 crore milestone', tag: 'Bengaluru' },
    { state: 'TAMIL NADU', headline: 'Comprehensive public education modernization reforms take effect', tag: 'Chennai' },
  ];

  return `
    <div class="state-roundup-container" style="border-top: 1.5pt solid ${theme.inkColor};">
      <div class="sru-header" style="background:${theme.accentColor === '#0a0a0a' ? '#991b1b' : theme.accentColor}; color:#ffffff; font-family:${theme.uiFont};">
        STATE ROUNDUP &nbsp;—&nbsp; KEY DEVELOPMENTS ACROSS THE NATION
      </div>
      <div class="sru-grid">
        ${states.map((s, idx) => `
          <div class="sru-card" style="${idx < states.length - 1 ? `border-right: 0.5pt solid ${theme.columnRuleColor};` : ''}">
            <span class="sru-state" style="color:${theme.accentColor === '#0a0a0a' ? '#c0392b' : theme.accentColor}; font-family:${theme.uiFont};">${s.state}</span>
            <h4 class="sru-hl" style="font-family:${theme.headlineFont}; color:${theme.inkColor};">${s.headline}</h4>
            <span class="sru-tag" style="font-family:${theme.uiFont}; color:${theme.inkColor}; opacity:0.6;">Dateline: ${s.tag}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ─── Page Dispatcher & Construction ──────────────────────────────────────────
function renderPage(page: NewspaperPage, pub: PublicationConfig, theme: NewspaperTheme): string {
  const pageNum = page.pageNumber;
  const isP1 = pageNum === 1;

  // Extract filled content blocks
  const articles: NewsArticle[] = [];
  page.slots.forEach((s) => {
    if (s.assignedContent && (s.assignedContent.type === 'article' || s.assignedContent.type === 'manual-article')) {
      const data = s.assignedContent.data as any;
      articles.push({
        id: data.id || s.id,
        headline: data.headline || s.assignedContent.title,
        subHeadline: data.subHeadline || data.shortDescription,
        content: data.content || '',
        imageUrl: data.imageUrl || data.images?.[0]?.url,
        imageCaption: data.imageCaption || data.caption,
        category: data.category || page.category,
        source: data.source || data.author || 'Staff Reporter',
        date: data.date || pub.date,
        keyHighlights: data.keyHighlights,
        pullQuote: data.pullQuote,
      });
    }
  });

  // Fallback defaults if slots are unassigned
  if (articles.length === 0) {
    articles.push({
      id: `p${pageNum}-lead`,
      headline: isP1 ? 'India Launches Ambitious Mission to Strengthen Global Space Presence' : `${page.categoryLabel} Strategic Framework Announced`,
      subHeadline: 'Comprehensive policy initiatives drive unprecedented expansion across core national sectors',
      content: 'New Delhi: Senior officials on Monday ratified a landmark policy architecture designed to accelerate indigenous technological capabilities and strategic research infrastructure. The program represents a coordinated multi-sector roadmap with extensive capital commitments.\nIndustry representatives praised the long-term clarity provided by the regulatory provisions, noting that international research collaborations and domestic manufacturing hubs are poised to benefit substantially.\nImplementation begins immediately with pilot operations scheduled across seven designated hubs before nationwide integration next quarter.',
      imageUrl: getCategoryFallbackImage(page.category),
      imageCaption: 'Delegates and strategic partners review implementation timelines at the national conclave.',
      category: page.category,
      source: 'Special Correspondent',
      date: pub.date,
      keyHighlights: [
        'Multi-decade technology modernization roadmap ratified',
        'State-of-the-art climate observation and satellite systems',
        'Direct partnerships with premier international institutions',
        'Substantial boost for local manufacturing and high-tech supply chains',
      ],
      pullQuote: 'A historic transformation that sets the benchmark for decades to come.',
    });
  }

  // Ensure at least 4 articles for full layout presentation
  while (articles.length < 4) {
    const idx = articles.length + 1;
    articles.push({
      id: `p${pageNum}-art-${idx}`,
      headline: idx === 2
        ? 'Bilateral Strategic Dialogues Signal Robust Economic Alignment'
        : idx === 3
        ? 'Climate Initiatives Gain Ground as Renewable Capacities Expand'
        : 'Capital Markets Touch New Highs Led by Domestic Institutions',
      content: 'Delegates reaffirmed strong commitments toward mutual cooperation during high-level working sessions in the capital, focusing on trade facilitation and infrastructure modernization.\nBoth sides expressed confidence that ongoing regulatory revisions will streamline investments and foster sustainable industrial growth.',
      imageUrl: getCategoryFallbackImage(page.category),
      category: page.category,
      source: 'Staff Reporter',
      date: pub.date,
    });
  }

  let html = '';

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 1: FRONT PAGE SPECIAL AUTHENTIC BROADSHEET LAYOUT
  // ══════════════════════════════════════════════════════════════════════════
  if (isP1) {
    html += `
      ${renderCategoryStrip(page, theme, 1)}
      ${renderMasthead(pub, theme)}

      <!-- Hero Section: IN BRIEF (left 19%) + LEAD STORY (right 81%) -->
      <div class="fp-hero-grid">
        <div class="fp-hero-left">
          ${renderInBriefSidebar(page.briefs, theme)}
        </div>
        <div class="fp-hero-right">
          ${renderLeadStory(articles[0], theme, pub.date)}
        </div>
      </div>

      <!-- Section Divider Rule -->
      <div class="section-divider" style="border-top: 1.5pt solid ${theme.inkColor}; margin: 3px 0 5px 0;"></div>

      <!-- Secondary Row: 3 Equal Columns Across Full Page Width -->
      <div class="fp-secondary-grid">
        <div class="fp-sec-col">
          ${renderSecondaryStory(articles[1], theme, pub.date, 'Page 2')}
        </div>
        <div class="col-divider" style="border-right: 0.5pt solid ${theme.columnRuleColor};"></div>
        <div class="fp-sec-col">
          ${renderSecondaryStory(articles[2], theme, pub.date, 'Page 3')}
        </div>
        <div class="col-divider" style="border-right: 0.5pt solid ${theme.columnRuleColor};"></div>
        <div class="fp-sec-col">
          ${renderSecondaryStory(articles[3], theme, pub.date, 'Page 4')}
        </div>
      </div>

      <!-- Bottom Briefs Strip -->
      ${renderBriefStrip(page.briefs, 'FRONT PAGE', theme)}
    `;
    return html;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // INNER PAGES (PAGES 2 TO 8)
  // ══════════════════════════════════════════════════════════════════════════
  html += renderCategoryStrip(page, theme, pageNum);

  switch (page.category) {
    case 'politics':
      html += `
        <div class="inner-hero-row">
          <div class="ih-col-large">
            <article class="inner-lead">
              <h2 class="inner-hl-main" style="font-family:${theme.headlineFont}; color:${theme.inkColor};">${articles[0].headline}</h2>
              ${articles[0].subHeadline ? `<div class="lead-subdeck" style="font-family:${theme.bodyFont}; color:${theme.inkColor};">${articles[0].subHeadline}</div>` : ''}
              <div class="art-byline" style="font-family:${theme.uiFont}; border-bottom:0.5pt solid ${theme.columnRuleColor}; color:${theme.inkColor}; opacity:0.8;">
                BY ${articles[0].source.toUpperCase()} &nbsp;|&nbsp; ${shortDate(pub.date)}
              </div>
              <div class="ih-media">
                <img src="${sanitizeImageUrl(articles[0].imageUrl, 'politics') || getCategoryFallbackImage('politics')}" class="inner-photo" style="border:0.5pt solid ${theme.inkColor};" />
              </div>
              <div class="inner-3col-body" style="column-rule:0.4pt solid ${theme.columnRuleColor}; font-family:${theme.bodyFont}; color:${theme.inkColor};">
                <p><strong>NEW DELHI:</strong> ${articles[0].content}</p>
                ${renderPullQuote(articles[0].pullQuote || 'People want development, transparency and real change.', theme)}
              </div>
            </article>
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="ih-col-side">
            ${renderSecondaryStory(articles[1], theme, pub.date, 'Page 2')}
          </div>
        </div>
        ${renderStateRoundup(theme)}
        ${renderBriefStrip(page.briefs, page.categoryLabel, theme)}
      `;
      break;

    case 'business-tech':
      html += `
        <div class="inner-hero-row">
          <div class="ih-col-large">
            <article class="inner-lead">
              <h2 class="inner-hl-main" style="font-family:${theme.headlineFont}; color:${theme.inkColor};">${articles[0].headline}</h2>
              <div class="art-byline" style="font-family:${theme.uiFont}; border-bottom:0.5pt solid ${theme.columnRuleColor}; color:${theme.inkColor}; opacity:0.8;">
                BY FINANCIAL BUREAU &nbsp;|&nbsp; ${shortDate(pub.date)}
              </div>
              <div class="ih-media">
                <img src="${sanitizeImageUrl(articles[0].imageUrl, 'business') || getCategoryFallbackImage('business')}" class="inner-photo" style="border:0.5pt solid ${theme.inkColor};" />
              </div>
              <div class="inner-3col-body" style="column-rule:0.4pt solid ${theme.columnRuleColor}; font-family:${theme.bodyFont}; color:${theme.inkColor};">
                <p><strong>MUMBAI:</strong> ${articles[0].content}</p>
              </div>
            </article>
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="ih-col-side">
            ${renderKeyIndicatorsWidget(null, theme)}
            <div style="margin-top: 8px;">
              ${renderSecondaryStory(articles[1], theme, pub.date, 'Page 4')}
            </div>
          </div>
        </div>
        <div class="section-divider" style="border-top:1pt solid ${theme.inkColor}; margin:4px 0;"></div>
        <div class="fp-secondary-grid">
          <div class="fp-sec-col">${renderSecondaryStory(articles[2], theme, pub.date, 'Page 4')}</div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="fp-sec-col">${renderSecondaryStory(articles[3], theme, pub.date, 'Page 4')}</div>
        </div>
        ${renderBriefStrip(page.briefs, page.categoryLabel, theme)}
      `;
      break;

    case 'sports':
      html += `
        <div class="inner-hero-row">
          <div class="ih-col-large">
            <article class="inner-lead">
              <h2 class="inner-hl-main" style="font-family:${theme.headlineFont}; color:${theme.inkColor};">${articles[0].headline}</h2>
              <div class="art-byline" style="font-family:${theme.uiFont}; border-bottom:0.5pt solid ${theme.columnRuleColor}; color:${theme.inkColor}; opacity:0.8;">
                BY SPORTS BUREAU &nbsp;|&nbsp; ${shortDate(pub.date)}
              </div>
              <div class="ih-media">
                <img src="${sanitizeImageUrl(articles[0].imageUrl, 'sports') || getCategoryFallbackImage('sports')}" class="inner-photo" style="border:0.5pt solid ${theme.inkColor};" />
              </div>
              <div class="inner-3col-body" style="column-rule:0.4pt solid ${theme.columnRuleColor}; font-family:${theme.bodyFont}; color:${theme.inkColor};">
                <p><strong>AHMEDABAD:</strong> ${articles[0].content}</p>
              </div>
            </article>
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="ih-col-side">
            ${renderSportsStatCard(theme)}
            <div style="margin-top: 8px;">
              ${renderSecondaryStory(articles[1], theme, pub.date, 'Page 6')}
            </div>
          </div>
        </div>
        <div class="section-divider" style="border-top:1pt solid ${theme.inkColor}; margin:4px 0;"></div>
        <div class="fp-secondary-grid">
          <div class="fp-sec-col">${renderSecondaryStory(articles[2], theme, pub.date, 'Page 6')}</div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="fp-sec-col">${renderSecondaryStory(articles[3], theme, pub.date, 'Page 6')}</div>
        </div>
        ${renderBriefStrip(page.briefs, page.categoryLabel, theme)}
      `;
      break;

    case 'opinion-features':
      html += `
        <div class="inner-hero-row">
          <div class="ih-col-half">
            <div class="op-badge" style="background:${theme.accentColor === '#0a0a0a' ? '#991b1b' : theme.accentColor}; color:#fff; font-family:${theme.uiFont};">EDITORIAL</div>
            <h3 class="inner-hl-main" style="font-family:${theme.headlineFont}; color:${theme.inkColor}; font-size:14pt;">A Stronger, More Inclusive India Is Within Reach</h3>
            <div class="art-byline" style="font-family:${theme.uiFont}; border-bottom:0.5pt solid ${theme.columnRuleColor}; color:${theme.inkColor}; opacity:0.8;">
              THE CHRONICLE EDITORIAL BOARD &nbsp;|&nbsp; ${shortDate(pub.date)}
            </div>
            <div class="op-body" style="column-count:2; column-gap:8px; font-family:${theme.bodyFont}; color:${theme.inkColor};">
              <p class="first-paragraph">${articles[0].content}</p>
            </div>
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="ih-col-half">
            <div class="op-badge" style="background:${theme.accentColor === '#0a0a0a' ? '#1f2937' : theme.accentColor}; color:#fff; font-family:${theme.uiFont};">GUEST COLUMN</div>
            <h3 class="inner-hl-main" style="font-family:${theme.headlineFont}; color:${theme.inkColor}; font-size:14pt;">The Role of Youth in Shaping India's Future</h3>
            <div class="art-byline" style="font-family:${theme.uiFont}; border-bottom:0.5pt solid ${theme.columnRuleColor}; color:${theme.inkColor}; opacity:0.8;">
              BY RAJESH MISHRA &nbsp;|&nbsp; SENIOR FELLOW, POLICY FORUM
            </div>
            <div class="op-body" style="column-count:2; column-gap:8px; font-family:${theme.bodyFont}; color:${theme.inkColor};">
              <p class="first-paragraph">${articles[1].content}</p>
            </div>
          </div>
        </div>

        <div class="section-divider" style="border-top:1pt solid ${theme.inkColor}; margin:4px 0;"></div>

        <!-- 3 Feature Widgets Row -->
        <div class="fp-secondary-grid">
          <div class="fp-sec-col">${renderHoroscopeWidget(theme)}</div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="fp-sec-col">${renderSudokuWidget(null, theme)}</div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="fp-sec-col">${renderWeatherWidget(null, theme)}</div>
        </div>

        <!-- Authentic Comics Strip -->
        ${renderComicsStrip(theme)}
        ${renderBriefStrip(page.briefs, page.categoryLabel, theme)}
      `;
      break;

    default:
      // Standard balanced broadsheet layout for international, education, entertainment
      html += `
        <div class="inner-hero-row">
          <div class="ih-col-large">
            <article class="inner-lead">
              <h2 class="inner-hl-main" style="font-family:${theme.headlineFont}; color:${theme.inkColor};">${articles[0].headline}</h2>
              ${articles[0].subHeadline ? `<div class="lead-subdeck" style="font-family:${theme.bodyFont}; color:${theme.inkColor};">${articles[0].subHeadline}</div>` : ''}
              <div class="art-byline" style="font-family:${theme.uiFont}; border-bottom:0.5pt solid ${theme.columnRuleColor}; color:${theme.inkColor}; opacity:0.8;">
                BY ${(articles[0].source || 'CORRESPONDENT').toUpperCase()} &nbsp;|&nbsp; ${shortDate(pub.date)}
              </div>
              <div class="ih-media">
                <img src="${sanitizeImageUrl(articles[0].imageUrl, page.category) || getCategoryFallbackImage(page.category)}" class="inner-photo" style="border:0.5pt solid ${theme.inkColor};" />
              </div>
              <div class="inner-3col-body" style="column-rule:0.4pt solid ${theme.columnRuleColor}; font-family:${theme.bodyFont}; color:${theme.inkColor};">
                <p class="first-paragraph">${articles[0].content}</p>
              </div>
            </article>
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="ih-col-side">
            ${renderSecondaryStory(articles[1], theme, pub.date, `Page ${pageNum}`)}
          </div>
        </div>
        <div class="section-divider" style="border-top:1pt solid ${theme.inkColor}; margin:4px 0;"></div>
        <div class="fp-secondary-grid">
          <div class="fp-sec-col">${renderSecondaryStory(articles[2], theme, pub.date, `Page ${pageNum}`)}</div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="fp-sec-col">${renderSecondaryStory(articles[3], theme, pub.date, `Page ${pageNum}`)}</div>
        </div>
        ${renderBriefStrip(page.briefs, page.categoryLabel, theme)}
      `;
      break;
  }

  return html;
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export function buildNewspaperHTML(pub: PublicationConfig, pages: NewspaperPage[], baseUrl: string = ''): string {
  const theme = getThemeById(pub.themeId || 'classic-broadsheet');
  const isHindi = pub.language === 'hi' || pub.language === 'bn';
  const devanagariStack = "'Noto Sans Devanagari', ";
  const bodyFontFinal = isHindi ? `${devanagariStack}${theme.bodyFont}` : theme.bodyFont;

  let pagesHTML = '';
  const pagesToRender = pages && pages.length > 0 ? pages : [{
    pageNumber: 1,
    category: 'front-page' as PageCategory,
    categoryLabel: 'FRONT PAGE (NATIONAL / LEAD)',
    categoryTagline: 'Most important stories, big headlines, hero image',
    briefs: [],
    slots: [],
  }];

  pagesToRender.forEach((page, idx) => {
    pagesHTML += `
      <section class="page ${idx > 0 ? 'page-break' : ''}">
        <div class="page-inner">
          ${renderPage(page, pub, theme)}
        </div>
      </section>
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
    /* ═══════════════════════════════════════════════════════════════════════
       PREMIUM BROADSHEET NEWSPAPER ENGINE — EXACT PRINT REPRODUCTION
       Matches The Hindu, Indian Express, Times of India & The Guardian
       ═══════════════════════════════════════════════════════════════════════ */

    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    @page {
      size: A4 portrait;
      margin: 0;
    }

    html, body {
      margin: 0;
      padding: 0;
      background: ${theme.paperBg};
      color: ${theme.inkColor};
      font-family: ${bodyFontFinal};
      font-size: 8pt;
      line-height: 1.3;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }

    /* ── Page Geometry (Strict A4: 210mm x 297mm) ───────────────── */
    .page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      background: ${theme.paperBg};
      position: relative;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
      ${theme.paperTexture ? `background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");` : ''}
    }

    .page-inner {
      width: 100%;
      height: 100%;
      padding: 7mm 8.5mm 6mm 8.5mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }

    .page-break {
      page-break-before: always;
      break-before: page;
    }

    /* ── Category Header Strip ──────────────────────────────────── */
    .cat-strip {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2.5px 8px;
      margin-bottom: 4px;
      font-size: 6.5pt;
      letter-spacing: 0.8px;
      line-height: 1;
      flex-shrink: 0;
    }
    .cat-strip-left {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .cat-strip-page {
      font-weight: 700;
      opacity: 0.9;
    }
    .cat-strip-sep {
      opacity: 0.5;
    }
    .cat-strip-name {
      font-weight: 800;
      letter-spacing: 1px;
    }
    .cat-strip-tag {
      font-style: italic;
      font-size: 6pt;
      opacity: 0.85;
    }

    /* ── Masthead ───────────────────────────────────────────────── */
    .masthead {
      margin-bottom: 5px;
      text-align: center;
      flex-shrink: 0;
    }
    .masthead-main {
      padding: 1px 0 3px 0;
      position: relative;
    }
    .masthead-logo {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      max-height: 38px;
      max-width: 80px;
      object-fit: contain;
    }
    .masthead-title {
      font-size: 32pt;
      line-height: 1;
      font-weight: ${theme.mastheadStyle === 'blackletter' ? '400' : '900'};
      letter-spacing: ${theme.mastheadStyle === 'blackletter' ? '0.5px' : '-0.5px'};
      margin: 0;
      padding: 0;
      white-space: nowrap;
    }
    .masthead-tagline {
      font-size: 6.5pt;
      letter-spacing: 2px;
      margin-top: 2px;
      opacity: 0.85;
      font-style: italic;
    }
    .masthead-dateline {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2.5px 4px;
      margin-top: 3px;
      font-size: 6pt;
      font-weight: 700;
      letter-spacing: 0.5px;
      line-height: 1;
    }
    .md-col { white-space: nowrap; }
    .md-center { text-align: center; font-weight: 800; }

    /* ── Front Page Hero Grid (In-Brief + Lead Story) ───────────── */
    .fp-hero-grid {
      display: flex;
      gap: 0;
      flex: 1;
      min-height: 0;
      margin-bottom: 3px;
    }
    .fp-hero-left {
      width: 19%;
      flex: 0 0 19%;
      min-width: 0;
    }
    .fp-hero-right {
      width: 81%;
      flex: 0 0 81%;
      min-width: 0;
      padding-left: 8px;
      display: flex;
      flex-direction: column;
    }

    /* ── In-Brief Sidebar ───────────────────────────────────────── */
    .in-brief-box {
      height: 100%;
      padding-right: 6px;
      display: flex;
      flex-direction: column;
    }
    .ib-header {
      font-size: 7pt;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-align: center;
      padding: 3px 0;
      margin-bottom: 4px;
      line-height: 1;
    }
    .ib-list {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
    }
    .ib-item {
      padding: 3px 0 4px 0;
    }
    .ib-item:last-child {
      border-bottom: none !important;
    }
    .ib-cat {
      display: block;
      font-size: 5pt;
      font-weight: 800;
      letter-spacing: 0.5px;
      margin-bottom: 1px;
    }
    .ib-hl {
      font-size: 7pt;
      font-weight: 700;
      line-height: 1.15;
      margin-bottom: 2px;
    }
    .ib-pg {
      font-size: 5pt;
      font-weight: 600;
      letter-spacing: 0.3px;
    }

    /* ── Lead Story Elements ────────────────────────────────────── */
    .lead-story-container {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .lead-media-row {
      display: flex;
      gap: 8px;
      margin-bottom: 4px;
      align-items: stretch;
    }
    .lead-img-col {
      flex: 1;
      min-width: 0;
    }
    .lead-hero-photo {
      width: 100%;
      height: 48mm;
      object-fit: cover;
      display: block;
    }
    .art-caption {
      font-size: 5.5pt;
      font-style: italic;
      line-height: 1.15;
      margin-top: 1.5px;
      text-align: right;
    }
    .lead-kh-col {
      width: 31%;
      flex: 0 0 31%;
      padding: 5px 6px;
      display: flex;
      flex-direction: column;
    }
    .kh-header {
      font-size: 6.5pt;
      font-weight: 800;
      letter-spacing: 1px;
      margin-bottom: 4px;
      line-height: 1;
    }
    .kh-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      flex: 1;
    }
    .kh-list li {
      font-size: 6.8pt;
      line-height: 1.2;
      padding: 1.5px 0;
    }
    .kh-bullet {
      font-size: 5.5pt;
      margin-right: 2px;
    }

    .lead-headline {
      font-size: 18.5pt;
      font-weight: 900;
      line-height: 1.05;
      letter-spacing: -0.3px;
      margin: 2px 0;
    }
    .lead-subdeck {
      font-size: 9pt;
      font-style: italic;
      line-height: 1.2;
      margin-bottom: 3px;
      opacity: 0.85;
    }
    .art-byline {
      font-size: 5.5pt;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      padding-bottom: 2px;
      margin-bottom: 4px;
    }
    .lead-body-columns {
      column-count: 3;
      column-gap: 8px;
      text-align: justify;
      hyphens: auto;
      -webkit-hyphens: auto;
      font-size: 7.5pt;
      line-height: 1.28;
      flex: 1;
      overflow: hidden;
    }
    .lead-body-columns p {
      margin-bottom: 3px;
      text-indent: 10px;
    }
    .lead-body-columns p.first-paragraph {
      text-indent: 0;
    }
    .lead-body-columns p.first-paragraph::first-letter {
      font-size: 26pt;
      font-weight: 900;
      font-family: ${theme.headlineFont};
      float: left;
      padding-right: 3px;
      padding-top: 1px;
      line-height: 0.72;
      margin-top: 3px;
      color: ${theme.dropCapColor};
    }

    /* ── Secondary Stories Grid ─────────────────────────────────── */
    .fp-secondary-grid {
      display: flex;
      gap: 0;
      align-items: stretch;
      margin: 3px 0 4px 0;
      flex-shrink: 0;
    }
    .fp-sec-col {
      flex: 1;
      min-width: 0;
      padding: 0 6px;
    }
    .fp-sec-col:first-child { padding-left: 0; }
    .fp-sec-col:last-child { padding-right: 0; }
    .col-divider {
      width: 1px;
      flex-shrink: 0;
    }

    .sec-story-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .sec-story-hl {
      font-size: 10pt;
      font-weight: 800;
      line-height: 1.12;
      letter-spacing: -0.2px;
      margin-bottom: 2px;
    }
    .sec-img-wrap {
      margin: 2px 0;
    }
    .sec-thumb {
      width: 100%;
      height: 22mm;
      object-fit: cover;
      display: block;
    }
    .sec-byline {
      font-size: 5pt;
      font-weight: 700;
      letter-spacing: 0.4px;
      margin-bottom: 2px;
    }
    .sec-body {
      font-size: 7.2pt;
      line-height: 1.25;
      text-align: justify;
      hyphens: auto;
      flex: 1;
      overflow: hidden;
    }
    .sec-jump {
      font-size: 5.5pt;
      font-weight: 700;
      text-align: right;
      margin-top: 2px;
      letter-spacing: 0.3px;
    }

    /* ── Briefs Strip (Bottom Band) ─────────────────────────────── */
    .briefs-strip {
      margin-top: auto;
      flex-shrink: 0;
    }
    .bs-tag {
      font-size: 6pt;
      font-weight: 800;
      letter-spacing: 1.2px;
      padding: 2px 6px;
      line-height: 1;
    }
    .bs-content {
      display: flex;
      gap: 0;
      align-items: stretch;
      padding: 3px 0 0 0;
    }
    .bs-card {
      flex: 1;
      padding: 0 6px;
      box-sizing: border-box;
    }
    .bs-card:first-child { padding-left: 0; }
    .bs-card:last-child { padding-right: 0; }
    .bs-cat {
      display: block;
      font-size: 5pt;
      font-weight: 800;
      letter-spacing: 0.5px;
      margin-bottom: 1px;
    }
    .bs-text {
      font-size: 6.8pt;
      font-weight: 700;
      line-height: 1.15;
      margin: 0;
    }
    .bs-pg {
      display: block;
      font-size: 5pt;
      font-weight: 600;
      margin-top: 1px;
    }

    /* ── Inner Pages Layout Elements ────────────────────────────── */
    .inner-hero-row {
      display: flex;
      gap: 0;
      flex: 1;
      min-height: 0;
      margin-bottom: 4px;
    }
    .ih-col-large {
      width: 68%;
      flex: 0 0 68%;
      padding-right: 8px;
    }
    .ih-col-side {
      width: 32%;
      flex: 0 0 32%;
      padding-left: 8px;
    }
    .ih-col-half {
      width: 50%;
      flex: 0 0 50%;
      padding: 0 8px;
    }
    .ih-col-half:first-child { padding-left: 0; }
    .ih-col-half:last-child { padding-right: 0; }

    .inner-lead {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .inner-hl-main {
      font-size: 15pt;
      font-weight: 900;
      line-height: 1.08;
      letter-spacing: -0.3px;
      margin-bottom: 2px;
    }
    .inner-photo {
      width: 100%;
      height: 38mm;
      object-fit: cover;
      display: block;
      margin: 3px 0;
    }
    .inner-3col-body {
      column-count: 3;
      column-gap: 8px;
      text-align: justify;
      font-size: 7.4pt;
      line-height: 1.26;
      flex: 1;
      overflow: hidden;
    }
    .inner-3col-body p {
      margin-bottom: 3px;
      text-indent: 10px;
    }
    .inner-3col-body p.first-paragraph {
      text-indent: 0;
    }

    /* ── Pull Quote ─────────────────────────────────────────────── */
    .pull-quote {
      margin: 4px 0;
      padding: 3px 0;
      text-align: center;
      break-inside: avoid;
    }
    .pq-text {
      font-size: 8.5pt;
      font-style: italic;
      font-weight: 600;
      line-height: 1.25;
      margin: 0;
      text-indent: 0 !important;
    }
    .pq-attr {
      font-size: 5.5pt;
      font-weight: 700;
      letter-spacing: 0.5px;
      margin-top: 2px;
    }

    /* ── State Roundup (Page 2) ─────────────────────────────────── */
    .state-roundup-container {
      margin: 3px 0;
      flex-shrink: 0;
    }
    .sru-header {
      font-size: 6.5pt;
      font-weight: 800;
      letter-spacing: 1.2px;
      padding: 2.5px 6px;
      line-height: 1;
    }
    .sru-grid {
      display: flex;
      gap: 0;
      padding: 3px 0;
    }
    .sru-card {
      flex: 1;
      padding: 0 6px;
    }
    .sru-card:first-child { padding-left: 0; }
    .sru-card:last-child { padding-right: 0; }
    .sru-state {
      display: block;
      font-size: 5pt;
      font-weight: 800;
      letter-spacing: 0.5px;
      margin-bottom: 1px;
    }
    .sru-hl {
      font-size: 7.5pt;
      font-weight: 700;
      line-height: 1.15;
      margin-bottom: 2px;
    }
    .sru-tag {
      display: block;
      font-size: 4.8pt;
      font-style: italic;
    }

    /* ── Key Indicators (Page 4) ────────────────────────────────── */
    .ki-box {
      margin-bottom: 4px;
    }
    .ki-title {
      font-size: 6.5pt;
      font-weight: 800;
      letter-spacing: 1px;
      text-align: center;
      padding: 2.5px 0;
      line-height: 1;
    }
    .ki-table {
      padding: 1px 4px;
    }
    .ki-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px 0;
      font-size: 6.5pt;
      line-height: 1;
    }
    .ki-row:last-child { border-bottom: none !important; }
    .ki-dir { font-size: 6pt; }

    /* ── Sports Stat Card ───────────────────────────────────────── */
    .stat-card-box {
      margin-bottom: 4px;
      padding-bottom: 4px;
    }
    .sc-header {
      font-size: 6.5pt;
      font-weight: 800;
      letter-spacing: 1px;
      text-align: center;
      padding: 2.5px 0;
      line-height: 1;
    }
    .sc-body {
      display: flex;
      justify-content: space-around;
      padding: 5px 0;
      text-align: center;
    }
    .sc-stat-row { display: flex; flex-direction: column; align-items: center; }
    .sc-num { font-size: 16pt; font-weight: 900; line-height: 1; }
    .sc-lbl { font-size: 5pt; font-weight: 700; letter-spacing: 0.5px; margin-top: 1px; }
    .sc-footer { font-size: 5pt; text-align: center; font-style: italic; }

    /* ── Opinion & Features (Page 8) ────────────────────────────── */
    .op-badge {
      display: inline-block;
      font-size: 5.5pt;
      font-weight: 800;
      letter-spacing: 1px;
      padding: 1.5px 5px;
      line-height: 1;
      margin-bottom: 3px;
    }
    .op-body {
      text-align: justify;
      font-size: 7.2pt;
      line-height: 1.25;
    }

    /* ── Feature Cards (Sudoku, Weather, Horoscope) ─────────────── */
    .feature-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .fc-header {
      font-size: 6pt;
      font-weight: 800;
      letter-spacing: 1px;
      text-align: center;
      padding: 2px 0;
      line-height: 1;
    }
    .sudoku-canvas {
      padding: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
    }
    .sudoku-grid-svg {
      width: 34mm;
      height: 34mm;
      display: block;
    }
    .fc-footer {
      font-size: 4.8pt;
      text-align: center;
      padding: 1px 0 2px 0;
    }

    .wx-main-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 3px 6px;
    }
    .wx-temp-col { display: flex; flex-direction: column; }
    .wx-huge-temp { font-size: 16pt; font-weight: 900; line-height: 1; }
    .wx-city-name { font-size: 5.5pt; font-weight: 700; letter-spacing: 0.5px; margin-top: 1px; }
    .wx-icon-col { font-size: 18pt; line-height: 1; }
    .wx-table {
      display: flex;
      justify-content: space-between;
      padding: 2px 4px;
      text-align: center;
    }
    .wx-col { display: flex; flex-direction: column; align-items: center; }
    .wx-day { font-size: 4.8pt; font-weight: 700; }
    .wx-ic { font-size: 7pt; margin: 1px 0; }
    .wx-hi { font-size: 5.5pt; font-weight: 700; }
    .wx-lo { font-size: 5pt; }

    .horo-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2px;
      padding: 2px;
      flex: 1;
    }
    .horo-cell {
      padding: 2px;
    }
    .horo-sym {
      display: block;
      font-size: 5pt;
      font-weight: 800;
      letter-spacing: 0.4px;
      margin-bottom: 1px;
    }
    .horo-txt {
      font-size: 5.2pt;
      line-height: 1.15;
      margin: 0;
    }

    /* ── The Chronicle Comics Strip ─────────────────────────────── */
    .comics-container {
      margin: 3px 0;
      flex-shrink: 0;
    }
    .comics-header {
      font-size: 6pt;
      font-weight: 800;
      letter-spacing: 1px;
      padding-bottom: 2px;
      line-height: 1;
    }
    .comics-panels {
      display: flex;
      gap: 4px;
    }
    .comic-panel {
      flex: 1;
      height: 19mm;
      padding: 3px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }
    .cp-bubble {
      font-size: 5.8pt;
      font-style: italic;
      font-weight: 600;
      line-height: 1.15;
    }
    .cp-art {
      font-size: 14pt;
      text-align: center;
      line-height: 1;
    }
    .cp-num {
      font-size: 4.5pt;
      text-align: right;
      opacity: 0.5;
    }

    /* ── Screen & Print Optimization ────────────────────────────── */
    @media screen {
      body {
        background: #1e293b;
        padding: 20px 0;
      }
      .page {
        margin: 0 auto 30px auto;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      }
    }

    @media print {
      body {
        background: ${theme.paperBg};
        padding: 0;
      }
      .page {
        margin: 0;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  ${pagesHTML}
</body>
</html>`;
}
