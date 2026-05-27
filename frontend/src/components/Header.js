import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import { clearAuth, getUser, isLoggedIn, isAdmin } from "../utils/auth";

const CartIcon = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);
const UserIcon = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const refresh = useCallback(() => {
    setLoggedIn(isLoggedIn());
    setAdmin(isAdmin());
    const u = getUser();
    setUsername(u?.username || "");
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("auth-change", refresh);
    return () => window.removeEventListener("auth-change", refresh);
  }, [refresh]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/categories`)
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const parseParts = (cat) =>
    cat
      .split("/")
      .map((part) => part.trim())
      .filter(Boolean);

  const parentCategories = Array.from(
    new Set(categories.map((cat) => parseParts(cat)[0] || "").filter(Boolean)),
  ).sort();

  const subcategoryMap = parentCategories.reduce((acc, parent) => {
    acc[parent] = Array.from(
      new Set(
        categories
          .map((cat) => parseParts(cat))
          .filter((parts) => parts[0] === parent && parts.length > 1)
          .map((parts) => parts[1]),
      ),
    ).sort();
    return acc;
  }, {});

  const handleLogout = () => {
    clearAuth();
    setLoggedIn(false);
    setAdmin(false);
    setDropdown(false);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  return (
    <>
      <div className="announce-bar">
        <span>
          🚀 Free shipping on orders over ₹2000 &nbsp;·&nbsp; New arrivals every
          Friday
        </span>
      </div>
      <nav className="navbar">
        <div className="nav-inner">
          <Link to="/" className="nav-logo">
            Ben's Store
          </Link>

          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <div
              className="shop-menu"
              onMouseEnter={() => setShopDropdown(true)}
              onMouseLeave={() => setShopDropdown(false)}
            >
              <Link
                to="/shop"
                onClick={() => {
                  setMenuOpen(false);
                  setShopDropdown(false);
                }}
              >
                Shop
              </Link>
              <div className={`shop-dropdown ${shopDropdown ? "open" : ""}`}>
                <div className="shop-dropdown-group">
                  {parentCategories.map((parent) => (
                    <div key={parent} className="shop-dropdown-panel">
                      <Link
                        to={`/shop?category=${encodeURIComponent(parent)}`}
                        onClick={() => {
                          setMenuOpen(false);
                          setShopDropdown(false);
                        }}
                        className="shop-dropdown-title"
                      >
                        {parent}
                      </Link>
                      <div className="shop-dropdown-chip-row">
                        {subcategoryMap[parent].map((sub) => (
                          <Link
                            key={`${parent} / ${sub}`}
                            to={`/shop?category=${encodeURIComponent(`${parent} / ${sub}`)}`}
                            onClick={() => {
                              setMenuOpen(false);
                              setShopDropdown(false);
                            }}
                            className="shop-dropdown-chip shop-dropdown-subchip"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
          </div>

          <div className="nav-right-icons">
            {!admin && (
              <Link to="/cart" className="nav-icon" title="Cart">
                <CartIcon />
              </Link>
            )}
            {loggedIn ? (
              <div
                className="nav-icon nav-account"
                onMouseEnter={() => setDropdown(true)}
                onMouseLeave={() => setDropdown(false)}
                onClick={() => setDropdown(!dropdown)}
              >
                <div className="account-summary">
                  <UserIcon />
                  <span>{username}</span>
                </div>
                {dropdown && (
                  <div className="dropdown">
                    <Link to="/profile" onClick={() => setDropdown(false)}>
                      Profile
                    </Link>
                    <Link to="/cp" onClick={() => setDropdown(false)}>
                      Change Password
                    </Link>
                    {!admin && (
                      <Link to="/orders" onClick={() => setDropdown(false)}>
                        My Orders
                      </Link>
                    )}
                    {!admin && (
                      <Link to="/cart" onClick={() => setDropdown(false)}>
                        Cart
                      </Link>
                    )}
                    {admin && (
                      <Link to="/admin" onClick={() => setDropdown(false)}>
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} className="logout-button">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-icon" title="Login">
                <UserIcon />
              </Link>
            )}
            <button
              className="hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
