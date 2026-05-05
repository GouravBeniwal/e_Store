import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
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
            <Link to="/shop" onClick={() => setMenuOpen(false)}>
              Shop
            </Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>
              Support
            </Link>
          </div>

          <div className="nav-right-icons">
            <Link to="/cart" className="nav-icon" title="Cart">
              <CartIcon />
            </Link>
            {loggedIn ? (
              <div
                className="nav-icon nav-account"
                onMouseEnter={() => setDropdown(true)}
                onMouseLeave={() => setDropdown(false)}
                onClick={() => setDropdown(!dropdown)}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <UserIcon />
                  <span style={{ fontSize: "1.2rem", fontWeight: 600 }}>
                    {username}
                  </span>
                </div>
                {dropdown && (
                  <div className="dropdown">
                    <Link to="/profile" onClick={() => setDropdown(false)}>
                      My Orders
                    </Link>
                    <Link to="/cart" onClick={() => setDropdown(false)}>
                      Cart
                    </Link>
                    {admin && (
                      <Link to="/admin" onClick={() => setDropdown(false)}>
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        // fontSize: "inherit",
                        color: "inherit",
                        padding: "10px 16px",
                        textAlign: "left",
                        width: "100%",
                      }}
                    >
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
