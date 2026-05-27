import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-brand">Ben's Store</div>
      <p className="footer-copy">
        Your one-stop destination for quality products, great deals, and secure
        shopping. Shop smart. Live better.
      </p>
      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/login">Login</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="footer-note">
        © {new Date().getFullYear()} Ben's Store. All rights reserved.
      </div>
    </div>
  </footer>
);
export default Footer;
