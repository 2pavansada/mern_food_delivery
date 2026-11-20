import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';
import './FoodDisplay.css';

const FoodDisplay = ({ category, setCategory }) => {
  const { food_list, searchQuery, setSearchQuery } = useContext(StoreContext);

  const filteredFoods = (food_list || []).filter((item) => {
    const matchesCategory = category === "All" || item.category === category;
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const resetFilters = () => {
    if (setCategory) setCategory('All');
    if (setSearchQuery) setSearchQuery('');
  };

  return (
    <section className="food-display-section" id="food-display">
      <div className="food-display-header">
        <div>
          <span className="section-tag">Handcrafted & Fresh</span>
          <h2 className="food-display-title">
            {category === 'All' ? 'Popular Dishes Near You' : `${category} Specialties`}
          </h2>
          <p className="food-display-subtitle">
            Showing {filteredFoods.length} {filteredFoods.length === 1 ? 'dish' : 'dishes'} prepared with the finest ingredients.
          </p>
        </div>

        {/* Active Filters Pill */}
        {(category !== 'All' || searchQuery) && (
          <div className="active-filters-bar">
            {category !== 'All' && (
              <span className="filter-chip">
                Category: <strong>{category}</strong>
                <button type="button" onClick={() => setCategory && setCategory('All')} aria-label="Clear category">✕</button>
              </span>
            )}
            {searchQuery && (
              <span className="filter-chip">
                Search: <strong>"{searchQuery}"</strong>
                <button type="button" onClick={() => setSearchQuery && setSearchQuery('')} aria-label="Clear search">✕</button>
              </span>
            )}
            <button className="clear-all-filters-btn" onClick={resetFilters}>
              Reset All
            </button>
          </div>
        )}
      </div>

      {filteredFoods.length === 0 ? (
        <div className="food-empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3 className="empty-state-title">No matching cravings found</h3>
          <p className="empty-state-text">
            We couldn't find any items matching your current filters. Try searching for another dish or reset your search.
          </p>
          <button className="btn-primary" onClick={resetFilters}>
            View All Dishes
          </button>
        </div>
      ) : (
        <div className="food-display-grid">
          {filteredFoods.map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
              category={item.category}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FoodDisplay;
