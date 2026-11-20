import React from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <section className="explore-menu-section" id="explore-menu">
      <div className="section-header">
        <div className="section-header-left">
          <span className="section-tag">Taste The Variety</span>
          <h2 className="section-title">Explore by Category</h2>
          <p className="section-description">
            Choose from freshly prepared salads, artisan rolls, savory pastas, wholesome bowls, and gourmet desserts.
          </p>
        </div>
        <button 
          className={`all-categories-pill ${category === 'All' ? 'active' : ''}`}
          onClick={() => setCategory('All')}
        >
          View All ({menu_list.length} Categories)
        </button>
      </div>

      <div className="explore-menu-scroll-container">
        <div className="explore-menu-list">
          {/* Quick "All" Category Pill */}
          <div 
            onClick={() => setCategory('All')}
            className={`explore-menu-item ${category === 'All' ? 'active' : ''}`}
          >
            <div className="menu-image-wrapper all-pill">
              <span className="all-icon">🍽️</span>
            </div>
            <p className="menu-item-name">All</p>
          </div>

          {menu_list.map((item, index) => {
            const isSelected = category === item.menu_name;
            return (
              <div 
                onClick={() => setCategory(prev => prev === item.menu_name ? 'All' : item.menu_name)} 
                key={index} 
                className={`explore-menu-item ${isSelected ? 'active' : ''}`}
              >
                <div className={`menu-image-wrapper ${isSelected ? 'active' : ''}`}>
                  <img 
                    src={item.menu_image} 
                    alt={item.menu_name}
                    loading="lazy"
                  />
                </div>
                <p className="menu-item-name">{item.menu_name}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="section-divider"></div>
    </section>
  );
};

export default ExploreMenu;
