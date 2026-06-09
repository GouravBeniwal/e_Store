# 🛒 Ben's Store — Full-Stack E-Commerce

A complete e-commerce application built with **React + Flask + SQLite**.

## 🚀 Quick Start

### 1. Start Backend (Terminal 1)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python populate_db.py   # seeds DB with sample products + admin user
python app.py           # starts server on http://127.0.0.1:5000
```

You can also run the bundled helper: `./start_backend.sh` (from repo root).

### Frontend

```bash
cd frontend
npm install
npm start               # runs on http://localhost:3000
```

Or run `./start_frontend.sh` from the repo root to start the frontend.

### Start Both (convenience)

```bash
./start.sh
```

## 🔑 Demo Credentials

| Role  | Email          | Password |
| ----- | -------------- | -------- |
| Admin | admin@shop.com | admin123 |
| User  | user@shop.com  | User@123 |

## 🗂️ Project Structure

```
project/
├── backend/                  # Flask API + SQLite instance
│   ├── middleware/           # JWT auth middleware
│   ├── models/               # DB models
│   ├── routes/               # API route handlers
│   ├── utilis/               # helper utilities
│   ├── app.py                # Flask app entrypoint
│   ├── populate_db.py        # DB seeder (creates sample products + users)
│   ├── requirements.txt      # Python dependencies
│   └── instance/             # SQLite DB file (auto-created)
|   └── test_routes/          # Automation testing scripts
├── frontend/                 # React app
│   ├── public/
│   └── src/
│       ├── pages/
│       ├── components/
│       └── utils/
├── Dockerfile                # Optional container setup
├── nginx.conf                # Reverse-proxy example
├── start_backend.sh
├── start_frontend.sh
└── start.sh                  # convenience script to run both
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

## 🔌 API Endpoints (summary)

| Method | Route                   | Auth      | Description         |
| ------ | ----------------------- | --------- | ------------------- |
| POST   | /api/register           | Public    | Create account      |
| POST   | /api/login              | Public    | Login → JWT token   |
| GET    | /api/me                 | JWT       | Current user info   |
| GET    | /api/products           | Public    | List / search       |
| GET    | /api/products/:id       | Public    | Product detail      |
| GET    | /api/categories         | Public    | Distinct categories |
| GET    | /api/cart               | JWT       | Get cart            |
| POST   | /api/cart               | JWT       | Add to cart         |
| PUT    | /api/cart/:id           | JWT       | Update quantity     |
| DELETE | /api/cart/:id           | JWT       | Remove item         |
| POST   | /api/orders             | JWT       | Place order         |
| GET    | /api/orders             | JWT       | My orders           |
| POST   | /api/admin/products     | JWT+Admin | Add product         |
| PUT    | /api/admin/products/:id | JWT+Admin | Edit product        |
| DELETE | /api/admin/products/:id | JWT+Admin | Delete product      |
| GET    | /api/admin/users        | JWT+Admin | All users           |
| GET    | /api/admin/orders       | JWT+Admin | All orders          |
| GET    | /images/:filename       | Public    | Serve product image |

## Docker / Deployment

- A `Dockerfile` and `nginx.conf` are included as a starting point for containerized deployment.

## Notes

- The backend uses SQLite and stores the DB under `backend/instance` by default.
- If you change dependencies, update `backend/requirements.txt` and re-install inside the virtualenv.

---

If you'd like, I can also:

- run the app locally and verify the endpoints
- add a short CONTRIBUTING or DEVELOPMENT section with common dev commands
