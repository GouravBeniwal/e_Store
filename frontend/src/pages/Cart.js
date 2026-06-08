import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import { getToken, isAdmin } from "../utils/auth";
import { toast } from "../utils/toast";

import ShippingAddress from "../components/ShippingAddress";
import PaymentMethod from "../components/PaymentMethod";
import OrderResult from "../components/OrderResult";

import placeHolder from "../assets/image_not_found.jpg";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  // const [orderDone, setOrderDone] = useState(null); // { id, total }
  const navigate = useNavigate();

  const [step, setStep] = useState("cart");

  const [shippingId, setShippingId] = useState(null);

  const [orderStatus, setOrderStatus] = useState({
    success: null,
    orderData: null,
    error: null,
  });
  const adminUser = isAdmin();

  const notifyCartChange = () => {
    window.dispatchEvent(new Event("cart-change"));
  };

  const fetchCart = useCallback(async () => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const r = await axios.get(`${API_BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(r.data);
      notifyCartChange();
    } catch {
      toast.error("Could not load cart");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleRemove = async (id) => {
    if (adminUser) {
      toast.error("Admin accounts cannot manage the cart");
      return;
    }
    const token = getToken();
    try {
      await axios.delete(`${API_BASE_URL}/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Item removed from cart");
      fetchCart();
    } catch {
      toast.error("Could not remove item");
    }
  };

  const handleQtyChange = async (id, qty) => {
    if (adminUser) {
      toast.error("Admin accounts cannot manage the cart");
      return;
    }
    const token = getToken();
    if (qty < 1) {
      handleRemove(id);
      return;
    }
    try {
      await axios.put(
        `${API_BASE_URL}/cart/${id}`,
        { quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update quantity");
    }
  };

  const handleShippingNext = async (address) => {
    if (adminUser) {
      toast.error("Admin accounts cannot checkout");
      return;
    }
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    setOrdering(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/shipping`, address, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShippingId(res.data.shipping_id);
      setStep("payment");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Could not save shipping address",
      );
    } finally {
      setOrdering(false);
    }
  };

  const handlePayment = async ({ method, upiId, cardData }) => {
    if (adminUser) {
      toast.error("Admin accounts cannot checkout");
      return;
    }
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    if (!shippingId) {
      toast.error("Please complete shipping details first");
      setStep("shipping");
      return;
    }

    setOrdering(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/payments`,
        {
          method,
          upiId,
          cardData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const orderRes = await axios.post(
        `${API_BASE_URL}/orders`,
        {
          shipping_id: shippingId,
          payment_id: res.data.payment_id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setOrderStatus({
        success: true,
        orderData: {
          id: orderRes.data.order_id,
          total: orderRes.data.total,
        },
      });

      setCartItems([]);
      notifyCartChange();
      toast.success("Order placed successfully! 🎉");
      setStep("result");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Payment failed";
      setOrderStatus({ success: false, error: message });
      toast.error(message);
      setStep("result");
    } finally {
      setOrdering(false);
    }
  };

  const total = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0);

  if (loading) return <div className="page-loading">Loading cart…</div>;

  // if (orderDone)
  //   return (
  //     <div style={{ textAlign: "center", padding: "80px 20px" }}>
  //       <div style={{ fontSize: "72px", marginBottom: "20px" }}>🎉</div>
  //       <h1 style={{ fontSize: "clamp(28px,5vw,48px)", marginBottom: "12px" }}>
  //         Order Placed!
  //       </h1>
  //       <p
  //         style={{ fontSize: "18px", color: "var(--mid)", marginBottom: "8px" }}
  //       >
  //         Your order <strong>#{orderDone.id}</strong> has been confirmed.
  //       </p>
  //       <p
  //         style={{
  //           fontSize: "20px",
  //           fontWeight: 700,
  //           color: "var(--dark)",
  //           marginBottom: "32px",
  //         }}
  //       >
  //         Total: ₹{orderDone.total.toLocaleString()}
  //       </p>
  //       <div
  //         style={{
  //           display: "flex",
  //           gap: "16px",
  //           justifyContent: "center",
  //           flexWrap: "wrap",
  //         }}
  //       >
  //         <Link to="/profile" className="btn-primary">
  //           View My Orders
  //         </Link>
  //         <Link
  //           to="/shop"
  //           className="btn-primary"
  //           style={{ background: "var(--brown)" }}
  //         >
  //           Continue Shopping
  //         </Link>
  //       </div>
  //     </div>
  //   );

  if (step === "shipping") {
    return <ShippingAddress onNext={handleShippingNext} />;
  }

  if (step === "payment") {
    return (
      <PaymentMethod onBack={() => setStep("shipping")} onPay={handlePayment} />
    );
  }

  if (step === "result") {
    return (
      <OrderResult
        success={orderStatus?.success}
        orderData={orderStatus?.orderData}
        error={orderStatus?.error}
        setStep={setStep}
      />
    );
  }
  return (
    <div className="section cart-page">
      <h1 className="section-title">
        Your Cart{" "}
        {cartItems.length > 0 && (
          <span className="cart-count">({cartItems.length} items)</span>
        )}
      </h1>
      {adminUser && (
        <div className="admin-alert">
          Admin accounts cannot manage cart items or place orders.
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <p className="empty-state-text">Your cart is empty.</p>
          <Link to="/shop" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-grid">
          <div>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  <img
                    src={item.product.image_url || placeHolder}
                    alt={item.product.name}
                  />
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.product.name}</div>
                  <div className="cart-item-price">
                    ₹{item.product.price.toLocaleString()}
                  </div>
                  <div className="qty-selector">
                    <button
                      onClick={() =>
                        handleQtyChange(item.id, item.quantity - 1)
                      }
                      className="qty-btn"
                      disabled={adminUser}
                    >
                      −
                    </button>
                    <span className="qty-count">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQtyChange(item.id, item.quantity + 1)
                      }
                      className="qty-btn"
                      disabled={adminUser}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-item-actions">
                  <div className="cart-item-total">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="cart-remove"
                    disabled={adminUser}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <h3 className="order-summary-title">Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className="summary-row summary-row--accent">
              <span>Shipping</span>
              <span>{total >= 2000 ? "Free" : "₹99"}</span>
            </div>
            <hr className="summary-divider" />
            <div className="summary-row summary-row--total">
              <span>Total</span>
              <span>
                ₹{(total >= 2000 ? total : total + 99).toLocaleString()}
              </span>
            </div>
            <button
              className="btn-primary btn-full"
              onClick={() => setStep("shipping")}
              disabled={adminUser || ordering}
            >
              {adminUser
                ? "Admin accounts cannot place orders"
                : ordering
                  ? "Placing Order…"
                  : "Place Order →"}
            </button>
            <Link to="/shop" className="continue-link">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
export default Cart;
