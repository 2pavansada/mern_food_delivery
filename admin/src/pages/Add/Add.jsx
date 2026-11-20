import React, { useState } from 'react';
import './Add.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = ({ url }) => {
  const [image, setImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Salad'
  });

  const categories = [
    "Salad",
    "Rolls",
    "Deserts",
    "Sandwich",
    "Cake",
    "Pure Veg",
    "Pasta",
    "Noodles"
  ];

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!image) {
      toast.warn("Please upload an image for this dish.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', Number(data.price));
    formData.append('category', data.category);
    formData.append('image', image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData);

      if (response.data.success) {
        setData({
          name: '',
          description: '',
          price: '',
          category: 'Salad'
        });
        setImage(false);
        toast.success(response.data.message || "Dish added to BITEZY menu!");
      } else {
        toast.error(response.data.message || "Failed to add dish.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not connect to backend server. Please verify your connection or try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-food-page">
      <div className="page-header-row">
        <div>
          <span className="admin-tag">MENU INVENTORY</span>
          <h1 className="admin-page-title">Add New Food Item</h1>
          <p className="admin-page-subtitle">Publish a new culinary creation to the customer menu catalog.</p>
        </div>
      </div>

      <div className="add-food-card">
        <form onSubmit={onSubmitHandler} className="add-food-form">
          {/* Image Upload Zone */}
          <div className="form-section">
            <label className="section-label">Dish Photography</label>
            <div className="upload-dropzone">
              <label htmlFor="food-image-input" className="upload-label-area">
                {image ? (
                  <div className="preview-container">
                    <img src={URL.createObjectURL(image)} alt="Preview" className="uploaded-preview-img" />
                    <span className="change-photo-badge">Change Photo</span>
                  </div>
                ) : (
                  <div className="empty-upload-placeholder">
                    <div className="upload-icon-circle">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    </div>
                    <strong>Click to upload dish photo</strong>
                    <p>PNG, JPG, or WEBP up to 5MB</p>
                  </div>
                )}
              </label>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="food-image-input"
                accept="image/*"
                hidden
                required
              />
            </div>
          </div>

          {/* Dish Details */}
          <div className="form-section">
            <div className="form-group">
              <label>Product Name</label>
              <input
                onChange={onChangeHandler}
                value={data.name}
                type="text"
                name="name"
                placeholder="E.g., Truffle Mushroom Pasta"
                required
              />
            </div>

            <div className="form-group">
              <label>Dish Description</label>
              <textarea
                onChange={onChangeHandler}
                value={data.description}
                name="description"
                rows="4"
                placeholder="Describe flavors, key ingredients, preparation style, and dietary notes..."
                required
              ></textarea>
            </div>

            <div className="form-row-split">
              <div className="form-group">
                <label>Food Category</label>
                <select onChange={onChangeHandler} name="category" value={data.category}>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Price (USD $)</label>
                <div className="price-input-box">
                  <span className="price-symbol">$</span>
                  <input
                    onChange={onChangeHandler}
                    value={data.price}
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    placeholder="14.99"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions-bar">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn-primary-admin submit-dish-btn ${isSubmitting ? 'submitting' : ''}`}
            >
              {isSubmitting ? 'Publishing Dish...' : 'Publish to BITEZY Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;
