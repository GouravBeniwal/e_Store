import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import { getToken } from "../utils/auth";

const Badge = ({ status }) => {
  const colors = {
    confirmed: "#1a5c3a",
    pending: "#a06000",
    cancelled: "#8b1a1a",
  };
  return (
    <span className="badge" style={{ background: colors[status] || "#555" }}>
      {status}
    </span>
  );
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <div className="page-loading">Loading…</div>;

  return (
    <div className="section orders-page">
      <div className="orders-header">
        <h1>Order History</h1>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <div className="empty-state-text">
            You haven't placed any orders yet.
          </div>
          <Link to="/shop" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <div>
                <h3>Order #{order.id}</h3>
                <p>
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <Badge status={order.status} />
                <div className="order-total">
                  ₹{order.total_amount.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item-row">
                  <span>
                    {item.product_name} × {item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
