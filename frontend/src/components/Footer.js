import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer>
    <div style={{ maxWidth:"1280px", margin:"0 auto" }}>
      <div style={{ fontFamily:"var(--font-display)", fontSize:"32px", fontWeight:600, color:"#fff", marginBottom:"20px", letterSpacing:"0.04em" }}>
        Ben's Store
      </div>
      <p style={{ marginBottom:"20px", lineHeight:1.7 }}>
        Premium hydration products for every lifestyle.<br />Quality crafted, designed to last.
      </p>
      <div style={{ marginBottom:"28px" }}>
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/profile">Orders</Link>
        <Link to="/login">Login</Link>
      </div>
      <hr style={{ borderColor:"rgba(255,255,255,0.1)", marginBottom:"20px" }} />
      <p style={{ fontSize:"14px" }}>© {new Date().getFullYear()} Ben's Store. All rights reserved.</p>
    </div>
  </footer>
);
export default Footer;
