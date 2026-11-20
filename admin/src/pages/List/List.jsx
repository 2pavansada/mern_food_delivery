import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [availabilityMap, setAvailabilityMap] = useState({});

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data || []);
      } else {
        toast.error("Error fetching food list");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        toast.success(response.data.message || "Food removed successfully");
        setDeleteConfirmId(null);
        await fetchList();
      } else {
        toast.error(response.data.message || 'Error occurred while removing food.');
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || error.message || 'Error occurred.';
      toast.error(errorMessage);
    }
  };

  const toggleAvailability = (id) => {
    setAvailabilityMap(prev => ({
      ...prev,
      [id]: prev[id] === false ? true : false
    }));
    toast.info("Dish availability updated!");
  };

  useEffect(() => {
    fetchList();
  }, []);

  const categories = ["All", "Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg", "Pasta", "Noodles"];

  const filteredList = list.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="food-list-page">
      <div className="page-header-row">
        <div>
          <span className="admin-tag">CATALOG INVENTORY</span>
          <h1 className="admin-page-title">Food Inventory Management</h1>
          <p className="admin-page-subtitle">Inspect menu items, manage pricing, check availability, or remove dishes.</p>
        </div>

        <Link to="/add" className="btn-primary-admin">
          + Add New Dish
        </Link>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="inventory-toolbar">
        <div className="search-input-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search dish by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-select-box">
          <label>Filter Category:</label>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="inventory-count-pill">
          Showing {filteredList.length} of {list.length} dishes
        </div>
      </div>

      {/* Main Table */}
      <div className="inventory-card">
        {filteredList.length === 0 ? (
          <div className="empty-inventory-state">
            <div className="empty-icon">🍽️</div>
            <h3>No dishes found</h3>
            <p>Try adjusting your search query or category filter.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-modern-table">
              <thead>
                <tr>
                  <th>Dish Photo</th>
                  <th>Dish Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Availability</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((item) => {
                  const isAvailable = availabilityMap[item._id] !== false;
                  const imgSrc = (item.image && (item.image.startsWith('http://') || item.image.startsWith('https://') || item.image.startsWith('data:')))
                    ? item.image
                    : `${url}/images/${item.image}`;

                  return (
                    <tr key={item._id}>
                      <td>
                        <img
                          src={imgSrc}
                          alt={item.name}
                          className="table-dish-thumbnail cursor"
                          onClick={() => setPreviewImage({ url: imgSrc, name: item.name })}
                          title="Click to preview image"
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=60"; }}
                        />
                      </td>
                      <td>
                        <div className="dish-name-cell">
                          <strong>{item.name}</strong>
                          <p className="dish-desc-snippet">{item.description}</p>
                        </div>
                      </td>
                      <td>
                        <span className="category-tag-pill">{item.category}</span>
                      </td>
                      <td>
                        <strong className="dish-table-price">${Number(item.price).toFixed(2)}</strong>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`availability-toggle-btn ${isAvailable ? 'available' : 'out-of-stock'}`}
                          onClick={() => toggleAvailability(item._id)}
                          title="Click to toggle availability"
                        >
                          <span className="toggle-dot"></span>
                          <span>{isAvailable ? 'In Stock' : 'Out of Stock'}</span>
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="delete-dish-btn"
                          onClick={() => setDeleteConfirmId(item._id)}
                          title="Delete dish from menu"
                          aria-label="Delete dish"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirmId(null); }}>
          <div className="delete-modal-card">
            <h3>Remove Dish from Menu?</h3>
            <p>This action will permanently delete this food item from the BITEZY catalog.</p>
            <div className="delete-modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button className="btn-confirm-delete" onClick={() => removeFood(deleteConfirmId)}>
                Yes, Delete Dish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="modal-backdrop" onClick={() => setPreviewImage(null)}>
          <div className="image-preview-modal-card">
            <button className="modal-close-btn" onClick={() => setPreviewImage(null)}>✕</button>
            <img src={previewImage.url} alt={previewImage.name} className="large-preview-img" />
            <h4>{previewImage.name}</h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
