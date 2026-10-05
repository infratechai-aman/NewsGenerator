'use client';

import { NEWSPAPER_THEMES } from '@/lib/themes';
import { NewspaperTheme } from '@/types';

interface ThemeSelectorProps {
  selectedThemeId: string;
  onSelect: (themeId: string) => void;
}

export default function ThemeSelector({ selectedThemeId, onSelect }: ThemeSelectorProps) {
  return (
    <div className="theme-selector">
      <div className="theme-selector-header">
        <h2 className="theme-selector-title">Choose Your Newspaper Theme</h2>
        <p className="theme-selector-subtitle">
          Your theme controls fonts, colors, masthead style, and the overall aesthetic of your print edition.
        </p>
      </div>

      <div className="theme-grid">
        {NEWSPAPER_THEMES.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isSelected={selectedThemeId === theme.id}
            onSelect={() => onSelect(theme.id)}
          />
        ))}
      </div>

      <style>{`
        .theme-selector {
          padding: 24px 0;
        }
        .theme-selector-header {
          margin-bottom: 28px;
          text-align: center;
        }
        .theme-selector-title {
          font-size: 22px;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 8px;
        }
        .theme-selector-subtitle {
          font-size: 14px;
          color: #94a3b8;
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.5;
        }
        .theme-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 900px) {
          .theme-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .theme-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

function ThemeCard({ theme, isSelected, onSelect }: { theme: NewspaperTheme; isSelected: boolean; onSelect: () => void }) {
  const borderColor = isSelected ? '#60a5fa' : 'rgba(255,255,255,0.08)';
  const shadowStyle = isSelected ? '0 0 0 2px #3b82f6, 0 8px 32px rgba(59,130,246,0.25)' : '0 4px 16px rgba(0,0,0,0.25)';

  return (
    <button
      onClick={onSelect}
      style={{
        all: 'unset',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        border: `2px solid ${borderColor}`,
        overflow: 'hidden',
        boxShadow: shadowStyle,
        transition: 'all 0.2s ease',
        background: 'rgba(15,23,42,0.7)',
        position: 'relative',
      }}
    >
      {/* Masthead Preview */}
      <div
        style={{
          background: theme.mastheadBg,
          padding: '16px 14px 12px',
          borderBottom: `3px solid ${theme.accentColor === '#000000' ? '#000' : theme.accentColor}`,
          position: 'relative',
          minHeight: '90px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Ticker bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          background: theme.accentColor,
          height: '6px',
        }} />

        {/* Vol/Date bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          fontSize: '7px',
          color: theme.mastheadText,
          opacity: 0.6,
          fontFamily: 'system-ui',
          marginBottom: '6px',
          marginTop: '6px',
        }}>
          <span>VOL. 18 | NO. 204</span>
          <span>₹10</span>
        </div>

        {/* Newspaper name */}
        <div
          style={{
            fontFamily: theme.mastheadStyle === 'blackletter'
              ? 'Georgia, serif'
              : theme.mastheadStyle === 'modern'
              ? 'Arial, sans-serif'
              : 'Georgia, serif',
            fontSize: theme.mastheadStyle === 'blackletter' ? '20px' : '18px',
            fontWeight: theme.mastheadStyle === 'modern' ? 400 : 700,
            color: theme.mastheadText,
            lineHeight: 1,
            textAlign: 'center',
            letterSpacing: theme.mastheadStyle === 'blackletter' ? '-0.5px' : '0',
            fontStyle: theme.mastheadStyle === 'bold' ? 'italic' : 'normal',
          }}
        >
          The Chronicle
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: '7px',
          color: theme.mastheadText,
          opacity: 0.5,
          fontStyle: 'italic',
          marginTop: '4px',
          letterSpacing: '1.5px',
        }}>
          Truth · People · Perspective
        </div>

        {/* Bottom border effect */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: theme.mastheadBorderStyle === 'triple-line' ? '4px' : '2px',
          background: theme.mastheadBorderStyle === 'triple-line'
            ? `repeating-linear-gradient(to bottom, ${theme.mastheadText} 0px, ${theme.mastheadText} 1px, transparent 1px, transparent 2px, ${theme.mastheadText} 2px, ${theme.mastheadText} 3px)`
            : theme.mastheadText,
          opacity: 0.6,
        }} />
      </div>

      {/* Category Strip Preview */}
      <div style={{
        background: theme.categoryHeaderBg,
        color: theme.categoryHeaderText,
        padding: '3px 10px',
        fontSize: '7px',
        fontFamily: 'system-ui',
        fontWeight: 700,
        letterSpacing: '0.5px',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>PAGE 1 — FRONT PAGE</span>
        <span style={{ opacity: 0.7, fontStyle: 'italic', fontWeight: 400 }}>Top stories</span>
      </div>

      {/* Content Preview */}
      <div style={{ padding: '10px 12px 12px', flex: 1, background: theme.paperBg }}>
        {/* Headline preview */}
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: '11px',
          fontWeight: 900,
          color: theme.inkColor,
          lineHeight: 1.1,
          marginBottom: '5px',
        }}>
          India Launches Ambitious Mission to Strengthen Global Space Presence
        </div>

        {/* Sub head */}
        <div style={{ fontSize: '7px', color: theme.inkColor, opacity: 0.6, marginBottom: '5px', lineHeight: 1.3 }}>
          New satellite series to enhance communication, climate monitoring and strategic capabilities
        </div>

        {/* Body text preview */}
        <div style={{
          fontSize: '6.5px',
          color: theme.inkColor,
          lineHeight: 1.4,
          opacity: 0.8,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }}>
          India's space program takes a major leap forward as the government announces a new series of satellite launches aimed at bolstering national capabilities in communication, weather monitoring, and strategic intelligence gathering.
        </div>

        {/* Column rules preview */}
        <div style={{
          display: 'flex',
          gap: '0',
          marginTop: '8px',
          borderTop: `0.5pt solid ${theme.columnRuleColor}`,
          paddingTop: '5px',
        }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              flex: 1,
              borderRight: i < 3 ? `0.5pt solid ${theme.columnRuleColor}` : 'none',
              padding: '0 4px 0 0',
              marginRight: i < 3 ? '4px' : 0,
            }}>
              <div style={{ height: '4px', background: theme.accentColor, marginBottom: '3px', opacity: 0.8 }} />
              <div style={{ height: '2px', background: theme.inkColor, marginBottom: '2px', opacity: 0.15, borderRadius: '1px' }} />
              <div style={{ height: '2px', background: theme.inkColor, marginBottom: '2px', opacity: 0.15, borderRadius: '1px' }} />
              <div style={{ height: '2px', width: '70%', background: theme.inkColor, opacity: 0.1, borderRadius: '1px' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Theme Info Footer */}
      <div style={{
        padding: '10px 12px',
        background: 'rgba(0,0,0,0.4)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '8px',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', marginBottom: '3px' }}>
              {theme.name}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.4 }}>
              {theme.description}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '5px', flexShrink: 0, alignItems: 'center', marginTop: '2px' }}>
            {[theme.preview.bg, theme.preview.text, theme.preview.accent].map((c, i) => (
              <div key={i} style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: c,
                border: '1.5px solid rgba(255,255,255,0.2)',
                flexShrink: 0,
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Selected checkmark */}
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: '#3b82f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(59,130,246,0.5)',
          zIndex: 10,
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </button>
  );
}
