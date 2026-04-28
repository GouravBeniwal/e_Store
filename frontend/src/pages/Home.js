import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/products`)
      .then((r) => setProducts(r.data.slice(0, 4)))
      .catch(() => {});
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80" alt="Hero" />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-label">New Collection — 2025</div>
          <h1>Hydrate in<br /><em>Style</em></h1>
          <p>Premium bottles crafted for every adventure. Quality you can trust, design you'll love.</p>
          <Link to="/shop" className="btn-primary">Shop Now →</Link>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <div className="section">
        <div className="section-label fade-up">Fresh Selections</div>
        <div className="section-header fade-up">
          <h2 className="section-title">New <em>Arrivals</em></h2>
          <Link to="/shop" className="view-all">View More</Link>
        </div>
        <div className="products-grid">
          {products.map((p) => (
            <Link key={p.id} to={`/product/${p.id}`} className="product-card fade-up">
              <div className="product-img">
                <img src={p.image_url || "https://via.placeholder.com/300x400"} alt={p.name} loading="lazy" />
                <div className="product-quick-add">Quick View</div>
              </div>
              <div className="product-info">
                <div className="product-category">{p.category}</div>
                <div className="product-name">{p.name}</div>
                <div className="product-price">₹{p.price.toLocaleString()}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FEATURES STRIP */}
      <div className="features-strip">
        <div className="features-inner">
          {[
            { num:"01", title:"Premium Quality",     desc:"Every bottle passes rigorous quality checks. Built to last and perform." },
            { num:"02", title:"Fast & Free Shipping",desc:"Orders over ₹2000 ship free. Most orders delivered within 3-5 days." },
            { num:"03", title:"Easy Returns",         desc:"Not satisfied? 30-day hassle-free returns on all products." },
          ].map(({ num, title, desc }) => (
            <div className="feature-item" key={num}>
              <div className="feature-num">{num}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="section" style={{ textAlign:"center" }}>
        <div className="section-label">Browse By</div>
        <h2 className="section-title">Categories</h2>
        <div style={{ display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap", marginTop:"32px" }}>
          {["Hydration","Sports","Kids","Premium"].map((cat) => (
            <Link key={cat} to={`/shop?category=${cat}`}
              style={{ padding:"16px 32px", background:"var(--dark)", color:"var(--cream)", borderRadius:"4px", fontSize:"16px", fontWeight:600, letterSpacing:"0.05em" }}>
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
export default Home;
