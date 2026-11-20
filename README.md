# 🍔 BITEZY — Good Food. Great Mood.
### Modern MERN Food Delivery Platform & Executive Operations Portal

![BITEZY Branding](https://img.shields.io/badge/Brand-BITEZY-F97316?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?style=for-the-badge&logo=stripe)

---

## 🍽️ Overview

**BITEZY** is a high-performance, full-stack food delivery web application built with the MERN stack (MongoDB, Express, React, Node.js) and Vite.

The platform provides a dual-interface experience:
1. **BITEZY Customer Web Application**: An enticing, responsive food ordering marketplace designed to turn cravings into orders in under 30 minutes.
2. **BITEZY Admin Executive Portal**: A comprehensive operations and dispatch management dashboard with real-time order tracking, catalog management, and customer analytics.

---

## 🎨 Visual Identity & Color System

- **Primary Orange**: `#F97316` — Primary call-to-actions, brand marks, active navigation, highlight badges
- **Dark Charcoal**: `#171717` — Dominant headers, primary text, dark UI accents
- **Warm Cream**: `#FFF7ED` — Secondary backdrops, category chip surfaces, soft glow highlights
- **Pure White**: `#FFFFFF` — Card surfaces and container backgrounds
- **Success Green**: `#22A06B` — Fulfillment tags, payment success indicators, status dots
- **Secondary Text**: `#737373` — Body copy, subtitles, metadata

---

## ✨ Features

### 🛒 Customer Storefront (`/frontend`)
- **Modern Sticky Navbar**: Glassmorphic blur, BITEZY SVG logo, live search bar, real-time cart badge counter, and authenticated profile dropdown.
- **Hero Section**: "Cravings? We've got you covered." with multi-dish photography, live delivery time badge (< 30 min), community rating, and dual CTAs.
- **Category Explorer**: Horizontal category slider (Salad, Rolls, Deserts, Sandwich, Cake, Pure Veg, Pasta, Noodles).
- **Popular Dishes & Menu**: Consistent food cards, star ratings, category chips, animated quantity steppers, and graceful empty search states.
- **Promotions & Vouchers**: One-click copyable 30% discount voucher (`BITEZY30`).
- **Why Choose BITEZY**: Core value pillars (Under 30-min delivery, curated chefs, live GPS tracking, 100% sealed packaging).
- **Social Proof**: Real customer reviews and satisfaction metrics.
- **Interactive Cart**: Steppers, itemized line totals, promo code application, and delivery fee calculation.
- **Streamlined Checkout**: Contact and delivery destination form, Stripe payment redirection.
- **Live Order Tracking**: Visual 4-stage tracking timeline (Confirmed ➔ Kitchen Prep ➔ On The Way ➔ Delivered).
- **Branded Authentication**: Centered modal with password visibility toggling, login/register tabs, and form validation.

### 📊 Admin Operations Dashboard (`/admin`)
- **Collapsible Sidebar**: Compact/expanded navigation between Overview, Add Food, Food Inventory, Orders, and Customers.
- **Executive Overview (`/`)**: 6 KPI cards (Total Orders, Total Revenue, Pending Orders, Delivered Orders, Menu Catalog Size, Total Customers) + recent orders table.
- **Dish Management (`/add`)**: Drag-and-drop photo upload with instant image preview, category dropdown, price configuration.
- **Food Inventory (`/list`)**: Table view with live search, category filter, image preview modal, availability toggles (In Stock / Out of Stock), and delete confirmations.
- **Order Dispatch (`/orders`)**: Filterable dispatch center by status, customer contact and destination display, and instant status updates.
- **Customer Directory (`/customers`)**: Lifetime spend aggregation, order counts, and customer order history modals.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** instance
- **Stripe** account for payment gateway testing

---

### 1. Backend Server Setup
```bash
cd "LOGISTICS AND SMART DELIVERY (MODERN FOOD DELIVERY APP)/mern-food-delivery-app-main/mern-food-delivery-app-main/backend"
npm install
npm run server
```
Server runs on: `http://localhost:4000`

---

### 2. Customer Frontend Setup
```bash
cd "LOGISTICS AND SMART DELIVERY (MODERN FOOD DELIVERY APP)/mern-food-delivery-app-main/mern-food-delivery-app-main/frontend"
npm install
npm run dev
```
Customer app accessible at: `http://localhost:5173`

---

### 3. Admin Executive Portal Setup
```bash
cd "LOGISTICS AND SMART DELIVERY (MODERN FOOD DELIVERY APP)/mern-food-delivery-app-main/mern-food-delivery-app-main/admin"
npm install
npm run dev
```
Admin portal accessible at: `http://localhost:5174`

---

## 🔒 License & Copyright

Copyright © 2026 **BITEZY Inc.** All rights reserved.
*Good food. Great mood.*
