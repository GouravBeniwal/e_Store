import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import { getToken, isAdmin } from "../utils/auth";
import { toast } from "../utils/toast";

const TABS = ["Products", "Users", "Orders"];
const EMPTY = { name:"", description:"", price:"", category:"", stock:"", image_url:"" };

const Admin = () => {
  const [tab,         setTab]         = useState("Products");
  const [products,    setProducts]    = useState([]);
  const [users,       setUsers]       = useState([]);
  const [orders,      setOrders]      = useState([]);
  const [form,        setForm]        = useState(EMPTY);
  const [editId,      setEditId]      = useState(null);
  const [showForm,    setShowForm]    = useState(false);
  const [loading,     setLoading]     = useState(true);
  const navigate = useNavigate();

  const token = getToken();

  useEffect(() => {
    if (!token || !isAdmin()) { navigate("/login"); return; }
    loadAll();
  }, [navigate, token]); // eslint-disable-line

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pr, ur, or_] = await Promise.all([
        axios.get(`${API_BASE_URL}/products`),
        axios.get(`${API_BASE_URL}/admin/users`,   { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/admin/orders`,  { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setProducts(pr.data); setUsers(ur.data); setOrders(or_.data);
    } catch { toast.error("Failed to load data"); }
    finally  { setLoading(false); }
  }, [token]);

  const handleSave = async (e) => {
    e.preventDefault();
    const body = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
    try {
      if (editId) {
        await axios.put(`${API_BASE_URL}/admin/products/${editId}`, body, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Product updated!");
      } else {
        await axios.post(`${API_BASE_URL}/admin/products`, body, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Product added!");
      }
      setForm(EMPTY); setEditId(null); setShowForm(false);
      loadAll();
    } catch (err) { toast.error(err.response?.data?.message || "Failed to save product"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/admin/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Product deleted");
      loadAll();
    } catch { toast.error("Delete failed"); }
  };

  const handleEdit = (p) => {
    setForm({ name:p.name, description:p.description, price:p.price, category:p.category, stock:p.stock, image_url:p.image_url||"" });
    setEditId(p.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior:"smooth" });
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  if (loading) return <div style={{ textAlign:"center", padding:"80px" }}>Loading admin panel…</div>;

  return (
    <div className="section">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"32px", flexWrap:"wrap", gap:"16px" }}>
        <h1 style={{ fontSize:"clamp(24px,4vw,40px)" }}>🛠 Admin Panel</h1>
        {tab === "Products" && (
          <button className="btn-primary" onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(!showForm); }}>
            {showForm ? "Cancel" : "+ Add Product"}
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {tab === "Products" && showForm && (
        <div className="admin-form-card">
          <h3 style={{ fontSize:"20px", marginBottom:"20px" }}>{editId ? "Edit Product" : "New Product"}</h3>
          <form onSubmit={handleSave} style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(250px,1fr))", gap:"16px" }}>
            {[
              { label:"Product Name", key:"name",        type:"text",   ph:"e.g. Classic Bottle" },
              { label:"Category",     key:"category",    type:"text",   ph:"e.g. Hydration"      },
              { label:"Price (₹)",    key:"price",       type:"number", ph:"999"                 },
              { label:"Stock",        key:"stock",       type:"number", ph:"50"                  },
              { label:"Image URL",    key:"image_url",   type:"text",   ph:"http://..."          },
            ].map(({ label, key, type, ph }) => (
              <div className="form-group" key={key}>
                <label>{label}</label>
                <input type={type} placeholder={ph} value={form[key]} onChange={set(key)} required={key !== "image_url"} min={type === "number" ? 0 : undefined} step={key === "price" ? "0.01" : undefined} />
              </div>
            ))}
            <div className="form-group" style={{ gridColumn:"1 / -1" }}>
              <label>Description</label>
              <textarea placeholder="Product description…" value={form.description} onChange={set("description")} required
                style={{ width:"100%", padding:"12px 14px", border:"1.5px solid var(--sand)", borderRadius:"4px", fontSize:"15px", resize:"vertical", minHeight:"90px", fontFamily:"inherit" }} />
            </div>
            <div style={{ gridColumn:"1 / -1", display:"flex", gap:"12px" }}>
              <button type="submit" className="btn-primary" style={{ padding:"12px 32px" }}>{editId ? "Save Changes" : "Add Product"}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} style={{ padding:"12px 24px", background:"var(--sand)", border:"none", borderRadius:"4px", cursor:"pointer", fontSize:"15px" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display:"flex", gap:"8px", marginBottom:"24px", borderBottom:"2px solid var(--sand)", paddingBottom:"0" }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding:"12px 24px", fontSize:"16px", fontWeight: tab === t ? 700 : 400,
              background:"none", border:"none", cursor:"pointer", color: tab === t ? "var(--dark)" : "var(--brown)",
              borderBottom: tab === t ? "2px solid var(--dark)" : "2px solid transparent", marginBottom:"-2px" }}>
            {t} <span style={{ opacity:0.6, fontSize:"13px" }}>({t === "Products" ? products.length : t === "Users" ? users.length : orders.length})</span>
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {tab === "Products" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px,1fr))", gap:"20px" }}>
          {products.map((p) => (
            <div key={p.id} style={{ border:"1.5px solid var(--sand)", borderRadius:"8px", overflow:"hidden" }}>
              <div style={{ height:"180px", overflow:"hidden", background:"var(--sand)" }}>
                <img src={p.image_url || "https://via.placeholder.com/300"} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              </div>
              <div style={{ padding:"16px" }}>
                <div style={{ fontWeight:700, fontSize:"17px", marginBottom:"4px" }}>{p.name}</div>
                <div style={{ color:"var(--accent)", fontWeight:600, marginBottom:"4px" }}>₹{p.price.toLocaleString()}</div>
                <div style={{ fontSize:"13px", color:"var(--brown)", marginBottom:"12px" }}>Stock: {p.stock} · {p.category}</div>
                <div style={{ display:"flex", gap:"8px" }}>
                  <button onClick={() => handleEdit(p)} style={{ flex:1, padding:"8px", background:"var(--dark)", color:"#fff", border:"none", borderRadius:"4px", cursor:"pointer", fontSize:"14px" }}>Edit</button>
                  <button onClick={() => handleDelete(p.id)} style={{ flex:1, padding:"8px", background:"#8b1a1a", color:"#fff", border:"none", borderRadius:"4px", cursor:"pointer", fontSize:"14px" }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users Tab */}
      {tab === "Users" && (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"15px" }}>
            <thead>
              <tr style={{ background:"var(--sand)" }}>
                {["ID","Username","Email","Role","Joined"].map((h) => (
                  <th key={h} style={{ padding:"14px 16px", textAlign:"left", fontWeight:600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom:"1px solid var(--sand)" }}>
                  <td style={{ padding:"14px 16px", color:"var(--brown)" }}>#{u.id}</td>
                  <td style={{ padding:"14px 16px", fontWeight:600 }}>{u.username}</td>
                  <td style={{ padding:"14px 16px" }}>{u.email}</td>
                  <td style={{ padding:"14px 16px" }}>
                    <span style={{ padding:"3px 10px", borderRadius:"20px", fontSize:"13px", background: u.is_admin ? "#1a3a5c" : "var(--sand)", color: u.is_admin ? "#fff" : "var(--dark)", fontWeight:600 }}>
                      {u.is_admin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td style={{ padding:"14px 16px", color:"var(--brown)", fontSize:"14px" }}>{new Date(u.created_at).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Orders Tab */}
      {tab === "Orders" && (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"15px" }}>
            <thead>
              <tr style={{ background:"var(--sand)" }}>
                {["Order ID","Customer","Items","Total","Status","Date"].map((h) => (
                  <th key={h} style={{ padding:"14px 16px", textAlign:"left", fontWeight:600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} style={{ borderBottom:"1px solid var(--sand)" }}>
                  <td style={{ padding:"14px 16px", fontWeight:700 }}>#{o.id}</td>
                  <td style={{ padding:"14px 16px" }}>{o.user}</td>
                  <td style={{ padding:"14px 16px", color:"var(--brown)" }}>{o.item_count}</td>
                  <td style={{ padding:"14px 16px", fontWeight:600 }}>₹{o.total_amount.toLocaleString()}</td>
                  <td style={{ padding:"14px 16px" }}>
                    <span style={{ padding:"3px 10px", borderRadius:"20px", fontSize:"13px", fontWeight:600, background:"#1a5c3a", color:"#fff" }}>{o.status}</span>
                  </td>
                  <td style={{ padding:"14px 16px", color:"var(--brown)", fontSize:"14px" }}>{new Date(o.created_at).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default Admin;
