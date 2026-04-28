import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

const Shop = () => {
  const [products,  setProducts]  = useState([]);
  const [categories,setCategories]= useState([]);
  const [selCat,    setSelCat]    = useState("all");
  const [search,    setSearch]    = useState("");
  const [loading,   setLoading]   = useState(true);
  const location = useLocation();

  const fetchProducts = useCallback((cat = "", q = "") => {
    setLoading(true);
    const params = {};
    if (cat && cat !== "all") params.category = cat;
    if (q)   params.search = q;
    axios.get(`${API_BASE_URL}/products`, { params })
      .then((r) => setProducts(r.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/categories`).then((r) => setCategories(r.data)).catch(() => {});
    const params = new URLSearchParams(location.search);
    const cat = params.get("category") || "all";
    setSelCat(cat);
    fetchProducts(cat);
  }, [location.search, fetchProducts]);

  const handleCategory = (cat) => { setSelCat(cat); fetchProducts(cat, search); };
  const handleSearch   = (e)  => { e.preventDefault(); fetchProducts(selCat, search); };

  return (
    <>
      <div className="shop-hero">
        <div className="section-label">All Products</div>
        <h1 className="section-title">The <em>Shop</em></h1>

        <div className="shop-filters">
          <button className={`filter-btn ${selCat === "all" ? "active" : ""}`} onClick={() => handleCategory("all")}>All</button>
          {categories.map((c) => (
            <button key={c} className={`filter-btn ${selCat === c ? "active" : ""}`} onClick={() => handleCategory(c)}>{c}</button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <input type="text" placeholder="Search products…" value={search}
            onChange={(e) => setSearch(e.target.value)} className="search-input" />
          <button type="submit" className="btn-primary" style={{ padding:"12px 24px", fontSize:"15px" }}>Search</button>
        </form>
      </div>

      <div className="section">
        {loading ? (
          <div style={{ textAlign:"center", padding:"60px", fontSize:"18px", color:"var(--brown)" }}>Loading products…</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px" }}>
            <div style={{ fontSize:"48px", marginBottom:"16px" }}>🔍</div>
            <p style={{ fontSize:"18px", color:"var(--brown)" }}>No products found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="product-card fade-up">
                <div className="product-img">
                  <img src={p.image_url || "https://via.placeholder.com/300x400"} alt={p.name} loading="lazy" />
                  <div className="product-quick-add">View Product</div>
                  {p.stock === 0 && <div className="out-of-stock-badge">Out of Stock</div>}
                </div>
                <div className="product-info">
                  <div className="product-category">{p.category}</div>
                  <div className="product-name">{p.name}</div>
                  <div className="product-price">₹{p.price.toLocaleString()}</div>
                  <div style={{ fontSize:"13px", color: p.stock > 0 ? "var(--brown)" : "#c00", marginTop:"4px" }}>
                    {p.stock > 0 ? `${p.stock} in stock` : "Sold out"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
export default Shop;
