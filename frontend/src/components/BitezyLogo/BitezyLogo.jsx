import React from 'react';

const BitezyLogo = ({ size = 'md', theme = 'dark', showTagline = false, className = '' }) => {
  const heights = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56
  };

  const h = heights[size] || 40;
  const isLight = theme === 'light';

  return (
    <div 
      className={`bitezy-logo-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        userSelect: 'none',
        textDecoration: 'none'
      }}
    >
      <div 
        style={{
          width: `${h}px`,
          height: `${h}px`,
          background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
          borderRadius: `${Math.round(h * 0.3)}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)',
          flexShrink: 0,
          position: 'relative'
        }}
      >
        <svg 
          viewBox="0 0 32 32" 
          width={`${Math.round(h * 0.65)}px`} 
          height={`${Math.round(h * 0.65)}px`} 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bowl */}
          <path d="M6 14C6 21 10.5 24.5 16 24.5C21.5 24.5 26 21 26 14H6Z" fill="#FFF7ED"/>
          {/* Smile */}
          <path d="M11 16.5C13 19 19 19 21 16.5" stroke="#F97316" strokeWidth="2" strokeLinecap="round"/>
          {/* Steam */}
          <path d="M11 10C11 7.5 12.5 6.5 12.5 5" stroke="#FFF7ED" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M16 10C16 7 17.5 6 17.5 4" stroke="#FFF7ED" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M21 10C21 7.5 22.5 6.5 22.5 5" stroke="#FFF7ED" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: 1 }}>
          <span 
            style={{
              fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
              fontSize: `${Math.round(h * 0.58)}px`,
              fontWeight: 800,
              letterSpacing: '-0.5px',
              color: isLight ? '#FFFFFF' : '#171717'
            }}
          >
            BITE
          </span>
          <span 
            style={{
              fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
              fontSize: `${Math.round(h * 0.58)}px`,
              fontWeight: 800,
              letterSpacing: '-0.5px',
              color: '#F97316'
            }}
          >
            ZY
          </span>
          <span 
            style={{
              width: `${Math.max(4, Math.round(h * 0.12))}px`,
              height: `${Math.max(4, Math.round(h * 0.12))}px`,
              borderRadius: '50%',
              backgroundColor: '#F97316',
              display: 'inline-block',
              marginLeft: '2px',
              marginBottom: '2px'
            }}
          />
        </div>
        {showTagline && (
          <span 
            style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.4px',
              color: isLight ? '#E5E7EB' : '#737373',
              marginTop: '2px'
            }}
          >
            Good food. Great mood.
          </span>
        )}
      </div>
    </div>
  );
};

export default BitezyLogo;
