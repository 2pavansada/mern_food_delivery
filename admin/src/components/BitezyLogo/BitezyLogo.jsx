import React from 'react';

const BitezyLogo = ({ size = 'md', theme = 'dark', showAdminBadge = true, className = '' }) => {
  const heights = {
    sm: 32,
    md: 40,
    lg: 48
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
          flexShrink: 0
        }}
      >
        <svg 
          viewBox="0 0 32 32" 
          width={`${Math.round(h * 0.65)}px`} 
          height={`${Math.round(h * 0.65)}px`} 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 14C6 21 10.5 24.5 16 24.5C21.5 24.5 26 21 26 14H6Z" fill="#FFF7ED"/>
          <path d="M11 16.5C13 19 19 19 21 16.5" stroke="#F97316" strokeWidth="2" strokeLinecap="round"/>
          <path d="M11 10C11 7.5 12.5 6.5 12.5 5" stroke="#FFF7ED" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M16 10C16 7 17.5 6 17.5 4" stroke="#FFF7ED" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M21 10C21 7.5 22.5 6.5 22.5 5" stroke="#FFF7ED" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
        </div>

        {showAdminBadge && (
          <span 
            style={{
              backgroundColor: '#FFF7ED',
              color: '#F97316',
              border: '1.5px solid #F97316',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: 800,
              padding: '2px 7px',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              lineHeight: 1.2
            }}
          >
            Admin
          </span>
        )}
      </div>
    </div>
  );
};

export default BitezyLogo;
