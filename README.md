# 🛒 Ben's Store — Full-Stack E-Commerce

A complete e-commerce application built with **React + Flask + SQLite**.

## 🚀 Quick Start

### 1. Start Backend (Terminal 1)
```bash
cd backend
pip install flask flask-sqlalchemy flask-jwt-extended flask-cors bcrypt
python populate_db.py   # Seeds DB with 8 products + admin user
python app.py           # Runs on http://127.0.0.1:5000
```

### 2. Start Frontend (Terminal 2)
```bash
cd frontend
npm install
npm start               # Runs on http://localhost:3000
```

## 🔑 Demo Credentials

| Role  | Email              | Password  |
|-------|--------------------|-----------|
| Admin | admin@shop.com     | admin123  |
| User  | user@shop.com      | user123   |

## 🗂️ Project Structure

```
project/
├── backend/
│   ├── app.py              # Flask API (SQLite + JWT + bcrypt)
│   ├── populate_db.py      # DB seeder with 8 products
│   ├── static/images/      # Local product images (bottle*.jpg)
│   └── instance/           # SQLite DB (auto-created)
├── frontend/
│   └── src/
│       ├── pages/          # Home, Shop, ProductDetail, Cart, Profile, Login, Signup, Admin
│       ├── components/     # Header, Footer, Toast
│       └── utils/          # auth.js, toast.js
└── images/                 # Source product images
```

## ✅ Features Implemented

### Authentication
- JWT tokens stored in localStorage
- bcrypt password hashing
- Protected routes (cart, orders, admin)
- Admin vs user role detection

### Shopping
- Browse 8 products with local images
- Filter by category (Hydration, Sports, Kids, Premium)
- Search by name or description
- Product detail with stock count
- Quantity selector before adding to cart

### Cart & Orders
- Add / update / remove cart items
- Real-time total calculation (free shipping over ₹2000)
- Place order → stock deducted → cart cleared
- Order success screen with order ID
- Order history in profile page

### Admin Panel (3 tabs)
- **Products**: Add / Edit / Delete products
- **Users**: View all registered users
- **Orders**: View all orders with status

### UI / UX
- Toast notifications (success, error, info)
- Responsive design (mobile + desktop)
- Readable fonts: DM Sans 17px body, Cormorant Garamond headings
- Local bottle images served from Flask static

## 🔌 API Endpoints

| Method | Route                     | Auth     | Description          |
|--------|---------------------------|----------|----------------------|
| POST   | /api/register             | Public   | Create account       |
| POST   | /api/login                | Public   | Login → JWT token    |
| GET    | /api/me                   | JWT      | Current user info    |
| GET    | /api/products             | Public   | List / search        |
| GET    | /api/products/:id         | Public   | Product detail       |
| GET    | /api/categories           | Public   | Distinct categories  |
| GET    | /api/cart                 | JWT      | Get cart             |
| POST   | /api/cart                 | JWT      | Add to cart          |
| PUT    | /api/cart/:id             | JWT      | Update quantity      |
| DELETE | /api/cart/:id             | JWT      | Remove item          |
| POST   | /api/orders               | JWT      | Place order          |
| GET    | /api/orders               | JWT      | My orders            |
| POST   | /api/admin/products       | JWT+Admin| Add product          |
| PUT    | /api/admin/products/:id   | JWT+Admin| Edit product         |
| DELETE | /api/admin/products/:id   | JWT+Admin| Delete product       |
| GET    | /api/admin/users          | JWT+Admin| All users            |
| GET    | /api/admin/orders         | JWT+Admin| All orders           |
| GET    | /images/:filename         | Public   | Serve product image  |
