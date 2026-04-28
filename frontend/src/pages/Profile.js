import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import { getToken, getUser } from "../utils/auth";

const Badge = ({ status }) => {
  const colors = { confirmed:"#1a5c3a", pending:"#a06000", cancelled:"#8b1a1a" };
  return (
    <span style={{ padding:"4px 12px", borderRadius:"20px", fontSize:"13px", fontWeight:600,
      background: colors[status] || "#555", color:"#fff", textTransform:"capitalize" }}>
      {status}
    </span>
  );
};

const Profile = () => {
  const [orders,  setOrders]  = useState([]);
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) { navigate("/login"); return; }
    setUser(getUser());
    axios.get(`${API_BASE_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <div style={{ textAlign:"center", padding:"80px" }}>Loading…</div>;

  return (
    <div className="section" style={{ maxWidth:"800px", margin:"0 auto" }}>
      {user && (
        <div style={{ background:"var(--sand)", borderRadius:"8px", padding:"28px", marginBottom:"40px", display:"flex", gap:"20px", alignItems:"center" }}>
          <div style={{ width:"64px", height:"64px", borderRadius:"50%", background:"var(--dark)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"28px", fontWeight:700, flexShrink:0 }}>
            {user.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize:"24px", marginBottom:"4px" }}>{user.username}</h2>
            <p style={{ color:"var(--brown)", fontSize:"16px" }}>{user.is_admin ? "👑 Admin Account" : "Customer"}</p>
          </div>
        </div>
      )}

      <h2 style={{ fontSize:"28px", marginBottom:"24px" }}>Order History</h2>

      {orders.length === 0 ? (
        <div style={{ textAlign:"center", padding:"48px", background:"var(--sand)", borderRadius:"8px" }}>
          <div style={{ fontSize:"48px", marginBottom:"16px" }}>📦</div>
          <p style={{ fontSize:"18px", color:"var(--brown)", marginBottom:"20px" }}>You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={{ border:"1.5px solid var(--sand)", borderRadius:"8px", padding:"24px", marginBottom:"20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"16px", flexWrap:"wrap", gap:"12px" }}>
              <div>
                <div style={{ fontSize:"18px", fontWeight:700 }}>Order #{order.id}</div>
                <div style={{ fontSize:"14px", color:"var(--brown)", marginTop:"4px" }}>
                  {new Date(order.created_at).toLocaleDateString("en-IN", { year:"numeric", month:"long", day:"numeric" })}
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <Badge status={order.status} />
                <div style={{ fontSize:"20px", fontWeight:700, marginTop:"8px" }}>₹{order.total_amount.toLocaleString()}</div>
              </div>
            </div>
            <div style={{ background:"var(--cream)", borderRadius:"4px", padding:"16px" }}>
              {order.items.map((item, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", fontSize:"15px", borderBottom: i < order.items.length - 1 ? "1px solid var(--sand)" : "none" }}>
                  <span>{item.product_name} × {item.quantity}</span>
                  <span style={{ fontWeight:600 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
export default Profile;
