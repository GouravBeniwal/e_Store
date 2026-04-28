import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import { setAuth } from "../utils/auth";
import { toast } from "../utils/toast";

const Login = () => {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, { email, password });
      setAuth(res.data.access_token, {
        username: res.data.username,
        is_admin: res.data.is_admin,
        user_id:  res.data.user_id,
      });
      window.dispatchEvent(new Event("auth-change"));
      toast.success(`Welcome back, ${res.data.username}! 🎉`);
      navigate(res.data.is_admin ? "/admin" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your Ben's Store account</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Your password" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <p className="auth-switch">No account? <Link to="/signup">Create one</Link></p>
        <div className="auth-hint">
          <small>Demo: user@shop.com / user123 &nbsp;|&nbsp; Admin: admin@shop.com / admin123</small>
        </div>
      </div>
    </div>
  );
};
export default Login;
