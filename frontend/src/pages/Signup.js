import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import { toast } from "../utils/toast";

const Signup = () => {
  const [form, setForm] = useState({ username:"", email:"", password:"", confirm:"" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error("Passwords do not match!"); return; }
    if (form.password.length < 6)       { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/register`, {
        username: form.username, email: form.email, password: form.password
      });
      toast.success("Account created! Please log in.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join Ben's Store and start shopping</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          {[
            { label:"Username",        key:"username", type:"text",     ph:"yourname"          },
            { label:"Email Address",   key:"email",    type:"email",    ph:"you@example.com"   },
            { label:"Password",        key:"password", type:"password", ph:"Min. 6 characters" },
            { label:"Confirm Password",key:"confirm",  type:"password", ph:"Repeat password"   },
          ].map(({ label, key, type, ph }) => (
            <div className="form-group" key={key}>
              <label>{label}</label>
              <input type={type} placeholder={ph} value={form[key]} onChange={set(key)} required />
            </div>
          ))}
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? "Creating…" : "Create Account"}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
};
export default Signup;
