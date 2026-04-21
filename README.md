# eStore

A simple Flask-based eCommerce demo site built with Python, HTML templates, and SQLite. It includes product browsing, authentication, JWT token handling, and a lightweight storefront experience.

## Features

- Responsive storefront homepage with featured products
- Product listing and detail pages
- User signup and login with password hashing
- JWT access and refresh token generation
- SQLite user storage for quick local setup
- Email subscription endpoint for newsletter signups

## Built With

- Python
- Flask
- Flask-Bcrypt
- SQLite
- HTML / CSS / JavaScript

## Getting Started

### Prerequisites

- Python 3.10+ (or compatible)
- `pip` package manager

### Install dependencies

```bash
pip install -r requirements.txt
```

### Run the app

```bash
python app.py
```

Then open `http://127.0.0.1:5000` in your browser.

## Project Structure

- `app.py` — Flask application with routes, authentication, and sample product data
- `templates/` — HTML templates for pages like home, shop, product, login, signup, profile, and about
- `static/` — CSS, JavaScript, and image assets for the frontend
- `requirements.txt` — Python dependencies
- `database.db` — SQLite database created automatically at runtime

## Frontend

The frontend is built with vanilla HTML, CSS, and JavaScript:

- **Responsive Design** — CSS-based styling with support for mobile and desktop
- **Templates** — Jinja2 templates for dynamic content rendering
  - `base.html` — Base template with navigation and footer
  - `index.html` — Homepage with featured products
  - `shop.html` — Product listing page
  - `product.html` — Individual product detail page
  - `login.html` — User login form
  - `signup.html` — User registration form
  - `profile.html` — User profile page
  - `about.html` — About page
- **Static Assets** — CSS files, JavaScript logic, and images
- **Client-side Authentication** — JWT tokens stored in localStorage for persistent sessions

## Backend

The backend is powered by Flask and SQLite:

### API Endpoints

- **User Management** — `/signup`, `/login`, `/profile`, `/refresh`
- **Products** — Product listing and details rendered via templates
- **Newsletter** — Email subscription endpoint
- **Protected Routes** — JWT-based authentication for user profile

### Database Schema

#### ER Diagram

```
                          ┌──────────────────┐
                          │     USERS        │
                          ├──────────────────┤
                          │ id (PK)          │
                          │ email (UNIQUE)   │
                          │ password         │
                          │ name             │
                          │ phone            │
                          │ gender           │
                          │ created_at       │
                          └────────┬─────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    │ (1:N)        │ (1:N)        │ (1:N)
                    ▼              ▼              ▼
        ┌─────────────────┐  ┌──────────┐  ┌──────────────┐
        │   ADDRESSES     │  │  CART    │  │    ORDERS    │
        ├─────────────────┤  ├──────────┤  ├──────────────┤
        │ id (PK)         │  │ id (PK)  │  │ id (PK)      │
        │ user_id (FK)    │  │ user_id  │  │ user_id (FK) │
        │ address_line    │  │(FK)      │  │ total        │
        │ city            │  │created_at│  │ status       │
        │ state           │  └────┬─────┘  │ created_at   │
        │ postal_code     │       │        └──────┬───────┘
        │ country         │       │ (1:N)        │
        │ is_default      │       │              │ (1:N)
        └─────────────────┘       ▼              ▼
                        ┌──────────────────┐  ┌──────────┐
                        │   CART_ITEMS     │  │ PAYMENTS │
                        ├──────────────────┤  ├──────────┤
                        │ id (PK)          │  │ id (PK)  │
                        │ cart_id (FK)     │  │ order_id │
                        │ product_id (FK)  │  │(FK)      │
                        │ quantity         │  │ amount   │
                        └────────┬─────────┘  │ payment_ │
                                 │           │ method   │
                                 │           │ payment_ │
                                 │ (1:N)     │ status   │
                                 │           │ created_ │
                                 │           │ at       │
                                 ▼           └──────────┘
                    ┌────────────────────────┐
                    │      PRODUCTS          │
                    ├────────────────────────┤
                    │ id (PK)                │
                    │ name                   │
                    │ description            │
                    │ price                  │
                    │ stock                  │
                    │ created_at             │
                    └────────────┬───────────┘
                                 │
                                 │ (1:N)
                                 ▼
                    ┌────────────────────────┐
                    │   PRODUCT_IMAGES       │
                    ├────────────────────────┤
                    │ id (PK)                │
                    │ product_id (FK)        │
                    │ image_url              │
                    └────────────────────────┘
```

#### Table Descriptions

| Table              | Description                                         |
| ------------------ | --------------------------------------------------- |
| **USERS**          | Stores user account information                     |
| **ADDRESSES**      | Stores multiple shipping/billing addresses per user |
| **PRODUCTS**       | Stores product catalog data                         |
| **PRODUCT_IMAGES** | Stores multiple images per product                  |
| **CART**           | Shopping cart per user                              |
| **CART_ITEMS**     | Individual items in the cart                        |
| **ORDERS**         | Order records with status tracking                  |
| **PAYMENTS**       | Payment transaction records                         |

### Database Setup

The application uses the schema defined in `schema.sql` which creates all necessary tables with proper relationships and constraints.

## Authentication

- `/signup` — create a new user with email and password
- `/login` — log in and store JWT access/refresh tokens in browser storage
- `/profile_page` — user profile page
- `/profile` — protected endpoint returning the authenticated user's email
- `/refresh` — refresh access tokens using a valid refresh token

## Notes

- The app initializes a SQLite database automatically when it starts.
- For local development, the app runs in debug mode.
- This project is ideal for learning Flask, authentication patterns, and working with simple storefront pages.

## License

This project is provided as-is for learning and demo purposes.
