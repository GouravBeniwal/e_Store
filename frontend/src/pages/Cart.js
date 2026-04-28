import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import { getToken } from "../utils/auth";
import { toast } from "../utils/toast";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [ordering,  setOrdering]  = useState(false);
  const [orderDone, setOrderDone] = useState(null); // { id, total }
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
    const token = getToken();
    if (!token) { navigate("/login"); return; }
    try {
      const r = await axios.get(`${API_BASE_URL}/cart`, { headers: { Authorization: `Bearer ${token}` } });
      setCartItems(r.data);
    } catch { toast.error("Could not load cart"); }
    finally  { setLoading(false); }
  }, [navigate]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const handleRemove = async (id) => {
    const token = getToken();
    try {
      await axios.delete(`${API_BASE_URL}/cart/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Item removed from cart");
      fetchCart();
    } catch { toast.error("Could not remove item"); }
  };

  const handleQtyChange = async (id, qty) => {
    const token = getToken();
    if (qty < 1) { handleRemove(id); return; }
    try {
      await axios.put(`${API_BASE_URL}/cart/${id}`, { quantity: qty }, { headers: { Authorization: `Bearer ${token}` } });
      fetchCart();
    } catch (err) { toast.error(err.response?.data?.message || "Could not update quantity"); }
  };

  const handlePlaceOrder = async () => {
    const token = getToken();
    setOrdering(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/orders`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setOrderDone({ id: res.data.order_id, total: res.data.total });
      setCartItems([]);
      toast.success("Order placed successfully! 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed. Please try again.");
    } finally { setOrdering(false); }
  };

  const total = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0);

  if (loading) return <div style={{ textAlign:"center", padding:"80px", fontSize:"20px" }}>Loading cart…</div>;

  if (orderDone) return (
    <div style={{ textAlign:"center", padding:"80px 20px" }}>
      <div style={{ fontSize:"72px", marginBottom:"20px" }}>🎉</div>
      <h1 style={{ fontSize:"clamp(28px,5vw,48px)", marginBottom:"12px" }}>Order Placed!</h1>
      <p style={{ fontSize:"18px", color:"var(--mid)", marginBottom:"8px" }}>
        Your order <strong>#{orderDone.id}</strong> has been confirmed.
      </p>
      <p style={{ fontSize:"20px", fontWeight:700, color:"var(--dark)", marginBottom:"32px" }}>
        Total: ₹{orderDone.total.toLocaleString()}
      </p>
      <div style={{ display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap" }}>
        <Link to="/profile" className="btn-primary">View My Orders</Link>
        <Link to="/shop"    className="btn-primary" style={{ background:"var(--brown)" }}>Continue Shopping</Link>
      </div>
    </div>
  );

  return (
    <div className="section">
      <h1 style={{ fontSize:"clamp(28px,5vw,48px)", marginBottom:"32px" }}>
        Your Cart {cartItems.length > 0 && <span style={{ fontSize:"20px", color:"var(--brown)", fontWeight:400 }}>({cartItems.length} items)</span>}
      </h1>

      {cartItems.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px" }}>
          <div style={{ fontSize:"60px", marginBottom:"16px" }}>🛒</div>
          <p style={{ fontSize:"20px", color:"var(--brown)", marginBottom:"24px" }}>Your cart is empty.</p>
          <Link to="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:"32px", alignItems:"start" }}>
          <div>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  <img src={item.product.image_url || "https://via.placeholder.com/120"} alt={item.product.name} />
                </div>
                <div className="cart-item-info">
                  <div style={{ fontSize:"18px", fontWeight:700 }}>{item.product.name}</div>
                  <div style={{ fontSize:"17px", color:"var(--accent)", fontWeight:600, margin:"6px 0" }}>₹{item.product.price.toLocaleString()}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:"0", border:"1.5px solid var(--taupe)", borderRadius:"4px", width:"fit-content", marginTop:"10px" }}>
                    <button onClick={() => handleQtyChange(item.id, item.quantity - 1)} style={{ width:"36px", height:"36px", fontSize:"20px", background:"none", border:"none", cursor:"pointer" }}>−</button>
                    <span style={{ width:"36px", textAlign:"center", fontSize:"16px", fontWeight:600 }}>{item.quantity}</span>
                    <button onClick={() => handleQtyChange(item.id, item.quantity + 1)} style={{ width:"36px", height:"36px", fontSize:"20px", background:"none", border:"none", cursor:"pointer" }}>+</button>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"8px" }}>
                  <div style={{ fontSize:"18px", fontWeight:700 }}>₹{(item.product.price * item.quantity).toLocaleString()}</div>
                  <button onClick={() => handleRemove(item.id)} style={{ fontSize:"13px", color:"#c00", background:"none", border:"none", cursor:"pointer", padding:"4px 0" }}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <h3 style={{ fontSize:"22px", marginBottom:"20px" }}>Order Summary</h3>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"10px", fontSize:"16px" }}>
              <span>Subtotal</span><span>₹{total.toLocaleString()}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"10px", fontSize:"16px", color:"var(--brown)" }}>
              <span>Shipping</span><span>{total >= 2000 ? "Free" : "₹99"}</span>
            </div>
            <hr style={{ margin:"16px 0", borderColor:"var(--sand)" }} />
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"20px", fontWeight:700, marginBottom:"24px" }}>
              <span>Total</span>
              <span>₹{(total >= 2000 ? total : total + 99).toLocaleString()}</span>
            </div>
            <button className="btn-primary" onClick={handlePlaceOrder} disabled={ordering}
              style={{ width:"100%", padding:"16px", fontSize:"17px" }}>
              {ordering ? "Placing Order…" : "Place Order →"}
            </button>
            <Link to="/shop" style={{ display:"block", textAlign:"center", marginTop:"14px", fontSize:"15px", color:"var(--brown)" }}>Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
};
export default Cart;
