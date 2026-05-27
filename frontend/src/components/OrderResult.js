import React from "react";
import { Link } from "react-router-dom";

const OrderResult = ({ success, orderData, error, setStep }) => {
  if (success) {
    return (
      <div className="order-result">
        <div className="order-result-icon">🎉</div>
        <h1 className="order-result-title">Order Placed Successfully!</h1>
        <p className="order-result-text">
          Order ID: <strong>#{orderData.id}</strong>
        </p>
        <p className="order-result-total">
          Total: ₹{orderData.total.toLocaleString()}
        </p>
        <div className="order-result-actions">
          <Link to="/orders" className="btn-primary">
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
    <div className="order-result">
      <div className="order-result-icon">❌</div>
      <h1 className="order-result-title">Order Failed</h1>
      <p className="order-result-text error-text">
        {error || "Something went wrong"}
      </p>
      <button
        onClick={() => setStep("cart")}
        className="btn-primary order-result-button"
      >
        Try Again
      </button>
    </div>
  );
};

export default OrderResult;
