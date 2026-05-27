import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import { getToken } from "../utils/auth";
import { toast } from "../utils/toast";

const Profile = () => {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleChange = (key) => (event) => {
    setProfile({ ...profile, [key]: event.target.value });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    setSaving(true);
    try {
      await axios.put(`${API_BASE_URL}/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaving(false);
      toast.success("Profile updated successfully.");
      navigate("/");
    } catch (err) {
      setSaving(false);
      toast.error(err.response?.data?.message || "Failed to save profile.");
    }
  };

  if (loading) return <div className="page-loading">Loading…</div>;

  return (
    <div className="section profile-page">
      <div className="profile-card">
        <h2>Account Profile</h2>
        <form className="profile-form" onSubmit={handleSave}>
          <div className="form-group">
            <label>Name</label>
            <input
              value={profile.username}
              onChange={handleChange("username")}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input value={profile.email} disabled />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={profile.phone}
              pattern="[6-9]{1}[0-9]{9}"
              onChange={handleChange("phone")}
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea
              value={profile.address}
              onChange={handleChange("address")}
              rows={4}
            />
          </div>
          <div className="profile-grid">
            <div className="form-group">
              <label>City</label>
              <input value={profile.city} onChange={handleChange("city")} />
            </div>
            <div className="form-group">
              <label>State</label>
              <input value={profile.state} onChange={handleChange("state")} />
            </div>
            <div className="form-group">
              <label>Pincode</label>
              <input
                value={profile.pincode}
                onChange={handleChange("pincode")}
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn-primary btn-profile"
            disabled={saving}
          >
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
