import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import { getToken } from "../utils/auth";
import { toast } from "../utils/toast";

const ProductDetail = () => {
  const { id } = useParams();
  const [product,  setProduct]  = useState(null);
  const [qty,      setQty]      = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [adding,   setAdding]   = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/products/${id}`)
      .then((r) => setProduct(r.data))
      .catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    const token = getToken();
    if (!token) { toast.error("Please log in to add items to cart"); return; }
    if (qty < 1) { toast.error("Quantity must be at least 1"); return; }
    setAdding(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/cart`, { product_id: Number(id), quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add to cart");
    } finally { setAdding(false); }
  };

  if (loading) return <div style={{ textAlign:"center", padding:"80px", fontSize:"20px" }}>Loading…</div>;
  if (!product) return <div style={{ textAlign:"center", padding:"80px" }}>Product not found. <Link to="/shop">Browse Shop</Link></div>;

  return (
    <div className="product-detail">
      <div className="product-gallery">
        <div className="main-img">
          <img src={product.image_url || "https://via.placeholder.com/600x800"} alt={product.name} />
        </div>
      </div>
      <div className="product-detail-info">
        <Link to="/shop" style={{ fontSize:"14px", color:"var(--brown)", marginBottom:"12px", display:"block" }}>← Back to Shop</Link>
        <div className="product-category">{product.category}</div>
        <h1 style={{ fontSize:"clamp(24px,4vw,38px)", marginBottom:"12px" }}>{product.name}</h1>
        <div className="product-detail-price">₹{product.price.toLocaleString()}</div>

        <div style={{ margin:"8px 0 24px", fontSize:"15px", color: product.stock > 0 ? "#1a7a3a" : "#c00", fontWeight:600 }}>
          {product.stock > 0 ? `✓ In Stock — ${product.stock} available` : "✕ Out of Stock"}
        </div>

        <div className="product-description" style={{ fontSize:"17px", lineHeight:1.7, color:"var(--mid)", marginBottom:"28px" }}>
          {product.description}
        </div>

        {product.stock > 0 && (
          <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"24px", flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0", border:"1.5px solid var(--taupe)", borderRadius:"4px" }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))}
                style={{ width:"42px", height:"46px", fontSize:"22px", background:"none", border:"none", cursor:"pointer", color:"var(--dark)" }}>−</button>
              <span style={{ width:"46px", textAlign:"center", fontSize:"18px", fontWeight:600 }}>{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))}
                style={{ width:"42px", height:"46px", fontSize:"22px", background:"none", border:"none", cursor:"pointer", color:"var(--dark)" }}>+</button>
            </div>
            <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={adding}>
              {adding ? "Adding…" : "Add to Cart"}
            </button>
          </div>
        )}

        <Link to="/cart" style={{ fontSize:"15px", color:"var(--accent)", textDecoration:"underline" }}>View Cart →</Link>
      </div>
    </div>
  );
};
export default ProductDetail;
