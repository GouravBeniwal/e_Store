import React, { useState } from "react";

const PaymentMethod = ({ onBack, onPay }) => {
  const [method, setMethod] = useState("cod");

  const [upiId, setUpiId] = useState("");

  const [cardData, setCardData] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (method === "upi" && !upiId) {
      alert("Enter UPI ID");
      return;
    }

    if (
      method === "card" &&
      (!cardData.name || !cardData.number || !cardData.expiry || !cardData.cvv)
    ) {
      alert("Fill all card details");
      return;
    }

    onPay({ method, upiId, cardData });
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-card">
      <h2 className="checkout-title">Payment Method</h2>

      <div className="payment-options">
        <label className={`payment-option ${method === "cod" ? "active" : ""}`}>
          <input
            type="radio"
            value="cod"
            checked={method === "cod"}
            onChange={(e) => setMethod(e.target.value)}
          />

          <div className="payment-logo">💵</div>

          <div>
            <div className="payment-name">Cash on Delivery</div>
            <div className="payment-desc">Pay when your order arrives</div>
          </div>
        </label>

        <label className={`payment-option ${method === "upi" ? "active" : ""}`}>
          <input
            type="radio"
            value="upi"
            checked={method === "upi"}
            onChange={(e) => setMethod(e.target.value)}
          />

          <div className="payment-logo">📱</div>

          <div>
            <div className="payment-name">UPI Payment</div>
            <div className="payment-desc">Google Pay, PhonePe, Paytm</div>
          </div>
        </label>

        {method === "upi" && (
          <div className="payment-form">
            <input
              type="text"
              placeholder="Enter UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="input"
            />
          </div>
        )}

        <label
          className={`payment-option ${method === "card" ? "active" : ""}`}
        >
          <input
            type="radio"
            value="card"
            checked={method === "card"}
            onChange={(e) => setMethod(e.target.value)}
          />

          <div className="payment-logo">💳</div>

          <div>
            <div className="payment-name">Card Payment</div>
            <div className="payment-desc">Visa, Mastercard, RuPay</div>
          </div>
        </label>

        {method === "card" && (
          <div className="payment-form">
            <input
              type="text"
              placeholder="Card Holder Name"
              className="input"
              value={cardData.name}
              onChange={(e) =>
                setCardData({
                  ...cardData,
                  name: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Card Number"
              className="input"
              value={cardData.number}
              onChange={(e) =>
                setCardData({
                  ...cardData,
                  number: e.target.value,
                })
              }
            />

            <div className="card-row">
              <input
                type="text"
                placeholder="MM/YY"
                className="input"
                value={cardData.expiry}
                onChange={(e) =>
                  setCardData({
                    ...cardData,
                    expiry: e.target.value,
                  })
                }
              />

              <input
                type="password"
                placeholder="CVV"
                className="input"
                value={cardData.cvv}
                onChange={(e) =>
                  setCardData({
                    ...cardData,
                    cvv: e.target.value,
                  })
                }
              />
            </div>
          </div>
        )}
      </div>

      <div className="checkout-actions payment-actions">
        <button type="button" onClick={onBack} className="secondary-btn">
          ← Back
        </button>

        <button className="btn-primary">Confirm Order →</button>
      </div>
    </form>
  );
};

export default PaymentMethod;
