import React, { useState } from "react";

const ShippingAddress = ({ onNext }) => {
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !address.fullName ||
      !address.phone ||
      !address.address ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      alert("Please fill all fields");
      return;
    }

    onNext(address);
  };

  return (
    <div className="shipping-wrapper">
      <div className="shipping-container">
        <form onSubmit={handleSubmit} className="order-summary">
          <h2 style={{ marginBottom: "20px" }}>Shipping Address</h2>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={address.fullName}
            onChange={handleChange}
            className="input"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={address.phone}
            onChange={handleChange}
            className="input"
          />

          <textarea
            name="address"
            placeholder="Full Address"
            value={address.address}
            onChange={handleChange}
            className="input textarea"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={address.city}
            onChange={handleChange}
            className="input"
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={address.state}
            onChange={handleChange}
            className="input"
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={address.pincode}
            onChange={handleChange}
            className="input"
          />

          <button className="btn-primary" style={{ marginTop: "20px" }}>
            Continue to Payment →
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingAddress;
