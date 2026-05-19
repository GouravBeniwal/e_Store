import React from "react";
import { Link } from "react-router-dom";

const OrderResult = ({ success, orderData, error }) => {
  if (success) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ fontSize: "72px", marginBottom: "20px" }}>🎉</div>

        <h1>Order Placed Successfully!</h1>

        <p style={{ marginTop: "12px" }}>
          Order ID: <strong>#{orderData.id}</strong>
        </p>

        <p style={{ marginBottom: "24px" }}>
          Total: ₹{orderData.total.toLocaleString()}
        </p>

        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link to="/profile" className="btn-primary">
            View Orders
          </Link>

          <Link to="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{ fontSize: "72px", marginBottom: "20px" }}>❌</div>

      <h1>Order Failed</h1>

      <p style={{ marginTop: "12px", color: "#c00" }}>
        {error || "Something went wrong"}
      </p>

      <Link
        to="/cart"
        className="btn-primary"
        style={{ marginTop: "24px", display: "inline-block" }}
      >
        Try Again
      </Link>
    </div>
  );
};

export default OrderResult;
