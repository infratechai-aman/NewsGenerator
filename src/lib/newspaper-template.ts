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

// Ensures a lead story has rich, multi-paragraph broadsheet depth so 3 columns are filled
function buildFullLeadStoryParagraphs(content: string, headline: string): string[] {
  const paragraphs = cleanArticleText(content);
  const totalWords = paragraphs.reduce((sum, p) => sum + p.split(/\s+/).filter(Boolean).length, 0);

  if (totalWords >= 280) {
    return paragraphs;
  }

  const p1 = paragraphs[0] || `${headline} has triggered extensive strategic deliberations across governance councils and institutional taskforces in the capital.`;
  const p2 = paragraphs[1] || `Key parliamentary and sector representatives emphasized the far-reaching structural implications of these developments, noting that policy frameworks and consultative mechanisms established during recent quarters will govern operational execution. Senior administrative secretariats confirmed that inter-agency coordination committees have already initiated targeted briefings to ensure streamlined regional implementation.`;
  const p3 = paragraphs[2] || `"This marks a foundational inflection point in our programmatic roadmap, establishing a durable balance between immediate developmental imperatives and long-term socio-economic resilience," noted a principal policy advisor during a national press briefing in New Delhi.`;
  const p4 = paragraphs[3] || `Public sentiment and independent sector analyses reflect widespread engagement, with domestic and global observers welcoming the operational transparency and regulatory clarity. Comprehensive consultative conclaves and state-level implementation summits are slated to commence across seven designated economic corridors over the coming weeks.`;

  return [p1, p2, p3, p4];
}

// Ensures secondary stories have sufficient length to fill below the thumbnail with authentic broadsheet substance
function buildRichSecondaryStoryText(content: string, headline: string, minWords: number = 55): string {
  const paragraphs = cleanArticleText(content);
  const text = paragraphs.join(' ').trim();
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length >= minWords) {
    return words.slice(0, minWords + 20).join(' ') + (words.length > minWords + 20 ? '...' : '');
  }
  const base = text || headline;
  return `${base}. Senior administrative officials and industry delegates welcomed the constructive engagement during strategic review conclaves in the capital. Working groups confirmed that revised statutory frameworks and collaborative implementation channels will bolster operational momentum across regional sectors over the coming financial quarters.`;
}

function buildSecondaryStorySnippet(content: string, headline: string): string {
  return buildRichSecondaryStoryText(content, headline, 55);
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
  const mastheadTitle = pub.name || 'The Daily Chronicle';
  const mastheadTagline = pub.tagline || 'TRUTH • PEOPLE • PERSPECTIVE';
  const vol = pub.volume || '18';
  const issue = pub.issue || '204';
  const edition = (pub.edition || 'PUNE EDITION').toUpperCase();
  const price = pub.price || '₹10';

  return `
    <header class="masthead">
      <div class="masthead-main ${pub.mastheadLogo ? 'has-logo' : ''}">
        ${pub.mastheadLogo ? `<div class="masthead-logo-container"><img src="${pub.mastheadLogo}" alt="Logo" class="masthead-logo" /></div>` : ''}
        <div class="masthead-text-block">
          <h1 class="masthead-title" style="font-family:${theme.mastheadFont}; color:${theme.mastheadText};">
            ${mastheadTitle}
          </h1>
          <div class="masthead-tagline" style="font-family:${theme.bodyFont}; color:${theme.mastheadText};">
            — ${mastheadTagline.toUpperCase()} —
          </div>
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

      <!-- Compact Market Pulse widget pinned at bottom to seamlessly fill sidebar height -->
      <div class="ib-pulse-card" style="border: 0.5pt solid ${theme.columnRuleColor}; background:${theme.paperBg === '#111827' ? '#1e293b' : 'rgba(0,0,0,0.02)'};">
        <div class="ib-pulse-title" style="font-family:${theme.uiFont}; color:${accent}; border-bottom:0.5pt solid ${theme.columnRuleColor};">
          DAILY MARKET SNAPSHOT
        </div>
        <div class="ib-pulse-row" style="font-family:${theme.uiFont};">
          <span>SENSEX</span><strong style="color:#0d7a3e;">82,490 ▲ +0.5%</strong>
        </div>
        <div class="ib-pulse-row" style="font-family:${theme.uiFont};">
          <span>NIFTY 50</span><strong style="color:#0d7a3e;">25,235 ▲ +0.4%</strong>
        </div>
        <div class="ib-pulse-row" style="font-family:${theme.uiFont};">
          <span>USD / INR</span><strong style="color:#c0392b;">₹83.92 ▼ -0.04</strong>
        </div>
      </div>
    </aside>
  `;
}

// ─── Briefs Strip (Bottom Band of Any Page) ───────────────────────────────────
function getDefaultBriefs(category: string): BriefItem[] {
  const cat = (category || '').toLowerCase();
  if (cat.includes('politic')) {
    return [
      { category: 'PARLIAMENT', headline: 'Monsoon session concludes after marathon debate on electoral reforms', page: '2' },
      { category: 'ELECTION', headline: 'Election Commission announces schedule for upcoming state assemblies', page: '2' },
      { category: 'JUDICIARY', headline: 'Supreme Court bench upholds new digital personal data rules', page: '3' },
      { category: 'GOVERNANCE', headline: 'Centre rolls out unified single-window clearance for urban infra', page: '2' },
    ];
  }
  if (cat.includes('internat') || cat.includes('world')) {
    return [
      { category: 'G20', headline: 'Member nations ratify historic climate transition investment framework', page: '3' },
      { category: 'TECH DIPLOMACY', headline: 'EU and India sign landmark AI security and semiconductor treaty', page: '3' },
      { category: 'AVIATION', headline: 'New direct air corridors opened linking Mumbai with South American hubs', page: '3' },
      { category: 'ENERGY', headline: 'International Solar Alliance expands microgrid funding to 15 nations', page: '3' },
    ];
  }
  if (cat.includes('busin') || cat.includes('tech') || cat.includes('econom')) {
    return [
      { category: 'SEMICONDUCTORS', headline: 'First indigenous 28nm silicon chips roll out from Dholera fab', page: '4' },
      { category: 'STARTUPS', headline: 'Venture funding touches 18-month high with $2.4B deployed in Q3', page: '4' },
      { category: 'FINTECH', headline: 'UPI crosses 16 billion monthly transactions with cross-border surge', page: '4' },
      { category: 'AUTOMOTIVE', headline: 'Commercial EV registrations cross 25% milestone across tier-1 cities', page: '4' },
    ];
  }
  if (cat.includes('educ') || cat.includes('scien')) {
    return [
      { category: 'SPACE', headline: 'ISRO clears launch window for Chandrayaan-4 lunar sample return', page: '5' },
      { category: 'QUANTUM', headline: 'National Quantum Mission inaugurates central testbed facility', page: '5' },
      { category: 'SCHOLARSHIP', headline: 'Over 2 lakh students awarded premier higher education merit grants', page: '5' },
      { category: 'GENOMICS', headline: 'Indigenous bio-bank repository launched to accelerate rare disease cures', page: '5' },
    ];
  }
  if (cat.includes('sport')) {
    return [
      { category: 'CRICKET', headline: 'India secures commanding lead in Melbourne Test after record opening stand', page: '6' },
      { category: 'BADMINTON', headline: 'National duo storms into finals of Denmark Open Super 750', page: '6' },
      { category: 'FOOTBALL', headline: 'Bengaluru FC moves to top of ISL standings following stoppage winner', page: '6' },
      { category: 'CHESS', headline: 'Indian grandmaster claims sole lead in round seven of Tata Steel Masters', page: '6' },
    ];
  }
  if (cat.includes('entert') || cat.includes('life')) {
    return [
      { category: 'BOX OFFICE', headline: 'Pan-India period drama crosses ₹450 crore worldwide in opening week', page: '7' },
      { category: 'HERITAGE', headline: 'Crafts Biennale brings 300 traditional master artisans to Red Fort', page: '7' },
      { category: 'AWARDS', headline: 'National streaming honors celebrate breakthrough independent cinema', page: '7' },
      { category: 'CULINARY', headline: 'Indigenous millets and regional grains take center stage at food fest', page: '7' },
    ];
  }
  if (cat.includes('opin') || cat.includes('feat')) {
    return [
      { category: 'LETTERS', headline: 'Readers discuss the roadmap for sustainable urban expansion', page: '8' },
      { category: 'ARCHIVES', headline: 'Reflecting on 75 years of constitutional jurisprudence', page: '8' },
      { category: 'ESSAY', headline: 'The evolving language of contemporary public discourse', page: '8' },
      { category: 'PERSPECTIVE', headline: 'Rethinking higher education for the artificial intelligence era', page: '8' },
    ];
  }
  return [
    { category: 'MARKETS', headline: 'RBI keeps repo rate steady at 6.5% amid controlled core inflation', page: '4' },
    { category: 'INVESTMENTS', headline: 'FDI inflows jump 18% in first half led by manufacturing & fintech', page: '4' },
    { category: 'TECHNOLOGY', headline: 'Indian IT firms secure major multi-billion global AI enterprise deals', page: '4' },
    { category: 'STARTUPS', headline: 'Over 1 lakh new startups officially registered under DPIIT in 2026', page: '4' },
  ];
}

function renderBriefStrip(briefs: BriefItem[], category: string, categoryLabel: string, theme: NewspaperTheme): string {
  const colors = getCategoryColor(category.toLowerCase(), theme);
  const title = categoryLabel.split('(')[0].trim().toUpperCase() + ' BRIEFS';
  const accent = theme.accentColor === '#0a0a0a' ? '#c0392b' : theme.accentColor;

  const defaultItems = getDefaultBriefs(category);
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
  const paragraphs = buildFullLeadStoryParagraphs(article.content, article.headline);
  const displayDate = article.date ? shortDate(article.date) : shortDate(pubDate);
  const imgUrl = sanitizeImageUrl(article.imageUrl || article.images?.[0]?.url, article.category) || getCategoryFallbackImage(article.category);
  const caption = article.imageCaption || article.images?.[0]?.caption || 'National leadership and delegates review implementation timelines at the conclave.';

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
            ${idx === 0 && !p.startsWith('NEW DELHI') ? `<strong>NEW DELHI:</strong> ` : ''}${p}
          </p>
        `).join('')}
      </div>
    </div>
  `;
}

// ─── Secondary Story (Compact Authentic Broadsheet) ──────────────────────────
function renderSecondaryStory(
  article: NewsArticle | null,
  theme: NewspaperTheme,
  pubDate?: string,
  pageJump: string = 'Page 2',
  options?: {
    thumbHeight?: string;
    showImage?: boolean;
    minWords?: number;
    headlineSize?: string;
  }
): string {
  if (!article) return '';
  const minWords = options?.minWords || 55;
  const thumbHeight = options?.thumbHeight || '30mm';
  const showImage = options?.showImage !== false;
  const headlineSize = options?.headlineSize || '9.6pt';

  const snippet = buildRichSecondaryStoryText(article.content, article.headline, minWords);
  const displayDate = article.date ? shortDate(article.date) : shortDate(pubDate);
  const imgUrl = showImage ? (sanitizeImageUrl(article.imageUrl || article.images?.[0]?.url, article.category) || getCategoryFallbackImage(article.category)) : null;

  return `
    <article class="sec-story-card">
      <h3 class="sec-story-hl" style="font-family:${theme.headlineFont}; color:${theme.inkColor}; font-size:${headlineSize};">
        ${article.headline}
      </h3>
      ${imgUrl ? `
        <div class="sec-img-wrap">
          <img src="${imgUrl}" alt="${article.headline}" class="sec-thumb" style="border: 0.5pt solid ${theme.inkColor}; height:${thumbHeight};" />
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
          <line x1="60" y1="0" x2="60" y2="180" stroke="${theme.inkColor}" stroke-width="1.5"/>
          <line x1="120" y1="0" x2="120" y2="180" stroke="${theme.inkColor}" stroke-width="1.5"/>
          <line x1="0" y1="60" x2="180" y2="60" stroke="${theme.inkColor}" stroke-width="1.5"/>
          <line x1="0" y1="120" x2="180" y2="120" stroke="${theme.inkColor}" stroke-width="1.5"/>
          ${[20, 40, 80, 100, 140, 160].map((c) => `
            <line x1="${c}" y1="0" x2="${c}" y2="180" stroke="${theme.columnRuleColor}" stroke-width="0.5"/>
            <line x1="0" y1="${c}" x2="180" y2="${c}" stroke="${theme.columnRuleColor}" stroke-width="0.5"/>
          `).join('')}
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

// ─── Modular Feature Strip Components ─────────────────────────────────────────
interface FeatureCardItem {
  state: string;
  headline: string;
  tag?: string;
  summary: string;
}

function renderFeatureStrip(
  headerTitle: string,
  items: FeatureCardItem[],
  theme: NewspaperTheme,
  headerBg?: string
): string {
  const bg = headerBg || (theme.accentColor === '#0a0a0a' ? '#0f2b48' : theme.accentColor);
  const accent = theme.accentColor === '#0a0a0a' ? '#c0392b' : theme.accentColor;

  return `
    <div class="state-roundup-container" style="border-top: 1.5pt solid ${theme.inkColor};">
      <div class="sru-header" style="background:${bg}; color:#ffffff; font-family:${theme.uiFont};">
        ${headerTitle}
      </div>
      <div class="sru-grid">
        ${items.map((item, idx) => `
          <div class="sru-card" style="${idx < items.length - 1 ? `border-right: 0.5pt solid ${theme.columnRuleColor};` : ''}">
            <span class="sru-state" style="color:${accent}; font-family:${theme.uiFont};">${item.state}</span>
            <h4 class="sru-hl" style="font-family:${theme.headlineFont}; color:${theme.inkColor};">${item.headline}</h4>
            <p class="sru-summary" style="font-family:${theme.bodyFont}; color:${theme.inkColor};">${item.summary}</p>
            ${item.tag ? `<span class="sru-tag" style="font-family:${theme.uiFont}; color:${theme.inkColor}; opacity:0.6;">Dateline: ${item.tag}</span>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ─── State Roundup Grid (Page 2 - Politics) ───────────────────────────────────
function renderStateRoundup(theme: NewspaperTheme): string {
  const states: FeatureCardItem[] = [
    { state: 'MAHARASHTRA', headline: 'New industrial corridor plan announced for Marathwada region', tag: 'Mumbai', summary: 'Cabinet sub-committee approves ₹18,400 crore multimodal logistics nodes connecting regional agro-industrial hubs.' },
    { state: 'DELHI', headline: 'Air quality mitigation measures strengthened ahead of winter season', tag: 'New Delhi', summary: 'Municipal taskforces deploy anti-smog equipment and enforce dust-control compliance across construction sites.' },
    { state: 'KARNATAKA', headline: 'Tech and semiconductor investments cross ₹50,000 crore milestone', tag: 'Bengaluru', summary: 'Three advanced fabrication testing units slated to operationalize in electronic city cluster by mid next year.' },
    { state: 'TAMIL NADU', headline: 'Comprehensive public education modernization reforms take effect', tag: 'Chennai', summary: 'Smart classrooms, AI-enabled tutoring, and updated STEM curricula introduced across 4,200 municipal schools.' },
  ];
  return renderFeatureStrip('STATE ROUNDUP — KEY DEVELOPMENTS ACROSS THE NATION', states, theme, '#991b1b');
}

// ─── World in Focus (Page 3 - International) ──────────────────────────────────
function renderWorldInFocus(theme: NewspaperTheme): string {
  const items: FeatureCardItem[] = [
    { state: 'UNITED NATIONS', headline: 'General Assembly adopts landmark framework on digital sovereignty', tag: 'New York', summary: '142 member nations vote in favor of global cybersecurity standards and ethical AI governance protocols.' },
    { state: 'INDO-PACIFIC', headline: 'Maritime security pact expanded to safeguard strategic sea lanes', tag: 'Singapore', summary: 'Regional naval forces announce coordinated surveillance and disaster response taskforces across key straits.' },
    { state: 'EUROPEAN UNION', headline: 'Cross-border clean energy grid integration enters implementation', tag: 'Brussels', summary: 'Ministers approve €45 billion capital fund for high-voltage offshore interconnectors linking 8 member states.' },
    { state: 'AMERICAS', headline: 'Multilateral trade dialogue addresses supply chain resilience', tag: 'Washington', summary: 'Bilateral delegations sign fast-track customs clearance pact for semiconductors and critical minerals.' },
  ];
  return renderFeatureStrip('WORLD IN FOCUS — STRATEGIC DIPLOMATIC & GLOBAL DEVELOPMENTS', items, theme, '#0f172a');
}

// ─── Corporate & Sector Pulse (Page 4 - Business & Tech) ──────────────────────
function renderCorporatePulse(theme: NewspaperTheme): string {
  const items: FeatureCardItem[] = [
    { state: 'AUTOMOTIVE & EVS', headline: 'Commercial EV registrations cross 25% milestone across tier-1 cities', tag: 'Fleet Transition', summary: 'Subsidies and corporate fleet mandates accelerate electric commercial van adoption across major freight hubs.' },
    { state: 'BANKING & FINTECH', headline: 'Digital lending volumes surge 32% driven by unified credit protocol', tag: 'Credit Expansion', summary: 'Public and private banks report record retail asset quality and streamlined MSME loan disbursals.' },
    { state: 'SEMICONDUCTORS', headline: 'First indigenous 28nm silicon chips roll out from Dholera fabrication facility', tag: 'High-Tech Mfg', summary: 'Commercial packaging and validation testing commence with leading consumer electronics partners.' },
    { state: 'VENTURE CAPITAL', headline: 'Early-stage venture funding touches 18-month high with $2.4B deployed', tag: 'Startup Ecosystem', summary: 'Generative enterprise AI, deep-tech robotics, and climate-tech capture over 60% of quarterly capital rounds.' },
  ];
  return renderFeatureStrip('INDUSTRY & SECTOR PULSE — CORPORATE & STARTUP ROUNDUP', items, theme, '#065f46');
}

// ─── Science & Academia Snapshot (Page 5 - Education & Science) ───────────────
function renderSciTechRoundup(theme: NewspaperTheme): string {
  const items: FeatureCardItem[] = [
    { state: 'DEEP SPACE', headline: 'ISRO validates autonomous docking systems for upcoming lunar sample return', tag: 'Space Research', summary: 'Ground station simulations confirm precise rendezvous telemetry for dual-module propulsion stage.' },
    { state: 'CLEAN ENERGY', headline: 'Indigenous next-gen solid-state battery prototypes demonstrate 1,200 charge cycles', tag: 'Materials Science', summary: 'National chemical laboratory signs commercial transfer pact with domestic energy conglomerates.' },
    { state: 'HIGHER EDUCATION', headline: 'National Research Foundation disburses ₹8,000 crore grants to university labs', tag: 'Academic Grants', summary: 'Over 450 interdisciplinary projects in quantum computing and bio-engineering receive multi-year funding.' },
    { state: 'PUBLIC HEALTH', headline: 'Genome mapping initiative completes sequencing of 10,000 representative strains', tag: 'Bio-Informatics', summary: 'Open-access genomic repository opens for diagnostic research targeting rare metabolic disorders.' },
  ];
  return renderFeatureStrip('DISCOVERY & INNOVATION — SCIENCE & ACADEMIA SNAPSHOT', items, theme, '#581c87');
}

// ─── Sports Scoreboard (Page 6 - Sports) ──────────────────────────────────────
function renderSportsScoreboard(theme: NewspaperTheme): string {
  const items: FeatureCardItem[] = [
    { state: 'TEST CRICKET', headline: 'India dominates opening day in Melbourne with commanding 342/3 total', tag: 'MCG Ground', summary: 'Top-order pair register twin centuries as host bowling attack struggles under overcast skies.' },
    { state: 'FOOTBALL', headline: 'Bengaluru FC edge past Mohun Bagan 2-1 in thrilling national league clash', tag: 'ISL Championship', summary: 'Stoppage-time header secures crucial three points in front of a packed home stadium.' },
    { state: 'CHESS', headline: 'Indian grandmaster claims sole lead at Tata Steel Masters tournament', tag: 'Wijk aan Zee', summary: 'Flawless 42-move endgame technique topples world number three in round seven encounter.' },
    { state: 'BADMINTON', headline: 'National doubles duo advances to semifinals of Denmark Open Super 750', tag: 'Odense', summary: 'Straight-game victory over reigning world champions secures podium finish.' },
  ];
  return renderFeatureStrip('THE ARENA — ROUNDUP & CHAMPIONSHIP SCOREBOARD', items, theme, '#c2410c');
}

// ─── Cultural Mosaic (Page 7 - Entertainment & Lifestyle) ─────────────────────
function renderCultureRoundup(theme: NewspaperTheme): string {
  const items: FeatureCardItem[] = [
    { state: 'BOX OFFICE', headline: 'Pan-India period drama crosses ₹450 crore worldwide in record opening week', tag: 'Cinema Box Office', summary: 'Substantial multiplex footfalls and international collections propel theatrical resurgence.' },
    { state: 'HERITAGE & ARTS', headline: 'Triennial Indian Crafts Biennale opens at historic Red Fort pavilions', tag: 'Crafts Exhibition', summary: 'Over 300 traditional master artisans showcase dying weave traditions and stone sculpture.' },
    { state: 'GASTRONOMY', headline: 'Indigenous regional grains take centre stage at global culinary symposium', tag: 'Culinary Trends', summary: 'Michelin-starred chefs explore millet gastronomy and traditional fermentation sciences.' },
    { state: 'STREAMING & OTT', headline: 'National streaming awards celebrate regional storytelling and independent cinema', tag: 'Digital Awards', summary: 'Documentary on Western Ghats biodiversity takes top honors among 40 nominated entries.' },
  ];
  return renderFeatureStrip('CULTURAL MOSAIC — ARTS, CINEMA & LIVING', items, theme, '#831843');
}

// ─── Category-Specific Rich Article Fallbacks ─────────────────────────────────
function getDefaultCategoryArticles(category: string, pageNum: number, pubDate?: string): NewsArticle[] {
  const defaults: Record<string, Array<{ headline: string; subHeadline: string; snippet: string }>> = {
    politics: [
      {
        headline: 'Parliament Clears Major Electoral & Inter-State Governance Reform Bill',
        subHeadline: 'Bipartisan consensus establishes streamlined consultative framework across state legislatures',
        snippet: 'Senior parliamentary leaders ratified landmark governance provisions today, paving the way for digital voting transparency, revised assembly seat delimitations, and institutional dispute resolution mechanisms.',
      },
      {
        headline: 'Cabinet Committee Approves ₹15,000-cr Welfare & Rural Infrastructure Allocations',
        subHeadline: 'Targeted funding aims to boost agricultural logistics and rural connectivity',
        snippet: 'The executive committee cleared a multi-phase infrastructure package targeting cold-storage networks, paved rural highways, and village-level solar irrigation systems.',
      },
      {
        headline: 'Delimitation Commission Concludes Regional Stakeholder Consultations',
        subHeadline: 'Public hearings held across ten administrative zones to ensure representative equity',
        snippet: 'Officials reported broad civic participation during zonal deliberations, noting that revised constituency boundaries will incorporate recent demographic data seamlessly.',
      },
      {
        headline: 'Inter-State Fiscal Council Formulates New Revenue Sharing Formula',
        subHeadline: 'Finance ministers deliberate on GST redistribution and fiscal incentives',
        snippet: 'State finance secretariats agreed on updated weights for environmental forest cover and demographic stabilization in annual tax distribution formulas.',
      },
      {
        headline: 'Judiciary Bench Upholds Landmark Digital Governance & Transparency Protocols',
        subHeadline: 'Constitutional bench affirms citizen data security and public portal accessibility',
        snippet: 'In a unanimous ruling, the apex court validated algorithmic audit mandates for government procurement, reinforcing accountability across public delivery schemes.',
      },
    ],
    international: [
      {
        headline: 'Global Climate Conclave Ratifies Binding Decarbonisation & Finance Accord',
        subHeadline: 'Over 140 nations agree on $100 billion annual climate resilience funding mechanism',
        snippet: 'Delegates concluded high-stakes negotiations in New Delhi with a historic pact establishing binding clean energy transition deadlines and technology sharing corridors.',
      },
      {
        headline: 'UN Security Council Convenes Special Session on Strategic Maritime Corridors',
        subHeadline: 'Member nations deliberate on navigation freedoms and joint anti-piracy patrols',
        snippet: 'Diplomatic envoys underscored the urgent imperative to preserve unimpeded commercial shipping lanes across key straits amid rising geopolitical posturing.',
      },
      {
        headline: 'Cross-Border Semiconductor Alliances Establish Redundant Supply Corridors',
        subHeadline: 'Bilateral industrial pact accelerates wafer foundry investments and talent exchange',
        snippet: 'Key manufacturing economies signed a joint resilience framework ensuring uninterrupted distribution of critical electronic components during global crises.',
      },
      {
        headline: 'G20 Finance Deputies Finalize Common Protocol for Sovereign Debt Restructuring',
        subHeadline: 'Multilateral framework provides predictable relief timelines for developing economies',
        snippet: 'Central bank governors welcomed the transparent debt treatment guidelines, noting that enhanced private sector participation will prevent liquidity crises.',
      },
      {
        headline: 'Multilateral Trade Accord Lowers Non-Tariff Barriers Across 18 Nations',
        subHeadline: 'Harmonized digital standards and mutual recognition agreements take effect',
        snippet: 'Customs authorities initiated paperless trade channels, expecting regional container throughput times to reduce by nearly forty percent.',
      },
    ],
    'business-tech': [
      {
        headline: 'RBI Holds Benchmark Repo Rate at 6.5% Amid Robust Industrial Expansion',
        subHeadline: 'Monetary policy committee notes steady core inflation and buoyant capital capex',
        snippet: 'The central bank maintained its withdrawal of accommodation stance while reaffirming optimistic GDP projections driven by domestic manufacturing and resilient services demand.',
      },
      {
        headline: 'Indian Tech Unicorns Accelerate Global Expansion With Record AI Dealflow',
        subHeadline: 'Enterprise software startups secure multi-million-dollar global procurement contracts',
        snippet: 'Domestic technology firms continue to outperform international peers in deploying specialized generative AI agents for Fortune 500 financial and healthcare operations.',
      },
      {
        headline: 'Foreign Direct Investment Inflows Surge 18% in Core Manufacturing Sectors',
        subHeadline: 'Production-linked incentive programs catalyze high-technology electronic clusters',
        snippet: 'Official commerce data indicated that electronics, pharmaceuticals, and automotive components accounted for over two-thirds of greenfield investments this quarter.',
      },
      {
        headline: 'Capital Markets Scale Fresh Peaks Driven by Domestic Retail Inflows',
        subHeadline: 'Benchmark indices gain for fourth consecutive session as institutional buying persists',
        snippet: 'Systematic investment plans reached record monthly contributions, providing sustained liquidity across mid-cap and large-cap industrial equities.',
      },
      {
        headline: 'Commercial EV Registrations Cross 25% Fleet Milestone Across Tier-1 Cities',
        subHeadline: 'Logistics operators ramp up electric conversions to achieve sustainability targets',
        snippet: 'Fast-charging infrastructure expansion and operating cost benefits drove unprecedented adoption of zero-emission light commercial vehicles in metropolitan hubs.',
      },
    ],
    sports: [
      {
        headline: 'India Dominates Opening Day in Melbourne With Commanding 342/3 Total',
        subHeadline: 'Top-order pair register twin centuries as host bowling attack struggles under overcast skies',
        snippet: 'A masterclass in application and timing saw the national team seize absolute control of the series opener, withstanding early seam movement before dictating terms after lunch.',
      },
      {
        headline: 'National Badminton Prodigies Clinch Twin Titles at Denmark Open Super 750',
        subHeadline: 'Stunning straight-game victories over top seeds cap remarkable European tour',
        snippet: 'The young duo displayed exceptional court coverage and tactical maturity to claim the biggest tournament victory of their blossoming senior international careers.',
      },
      {
        headline: 'ISL Football: Bengaluru FC Clinches Top Table Position With Home Victory',
        subHeadline: 'Stoppage-time header secures crucial three points in front of enthusiastic home crowd',
        snippet: 'An intensely contested tactical encounter was decided in the dying seconds, sending the stadium into wild celebrations and cementing the hosts title credentials.',
      },
      {
        headline: 'World Chess Olympiad: Indian Contingent Takes Commanding Gold Lead',
        subHeadline: 'Flawless individual performances seal whitewash victory over defending champions',
        snippet: 'Displaying deep opening preparation and ruthless endgame execution, the national contingent extended their lead at the summit of the tournament standings.',
      },
      {
        headline: 'Athletics Federation Confirms Record 48-Member Squad for World Championships',
        subHeadline: 'Strong contingent across javelin, steeplechase, and relay disciplines eyes podium finishes',
        snippet: 'Intensive high-altitude training camps concluded successfully as coaches expressed immense optimism regarding multiple medal prospects in European conditions.',
      },
    ],
    'education-science': [
      {
        headline: 'ISRO Unveils Heavy-Lift Reusable Launch Vehicle for Deep Space Missions',
        subHeadline: 'Autonomous runway recovery and methane-liquid oxygen propulsion validated in ground tests',
        snippet: 'Space scientists achieved a crucial technological milestone that will drastically reduce payload launch costs for planned lunar base infrastructure and orbital laboratories.',
      },
      {
        headline: 'National Research Foundation Disburses ₹8,000-cr Interdisciplinary Lab Grants',
        subHeadline: 'Funding targets quantum computing, climate genomics, and advanced materials',
        snippet: 'Over four hundred university laboratories received multi-year endowments aimed at bridging academic research breakthroughs with commercial industrial deployment.',
      },
      {
        headline: 'Indigenous Quantum Computing Facility Achieves 100-Qubit Coherence Record',
        subHeadline: 'Cryogenic quantum processor demonstrates fault-tolerant error correction protocols',
        snippet: 'Researchers hailed the breakthrough as a vital stepping stone toward sovereign quantum computing capabilities for defense and cryptographic applications.',
      },
      {
        headline: 'Higher Education Accreditation Overhaul Ties Funding to Research Outputs',
        subHeadline: 'New assessment framework incentivizes patent filings, peer citations, and industry tie-ups',
        snippet: 'The academic regulatory council launched a transparent digital evaluation matrix to benchmark state and central universities against global standards.',
      },
      {
        headline: 'Biotechnology Mission Announces Phase-3 Clinical Trials for Dengue Vaccine',
        subHeadline: 'Indigenous quadrivalent candidate exhibits robust neutralizing antibody responses',
        snippet: 'Multicentric trials involving thirty thousand volunteers will assess protective efficacy before planned national immunization rollout next year.',
      },
    ],
    'entertainment-lifestyle': [
      {
        headline: 'Indian Cinematic Renaissance Dazzles Global Critics at Venice Biennale',
        subHeadline: 'Independent regional drama receives standing ovation and prestigious jury accolade',
        snippet: 'Captivating audiences with poignant human storytelling and breathtaking rural cinematography, the film marked a triumphant moment for contemporary Indian independent cinema.',
      },
      {
        headline: 'Triennial National Crafts Biennale Opens at Historic Red Fort Pavilions',
        subHeadline: 'Over 300 master artisans showcase vanishing weaving, pottery, and metalwork traditions',
        snippet: 'Curators emphasized the economic vitalization of hereditary craft clusters through contemporary design collaborations and direct fair-trade retail access.',
      },
      {
        headline: 'Heritage Architecture Foundation Restores 14 Century-Old Stepwells',
        subHeadline: 'Ancient water harvesting structures revived as vibrant cultural community hubs',
        snippet: 'A dedicated team of stone conservators and hydrologists completed the multi-year conservation project, blending historical masonry with modern ecological restoration.',
      },
      {
        headline: 'Independent Cinema Movement Secures Global Streaming Distribution Pacts',
        subHeadline: 'Regional language films find unprecedented viewership across international markets',
        snippet: 'Digital platforms reported record subscriber engagement with multilingual subtitled cinema, proving universal resonance for authentic local narratives.',
      },
      {
        headline: 'Indigenous Regional Cuisine Celebrated at International Culinary Congress',
        subHeadline: 'Michelin-starred chefs explore traditional millet fermentation and spice preservation',
        snippet: 'Culinary experts highlighted the holistic nutritional philosophy and ecological sustainability of ancient Indian culinary sciences during live cooking demonstrations.',
      },
    ],
    'opinion-features': [
      {
        headline: 'Editorial: A Stronger, More Resilient India Is Well Within Our Reach',
        subHeadline: 'Strategic self-reliance must walk hand in hand with institutional equity and social trust',
        snippet: 'As our nation navigates complex global realignments and technological frontiers, the durability of our growth will depend fundamentally on the strength of our democratic institutions and inclusive opportunities.',
      },
      {
        headline: 'Guest Column: Demographic Dividend and the Imperative for High-Tech Skills',
        subHeadline: 'Equipping our young workforce with artificial intelligence and engineering mastery',
        snippet: 'India stands at an unprecedented demographic juncture. Translating this human potential into lasting prosperity requires an agile, industry-aligned higher education revolution.',
      },
      {
        headline: 'Perspective: Reimagining Federalism in the Age of High-Speed Digital Public Infra',
        subHeadline: 'Collaborative governance models foster competitive yet cooperative nation-building',
        snippet: 'Digital public goods have unified our financial and administrative geography. Now, federal policy must empower states to tailor implementation to regional aspirations.',
      },
      {
        headline: 'Special Essay: Preserving Our Ecological Heritage Amid Rapid Industrialization',
        subHeadline: 'Balancing economic growth imperatives with sacred reverence for nature',
        snippet: 'True development cannot be measured in concrete alone. Sustainable growth demands that our rivers, forests, and biodiversity remain central to our urban masterplans.',
      },
      {
        headline: 'Voices: Youth Entrepreneurship as the Engine of Bharat’s Transformation',
        subHeadline: 'How tier-2 and tier-3 innovators are solving grassroots challenges at scale',
        snippet: 'From agro-tech in Vidarbha to healthcare logistics in the Northeast, young founders are rewriting the Indian economic narrative with courage and ingenuity.',
      },
    ],
  };

  const catKey = (category || 'politics').toLowerCase();
  const matchedKey = Object.keys(defaults).find((k) => catKey.includes(k)) || 'politics';
  const catList = defaults[matchedKey] || defaults.politics;

  return catList.map((item, idx) => ({
    id: `p${pageNum}-art-${idx + 1}`,
    headline: item.headline,
    subHeadline: item.subHeadline,
    content: item.snippet,
    imageUrl: getCategoryFallbackImage(category as any),
    category: category as any,
    source: idx === 0 ? 'Special Correspondent' : 'Staff Reporter',
    date: pubDate,
    keyHighlights: idx === 0 ? [
      'Landmark statutory and policy framework finalized',
      'Unanimous stakeholder consensus reached across core bodies',
      'Strategic capital commitments allocated for phased rollout',
      'Pilot implementations commence across seven regional hubs',
    ] : undefined,
    pullQuote: idx === 0 ? 'A foundational milestone that anchors long-term resilience and progress.' : undefined,
  }));
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

  // Guarantee at least 5 rich category-specific articles per page
  const defaultCategoryArticles = getDefaultCategoryArticles(page.category, pageNum, pub.date);
  if (articles.length === 0) {
    articles.push(...defaultCategoryArticles);
  } else {
    let defIdx = articles.length;
    while (articles.length < 5 && defIdx < defaultCategoryArticles.length) {
      articles.push(defaultCategoryArticles[defIdx]);
      defIdx++;
    }
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
      <div class="section-divider" style="border-top: 1.5pt solid ${theme.inkColor}; margin: 3px 0 4px 0;"></div>

      <!-- Secondary Row: 3 Equal Columns Across Full Page Width -->
      <div class="fp-secondary-grid">
        <div class="fp-sec-col">
          ${renderSecondaryStory(articles[1], theme, pub.date, 'Page 2', { thumbHeight: '34mm', minWords: 60 })}
        </div>
        <div class="col-divider" style="border-right: 0.5pt solid ${theme.columnRuleColor};"></div>
        <div class="fp-sec-col">
          ${renderSecondaryStory(articles[2], theme, pub.date, 'Page 3', { thumbHeight: '34mm', minWords: 60 })}
        </div>
        <div class="col-divider" style="border-right: 0.5pt solid ${theme.columnRuleColor};"></div>
        <div class="fp-sec-col">
          ${renderSecondaryStory(articles[3], theme, pub.date, 'Page 4', { thumbHeight: '34mm', minWords: 60 })}
        </div>
      </div>

      <!-- Bottom Briefs Strip anchored at page bottom -->
      ${renderBriefStrip(page.briefs, 'front-page', 'FRONT PAGE', theme)}
    `;
    return html;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // INNER PAGES (PAGES 2 TO 8): COMPLETE 3-TIER BROADSHEET ARCHITECTURE
  // Fills 100% of printable height with zero empty voids
  // ══════════════════════════════════════════════════════════════════════════
  html += renderCategoryStrip(page, theme, pageNum);

  switch (page.category) {
    case 'politics': {
      const pLead = buildFullLeadStoryParagraphs(articles[0].content, articles[0].headline);
      html += `
        <!-- Tier 1: Politics Hero Row (Lead Story 68% + Focus Story 32%) -->
        <div class="inner-hero-row">
          <div class="ih-col-large">
            <article class="inner-lead">
              <h2 class="inner-hl-main" style="font-family:${theme.headlineFont}; color:${theme.inkColor};">${articles[0].headline}</h2>
              ${articles[0].subHeadline ? `<div class="lead-subdeck" style="font-family:${theme.bodyFont}; color:${theme.inkColor};">${articles[0].subHeadline}</div>` : ''}
              <div class="art-byline" style="font-family:${theme.uiFont}; border-bottom:0.5pt solid ${theme.columnRuleColor}; color:${theme.inkColor}; opacity:0.8;">
                BY ${(articles[0].source || 'SPECIAL CORRESPONDENT').toUpperCase()} &nbsp;|&nbsp; ${shortDate(pub.date)}
              </div>
              <div class="ih-media">
                <img src="${sanitizeImageUrl(articles[0].imageUrl, 'politics') || getCategoryFallbackImage('politics')}" class="inner-photo" style="border:0.5pt solid ${theme.inkColor};" />
              </div>
              <div class="inner-3col-body" style="column-rule:0.4pt solid ${theme.columnRuleColor}; font-family:${theme.bodyFont}; color:${theme.inkColor};">
                ${pLead.map((p, idx) => `<p class="${idx === 0 ? 'first-paragraph' : ''}">${p}</p>`).join('')}
                ${renderPullQuote(articles[0].pullQuote || 'Democracy and representative governance thrive on constructive legislative deliberation.', theme)}
              </div>
            </article>
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="ih-col-side">
            ${renderSecondaryStory(articles[1], theme, pub.date, 'Page 2', { thumbHeight: '34mm', minWords: 65, headlineSize: '10.5pt' })}
          </div>
        </div>

        <div class="section-divider" style="border-top:1pt solid ${theme.inkColor}; margin:3px 0 2px 0;"></div>

        <!-- Tier 2: 3 Secondary Stories Across 100% Width -->
        <div class="fp-secondary-grid">
          <div class="fp-sec-col">
            ${renderSecondaryStory(articles[2], theme, pub.date, 'Page 2', { thumbHeight: '28mm', minWords: 55 })}
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="fp-sec-col">
            ${renderSecondaryStory(articles[3], theme, pub.date, 'Page 2', { thumbHeight: '28mm', minWords: 55 })}
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="fp-sec-col">
            ${renderSecondaryStory(articles[4], theme, pub.date, 'Page 2', { thumbHeight: '28mm', minWords: 55 })}
          </div>
        </div>

        <!-- Tier 3: State Roundup 4-Card Strip -->
        ${renderStateRoundup(theme)}

        <!-- Tier 4: Bottom Briefs Strip -->
        ${renderBriefStrip(page.briefs, page.category, page.categoryLabel, theme)}
      `;
      break;
    }

    case 'international': {
      const iLead = buildFullLeadStoryParagraphs(articles[0].content, articles[0].headline);
      html += `
        <!-- Tier 1: International Hero Row (World Lead 68% + Diplomatic Dispatch 32%) -->
        <div class="inner-hero-row">
          <div class="ih-col-large">
            <article class="inner-lead">
              <h2 class="inner-hl-main" style="font-family:${theme.headlineFont}; color:${theme.inkColor};">${articles[0].headline}</h2>
              ${articles[0].subHeadline ? `<div class="lead-subdeck" style="font-family:${theme.bodyFont}; color:${theme.inkColor};">${articles[0].subHeadline}</div>` : ''}
              <div class="art-byline" style="font-family:${theme.uiFont}; border-bottom:0.5pt solid ${theme.columnRuleColor}; color:${theme.inkColor}; opacity:0.8;">
                BY DIPLOMATIC CORRESPONDENT &nbsp;|&nbsp; ${shortDate(pub.date)}
              </div>
              <div class="ih-media">
                <img src="${sanitizeImageUrl(articles[0].imageUrl, 'international') || getCategoryFallbackImage('international')}" class="inner-photo" style="border:0.5pt solid ${theme.inkColor};" />
              </div>
              <div class="inner-3col-body" style="column-rule:0.4pt solid ${theme.columnRuleColor}; font-family:${theme.bodyFont}; color:${theme.inkColor};">
                ${iLead.map((p, idx) => `<p class="${idx === 0 ? 'first-paragraph' : ''}">${p}</p>`).join('')}
                ${renderPullQuote(articles[0].pullQuote || 'Multilateralism remains the essential anchor for global security and sustainable trade.', theme)}
              </div>
            </article>
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="ih-col-side">
            ${renderSecondaryStory(articles[1], theme, pub.date, 'Page 3', { thumbHeight: '34mm', minWords: 65, headlineSize: '10.5pt' })}
          </div>
        </div>

        <div class="section-divider" style="border-top:1pt solid ${theme.inkColor}; margin:3px 0 2px 0;"></div>

        <!-- Tier 2: 3 Secondary Stories Across 100% Width -->
        <div class="fp-secondary-grid">
          <div class="fp-sec-col">
            ${renderSecondaryStory(articles[2], theme, pub.date, 'Page 3', { thumbHeight: '28mm', minWords: 55 })}
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="fp-sec-col">
            ${renderSecondaryStory(articles[3], theme, pub.date, 'Page 3', { thumbHeight: '28mm', minWords: 55 })}
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="fp-sec-col">
            ${renderSecondaryStory(articles[4], theme, pub.date, 'Page 3', { thumbHeight: '28mm', minWords: 55 })}
          </div>
        </div>

        <!-- Tier 3: World in Focus 4-Card Strip -->
        ${renderWorldInFocus(theme)}

        <!-- Tier 4: Bottom Briefs Strip -->
        ${renderBriefStrip(page.briefs, page.category, page.categoryLabel, theme)}
      `;
      break;
    }

    case 'business-tech': {
      const bLead = buildFullLeadStoryParagraphs(articles[0].content, articles[0].headline);
      html += `
        <!-- Tier 1: Business Hero Row (Financial Lead + Key Indicators + Side Story) -->
        <div class="inner-hero-row">
          <div class="ih-col-large">
            <article class="inner-lead">
              <h2 class="inner-hl-main" style="font-family:${theme.headlineFont}; color:${theme.inkColor};">${articles[0].headline}</h2>
              ${articles[0].subHeadline ? `<div class="lead-subdeck" style="font-family:${theme.bodyFont}; color:${theme.inkColor};">${articles[0].subHeadline}</div>` : ''}
              <div class="art-byline" style="font-family:${theme.uiFont}; border-bottom:0.5pt solid ${theme.columnRuleColor}; color:${theme.inkColor}; opacity:0.8;">
                BY FINANCIAL BUREAU &nbsp;|&nbsp; ${shortDate(pub.date)}
              </div>
              <div class="ih-media">
                <img src="${sanitizeImageUrl(articles[0].imageUrl, 'business') || getCategoryFallbackImage('business')}" class="inner-photo" style="border:0.5pt solid ${theme.inkColor};" />
              </div>
              <div class="inner-3col-body" style="column-rule:0.4pt solid ${theme.columnRuleColor}; font-family:${theme.bodyFont}; color:${theme.inkColor};">
                ${bLead.map((p, idx) => `<p class="${idx === 0 ? 'first-paragraph' : ''}">${p}</p>`).join('')}
                ${renderPullQuote(articles[0].pullQuote || 'Fiscal stability and structural reforms are providing high resilience to capital flows.', theme)}
              </div>
            </article>
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="ih-col-side">
            ${renderKeyIndicatorsWidget(null, theme)}
            <div style="margin-top: 4px;">
              ${renderSecondaryStory(articles[1], theme, pub.date, 'Page 4', { thumbHeight: '20mm', minWords: 40, headlineSize: '9.2pt' })}
            </div>
          </div>
        </div>

        <div class="section-divider" style="border-top:1pt solid ${theme.inkColor}; margin:3px 0 2px 0;"></div>

        <!-- Tier 2: 3 Secondary Stories Across 100% Width -->
        <div class="fp-secondary-grid">
          <div class="fp-sec-col">
            ${renderSecondaryStory(articles[2], theme, pub.date, 'Page 4', { thumbHeight: '28mm', minWords: 55 })}
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="fp-sec-col">
            ${renderSecondaryStory(articles[3], theme, pub.date, 'Page 4', { thumbHeight: '28mm', minWords: 55 })}
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="fp-sec-col">
            ${renderSecondaryStory(articles[4], theme, pub.date, 'Page 4', { thumbHeight: '28mm', minWords: 55 })}
          </div>
        </div>

        <!-- Tier 3: Industry & Sector Pulse 4-Card Strip -->
        ${renderCorporatePulse(theme)}

        <!-- Tier 4: Bottom Briefs Strip -->
        ${renderBriefStrip(page.briefs, page.category, page.categoryLabel, theme)}
      `;
      break;
    }

    case 'education-science': {
      const eLead = buildFullLeadStoryParagraphs(articles[0].content, articles[0].headline);
      html += `
        <!-- Tier 1: Sci-Tech Hero Row (Science Lead 68% + University Spotlight 32%) -->
        <div class="inner-hero-row">
          <div class="ih-col-large">
            <article class="inner-lead">
              <h2 class="inner-hl-main" style="font-family:${theme.headlineFont}; color:${theme.inkColor};">${articles[0].headline}</h2>
              ${articles[0].subHeadline ? `<div class="lead-subdeck" style="font-family:${theme.bodyFont}; color:${theme.inkColor};">${articles[0].subHeadline}</div>` : ''}
              <div class="art-byline" style="font-family:${theme.uiFont}; border-bottom:0.5pt solid ${theme.columnRuleColor}; color:${theme.inkColor}; opacity:0.8;">
                BY SCIENCE CORRESPONDENT &nbsp;|&nbsp; ${shortDate(pub.date)}
              </div>
              <div class="ih-media">
                <img src="${sanitizeImageUrl(articles[0].imageUrl, 'education') || getCategoryFallbackImage('education-science')}" class="inner-photo" style="border:0.5pt solid ${theme.inkColor};" />
              </div>
              <div class="inner-3col-body" style="column-rule:0.4pt solid ${theme.columnRuleColor}; font-family:${theme.bodyFont}; color:${theme.inkColor};">
                ${eLead.map((p, idx) => `<p class="${idx === 0 ? 'first-paragraph' : ''}">${p}</p>`).join('')}
                ${renderPullQuote(articles[0].pullQuote || 'Scientific self-reliance and basic research are the foundational pillars of our national mission.', theme)}
              </div>
            </article>
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="ih-col-side">
            ${renderSecondaryStory(articles[1], theme, pub.date, 'Page 5', { thumbHeight: '34mm', minWords: 65, headlineSize: '10.5pt' })}
          </div>
        </div>

        <div class="section-divider" style="border-top:1pt solid ${theme.inkColor}; margin:3px 0 2px 0;"></div>

        <!-- Tier 2: 3 Secondary Stories Across 100% Width -->
        <div class="fp-secondary-grid">
          <div class="fp-sec-col">
            ${renderSecondaryStory(articles[2], theme, pub.date, 'Page 5', { thumbHeight: '28mm', minWords: 55 })}
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="fp-sec-col">
            ${renderSecondaryStory(articles[3], theme, pub.date, 'Page 5', { thumbHeight: '28mm', minWords: 55 })}
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="fp-sec-col">
            ${renderSecondaryStory(articles[4], theme, pub.date, 'Page 5', { thumbHeight: '28mm', minWords: 55 })}
          </div>
        </div>

        <!-- Tier 3: Discovery & Innovation 4-Card Strip -->
        ${renderSciTechRoundup(theme)}

        <!-- Tier 4: Bottom Briefs Strip -->
        ${renderBriefStrip(page.briefs, page.category, page.categoryLabel, theme)}
      `;
      break;
    }

    case 'sports': {
      const sLead = buildFullLeadStoryParagraphs(articles[0].content, articles[0].headline);
      html += `
        <!-- Tier 1: Sports Hero Row (Match Lead + Player Stats Card + Side Story) -->
        <div class="inner-hero-row">
          <div class="ih-col-large">
            <article class="inner-lead">
              <h2 class="inner-hl-main" style="font-family:${theme.headlineFont}; color:${theme.inkColor};">${articles[0].headline}</h2>
              ${articles[0].subHeadline ? `<div class="lead-subdeck" style="font-family:${theme.bodyFont}; color:${theme.inkColor};">${articles[0].subHeadline}</div>` : ''}
              <div class="art-byline" style="font-family:${theme.uiFont}; border-bottom:0.5pt solid ${theme.columnRuleColor}; color:${theme.inkColor}; opacity:0.8;">
                BY SPORTS BUREAU &nbsp;|&nbsp; ${shortDate(pub.date)}
              </div>
              <div class="ih-media">
                <img src="${sanitizeImageUrl(articles[0].imageUrl, 'sports') || getCategoryFallbackImage('sports')}" class="inner-photo" style="border:0.5pt solid ${theme.inkColor};" />
              </div>
              <div class="inner-3col-body" style="column-rule:0.4pt solid ${theme.columnRuleColor}; font-family:${theme.bodyFont}; color:${theme.inkColor};">
                ${sLead.map((p, idx) => `<p class="${idx === 0 ? 'first-paragraph' : ''}">${p}</p>`).join('')}
                ${renderPullQuote(articles[0].pullQuote || 'A masterclass in resilience and tactical perfection under championship pressure.', theme)}
              </div>
            </article>
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="ih-col-side">
            ${renderSportsStatCard(theme)}
            <div style="margin-top: 4px;">
              ${renderSecondaryStory(articles[1], theme, pub.date, 'Page 6', { thumbHeight: '20mm', minWords: 40, headlineSize: '9.2pt' })}
            </div>
          </div>
        </div>

        <div class="section-divider" style="border-top:1pt solid ${theme.inkColor}; margin:3px 0 2px 0;"></div>

        <!-- Tier 2: 3 Secondary Stories Across 100% Width -->
        <div class="fp-secondary-grid">
          <div class="fp-sec-col">
            ${renderSecondaryStory(articles[2], theme, pub.date, 'Page 6', { thumbHeight: '28mm', minWords: 55 })}
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="fp-sec-col">
            ${renderSecondaryStory(articles[3], theme, pub.date, 'Page 6', { thumbHeight: '28mm', minWords: 55 })}
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="fp-sec-col">
            ${renderSecondaryStory(articles[4], theme, pub.date, 'Page 6', { thumbHeight: '28mm', minWords: 55 })}
          </div>
        </div>

        <!-- Tier 3: Scoreboard 4-Card Strip -->
        ${renderSportsScoreboard(theme)}

        <!-- Tier 4: Bottom Briefs Strip -->
        ${renderBriefStrip(page.briefs, page.category, page.categoryLabel, theme)}
      `;
      break;
    }

    case 'entertainment-lifestyle': {
      const entLead = buildFullLeadStoryParagraphs(articles[0].content, articles[0].headline);
      html += `
        <!-- Tier 1: Entertainment Hero Row (Cinema/Arts Lead 68% + Spotlight 32%) -->
        <div class="inner-hero-row">
          <div class="ih-col-large">
            <article class="inner-lead">
              <h2 class="inner-hl-main" style="font-family:${theme.headlineFont}; color:${theme.inkColor};">${articles[0].headline}</h2>
              ${articles[0].subHeadline ? `<div class="lead-subdeck" style="font-family:${theme.bodyFont}; color:${theme.inkColor};">${articles[0].subHeadline}</div>` : ''}
              <div class="art-byline" style="font-family:${theme.uiFont}; border-bottom:0.5pt solid ${theme.columnRuleColor}; color:${theme.inkColor}; opacity:0.8;">
                BY CULTURE & ARTS BUREAU &nbsp;|&nbsp; ${shortDate(pub.date)}
              </div>
              <div class="ih-media">
                <img src="${sanitizeImageUrl(articles[0].imageUrl, 'entertainment') || getCategoryFallbackImage('entertainment-lifestyle')}" class="inner-photo" style="border:0.5pt solid ${theme.inkColor};" />
              </div>
              <div class="inner-3col-body" style="column-rule:0.4pt solid ${theme.columnRuleColor}; font-family:${theme.bodyFont}; color:${theme.inkColor};">
                ${entLead.map((p, idx) => `<p class="${idx === 0 ? 'first-paragraph' : ''}">${p}</p>`).join('')}
                ${renderPullQuote(articles[0].pullQuote || 'Authentic regional stories carry a deeply universal human emotional resonance.', theme)}
              </div>
            </article>
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="ih-col-side">
            ${renderSecondaryStory(articles[1], theme, pub.date, 'Page 7', { thumbHeight: '34mm', minWords: 65, headlineSize: '10.5pt' })}
          </div>
        </div>

        <div class="section-divider" style="border-top:1pt solid ${theme.inkColor}; margin:3px 0 2px 0;"></div>

        <!-- Tier 2: 3 Secondary Stories Across 100% Width -->
        <div class="fp-secondary-grid">
          <div class="fp-sec-col">
            ${renderSecondaryStory(articles[2], theme, pub.date, 'Page 7', { thumbHeight: '28mm', minWords: 55 })}
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="fp-sec-col">
            ${renderSecondaryStory(articles[3], theme, pub.date, 'Page 7', { thumbHeight: '28mm', minWords: 55 })}
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="fp-sec-col">
            ${renderSecondaryStory(articles[4], theme, pub.date, 'Page 7', { thumbHeight: '28mm', minWords: 55 })}
          </div>
        </div>

        <!-- Tier 3: Cultural Mosaic 4-Card Strip -->
        ${renderCultureRoundup(theme)}

        <!-- Tier 4: Bottom Briefs Strip -->
        ${renderBriefStrip(page.briefs, page.category, page.categoryLabel, theme)}
      `;
      break;
    }

    case 'opinion-features': {
      const edLead = buildFullLeadStoryParagraphs(articles[0].content, articles[0].headline);
      const colLead = buildFullLeadStoryParagraphs(articles[1].content, articles[1].headline);
      html += `
        <!-- Tier 1: Editorial (Left 50%) + Guest Column (Right 50%) -->
        <div class="inner-hero-row" style="margin-bottom: 2px;">
          <div class="ih-col-half">
            <div class="op-badge" style="background:${theme.accentColor === '#0a0a0a' ? '#991b1b' : theme.accentColor}; color:#fff; font-family:${theme.uiFont};">EDITORIAL</div>
            <h3 class="inner-hl-main" style="font-family:${theme.headlineFont}; color:${theme.inkColor}; font-size:13pt; line-height:1.12; margin-bottom:2px;">A Stronger, More Resilient India Is Well Within Our Reach</h3>
            <div class="art-byline" style="font-family:${theme.uiFont}; border-bottom:0.5pt solid ${theme.columnRuleColor}; color:${theme.inkColor}; opacity:0.8;">
              THE CHRONICLE EDITORIAL BOARD &nbsp;|&nbsp; ${shortDate(pub.date)}
            </div>
            <div class="op-body" style="column-count:2; column-gap:8px; column-rule:0.4pt solid ${theme.columnRuleColor}; font-family:${theme.bodyFont}; color:${theme.inkColor}; font-size:7.2pt; line-height:1.26; text-align:justify;">
              ${edLead.map((p, idx) => `<p class="${idx === 0 ? 'first-paragraph' : ''}" style="margin-bottom:3px; text-indent:${idx === 0 ? '0' : '8px'};">${p}</p>`).join('')}
            </div>
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="ih-col-half">
            <div class="op-badge" style="background:${theme.accentColor === '#0a0a0a' ? '#1f2937' : theme.accentColor}; color:#fff; font-family:${theme.uiFont};">GUEST COLUMN</div>
            <h3 class="inner-hl-main" style="font-family:${theme.headlineFont}; color:${theme.inkColor}; font-size:13pt; line-height:1.12; margin-bottom:2px;">The Role of Youth & Tech in Shaping India's Future</h3>
            <div class="art-byline" style="font-family:${theme.uiFont}; border-bottom:0.5pt solid ${theme.columnRuleColor}; color:${theme.inkColor}; opacity:0.8;">
              BY RAJESH MISHRA &nbsp;|&nbsp; SENIOR FELLOW, POLICY FORUM
            </div>
            <div class="op-body" style="column-count:2; column-gap:8px; column-rule:0.4pt solid ${theme.columnRuleColor}; font-family:${theme.bodyFont}; color:${theme.inkColor}; font-size:7.2pt; line-height:1.26; text-align:justify;">
              ${colLead.map((p, idx) => `<p class="${idx === 0 ? 'first-paragraph' : ''}" style="margin-bottom:3px; text-indent:${idx === 0 ? '0' : '8px'};">${p}</p>`).join('')}
            </div>
          </div>
        </div>

        <div class="section-divider" style="border-top:1pt solid ${theme.inkColor}; margin:2px 0 3px 0;"></div>

        <!-- Tier 2: 3 Feature Widgets Row (Horoscope + Sudoku + Weather) -->
        <div class="fp-secondary-grid" style="margin:2px 0 3px 0;">
          <div class="fp-sec-col">${renderHoroscopeWidget(theme)}</div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="fp-sec-col">${renderSudokuWidget(null, theme)}</div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="fp-sec-col">${renderWeatherWidget(null, theme)}</div>
        </div>

        <!-- Tier 3: Authentic Comics Strip -->
        ${renderComicsStrip(theme)}

        <!-- Tier 4: Bottom Briefs Strip -->
        ${renderBriefStrip(page.briefs, page.category, page.categoryLabel, theme)}
      `;
      break;
    }

    default: {
      const defLead = buildFullLeadStoryParagraphs(articles[0].content, articles[0].headline);
      html += `
        <!-- Tier 1: Hero Row -->
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
                ${defLead.map((p, idx) => `<p class="${idx === 0 ? 'first-paragraph' : ''}">${p}</p>`).join('')}
                ${renderPullQuote(articles[0].pullQuote || 'A strategic initiative setting lasting benchmarks for the future.', theme)}
              </div>
            </article>
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="ih-col-side">
            ${renderSecondaryStory(articles[1], theme, pub.date, `Page ${pageNum}`, { thumbHeight: '34mm', minWords: 65, headlineSize: '10.5pt' })}
          </div>
        </div>

        <div class="section-divider" style="border-top:1pt solid ${theme.inkColor}; margin:3px 0 2px 0;"></div>

        <!-- Tier 2: 3 Secondary Stories Across 100% Width -->
        <div class="fp-secondary-grid">
          <div class="fp-sec-col">
            ${renderSecondaryStory(articles[2], theme, pub.date, `Page ${pageNum}`, { thumbHeight: '28mm', minWords: 55 })}
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="fp-sec-col">
            ${renderSecondaryStory(articles[3], theme, pub.date, `Page ${pageNum}`, { thumbHeight: '28mm', minWords: 55 })}
          </div>
          <div class="col-divider" style="border-right:0.5pt solid ${theme.columnRuleColor};"></div>
          <div class="fp-sec-col">
            ${renderSecondaryStory(articles[4], theme, pub.date, `Page ${pageNum}`, { thumbHeight: '28mm', minWords: 55 })}
          </div>
        </div>

        <!-- Tier 3: Feature Strip -->
        ${renderStateRoundup(theme)}

        <!-- Tier 4: Bottom Briefs Strip -->
        ${renderBriefStrip(page.briefs, page.category, page.categoryLabel, theme)}
      `;
      break;
    }
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
      font-size: 7.8pt;
      line-height: 1.28;
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
      padding: 6mm 8.5mm 5mm 8.5mm;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 0;
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
      margin-bottom: 3px;
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
      margin-bottom: 4px;
      text-align: center;
      flex-shrink: 0;
    }
    .masthead-main {
      padding: 1px 0 2px 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .masthead-main.has-logo {
      gap: 16px;
    }
    .masthead-logo-container {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .masthead-logo {
      max-height: 46px;
      max-width: 105px;
      object-fit: contain;
      display: block;
    }
    .masthead-text-block {
      display: flex;
      flex-direction: column;
      align-items: center;
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
      margin-top: 1.5px;
      opacity: 0.85;
      font-style: italic;
    }
    .masthead-dateline {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2.5px 4px;
      margin-top: 2.5px;
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
      margin-bottom: 2px;
      align-items: stretch;
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

    /* ── In-Brief Sidebar (Dense, No Stretching) ─────────────────── */
    .in-brief-box {
      height: 100%;
      padding-right: 6px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .ib-header {
      font-size: 7pt;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-align: center;
      padding: 2.5px 0;
      margin-bottom: 3px;
      line-height: 1;
    }
    .ib-list {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 0;
    }
    .ib-item {
      padding: 3.5px 0 4.5px 0;
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
      font-size: 6.8pt;
      font-weight: 700;
      line-height: 1.15;
      margin-bottom: 1.5px;
    }
    .ib-pg {
      font-size: 5pt;
      font-weight: 600;
      letter-spacing: 0.3px;
    }
    .ib-pulse-card {
      margin-top: auto;
      padding: 3px 4px;
    }
    .ib-pulse-title {
      font-size: 5pt;
      font-weight: 800;
      letter-spacing: 0.8px;
      padding-bottom: 1.5px;
      margin-bottom: 2px;
      line-height: 1;
    }
    .ib-pulse-row {
      font-size: 5.2pt;
      display: flex;
      justify-content: space-between;
      margin-bottom: 1px;
      line-height: 1.1;
    }

    /* ── Lead Story Elements ────────────────────────────────────── */
    .lead-story-container {
      display: flex;
      flex-direction: column;
    }
    .lead-media-row {
      display: flex;
      gap: 8px;
      margin-bottom: 3px;
      align-items: stretch;
    }
    .lead-img-col {
      flex: 1;
      min-width: 0;
    }
    .lead-hero-photo {
      width: 100%;
      height: 58mm;
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
      height: 58mm;
      padding: 5px 6px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .kh-header {
      font-size: 6.5pt;
      font-weight: 800;
      letter-spacing: 1px;
      margin-bottom: 3px;
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
      line-height: 1.18;
      padding: 1.5px 0;
    }
    .kh-bullet {
      font-size: 5.5pt;
      margin-right: 2px;
    }

    .lead-headline {
      font-size: 19.5pt;
      font-weight: 900;
      line-height: 1.06;
      letter-spacing: -0.3px;
      margin: 2px 0 1px 0;
    }
    .lead-subdeck {
      font-size: 9.5pt;
      font-style: italic;
      line-height: 1.2;
      margin-bottom: 2px;
      opacity: 0.85;
    }
    .art-byline {
      font-size: 5.2pt;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      padding-bottom: 1.5px;
      margin-bottom: 3px;
    }
    .lead-body-columns {
      column-count: 3;
      column-gap: 8px;
      text-align: justify;
      hyphens: auto;
      -webkit-hyphens: auto;
      font-size: 7.4pt;
      line-height: 1.28;
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
      margin-top: 2px;
      color: ${theme.dropCapColor};
    }

    /* ── Secondary Stories Grid (Full 100% Width) ───────────────── */
    .fp-secondary-grid {
      display: flex;
      gap: 0;
      align-items: stretch;
      margin: 2px 0 2px 0;
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
      font-size: 9.6pt;
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.2px;
      margin-bottom: 1.5px;
    }
    .sec-img-wrap {
      margin: 1.5px 0;
    }
    .sec-thumb {
      width: 100%;
      height: 28mm;
      object-fit: cover;
      display: block;
    }
    .sec-byline {
      font-size: 5pt;
      font-weight: 700;
      letter-spacing: 0.4px;
      margin-bottom: 1.5px;
    }
    .sec-body {
      font-size: 7.0pt;
      line-height: 1.24;
      text-align: justify;
      hyphens: auto;
      margin: 1.5px 0;
      overflow: hidden;
    }
    .sec-jump {
      font-size: 5.2pt;
      font-weight: 700;
      text-align: right;
      margin-top: auto;
      letter-spacing: 0.3px;
    }

    /* ── Briefs Strip (Anchored at Bottom) ──────────────────────── */
    .briefs-strip {
      margin-top: auto;
      flex-shrink: 0;
      padding-top: 2px;
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
      margin-bottom: 2px;
      align-items: stretch;
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
      display: flex;
      flex-direction: column;
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
    }
    .inner-hl-main {
      font-size: 14.5pt;
      font-weight: 900;
      line-height: 1.08;
      letter-spacing: -0.3px;
      margin-bottom: 1.5px;
    }
    .inner-photo {
      width: 100%;
      height: 40mm;
      object-fit: cover;
      display: block;
      margin: 1.5px 0 2px 0;
    }
    .inner-3col-body {
      column-count: 3;
      column-gap: 8px;
      text-align: justify;
      font-size: 7.2pt;
      line-height: 1.25;
      overflow: hidden;
    }
    .inner-3col-body p {
      margin-bottom: 2.5px;
      text-indent: 10px;
    }
    .inner-3col-body p.first-paragraph {
      text-indent: 0;
    }

    /* ── Pull Quote ─────────────────────────────────────────────── */
    .pull-quote {
      margin: 2px 0;
      padding: 2.5px 0;
      text-align: center;
      break-inside: avoid;
    }
    .pq-text {
      font-size: 8pt;
      font-style: italic;
      font-weight: 600;
      line-height: 1.2;
      margin: 0;
      text-indent: 0 !important;
    }
    .pq-attr {
      font-size: 5.2pt;
      font-weight: 700;
      letter-spacing: 0.5px;
      margin-top: 1.5px;
    }

    /* ── Feature Strip (State Roundup / World / Corporate / SciTech / Arena / Mosaic) ── */
    .state-roundup-container {
      margin: 2px 0;
      flex-shrink: 0;
    }
    .sru-header {
      font-size: 6.2pt;
      font-weight: 800;
      letter-spacing: 1.1px;
      padding: 2.2px 6px;
      line-height: 1;
    }
    .sru-grid {
      display: flex;
      gap: 0;
      padding: 2.5px 0 1px 0;
      align-items: stretch;
    }
    .sru-card {
      flex: 1;
      padding: 0 6px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
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
      font-size: 7.2pt;
      font-weight: 700;
      line-height: 1.14;
      margin-bottom: 1.5px;
    }
    .sru-summary {
      font-size: 6.2pt;
      line-height: 1.18;
      margin-bottom: 2px;
      opacity: 0.88;
      text-align: justify;
      overflow: hidden;
    }
    .sru-tag {
      display: block;
      font-size: 4.8pt;
      font-style: italic;
      margin-top: auto;
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
      margin: 3px 0 2px 0;
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
