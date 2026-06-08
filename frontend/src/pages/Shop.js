import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import placeHolder from "../assets/image_not_found.jpg";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selCat, setSelCat] = useState("all");
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const debounceTimer = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchProducts = useCallback((cat = "", q = "") => {
    setLoading(true);
    const params = {};
    if (cat && cat !== "all") params.category = cat;
    if (q) params.search = q;
    axios
      .get(`${API_BASE_URL}/products`, { params })
      .then((r) => setProducts(r.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/categories`)
      .then((r) => setCategories(r.data))
      .catch(() => {});
    const params = new URLSearchParams(location.search);
    const cat = params.get("category") || "all";
    setSelCat(cat);
    fetchProducts(cat);
  }, [location.search, fetchProducts]);

  const parentCategories = Array.from(
    new Set(
      categories
        .map((cat) => {
          const parts = cat.split("/").map((part) => part.trim());
          return parts[0];
        })
        .filter(Boolean),
    ),
  ).sort();

  const parseCategory = (category) =>
    category
      .split("/")
      .map((part) => part.trim())
      .filter(Boolean);

  const getSubcategories = (parent) => {
    return Array.from(
      new Set(
        categories
          .map((cat) => parseCategory(cat))
          .filter((parts) => parts[0] === parent && parts.length > 1)
          .map((parts) => parts[1]),
      ),
    ).sort();
  };

  const getLabels = (parent, subcategory) => {
    return Array.from(
      new Set(
        categories
          .map((cat) => parseCategory(cat))
          .filter(
            (parts) =>
              parts[0] === parent &&
              parts[1] === subcategory &&
              parts.length > 2,
          )
          .map((parts) => parts[2]),
      ),
    ).sort();
  };

  const selectedParts = parseCategory(selCat);
  const selectedParent = selectedParts.length > 0 ? selectedParts[0] : null;
  const selectedSubcategory =
    selectedParts.length > 1 ? selectedParts[1] : null;

  const currentSubcategories = selectedParent
    ? getSubcategories(selectedParent)
    : [];
  const currentLabels =
    selectedParent && selectedSubcategory
      ? getLabels(selectedParent, selectedSubcategory)
      : [];

  const handleCategory = (cat) => {
    setSelCat(cat);
    fetchProducts(cat, search);
    if (cat === "all") {
      navigate("/shop");
    } else {
      navigate(`/shop?category=${encodeURIComponent(cat)}`);
    }
  };

  const fetchSuggestions = useCallback((query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    axios
      .get(`${API_BASE_URL}/products/suggestions`, {
        params: { q: query },
      })
      .then((r) => setSuggestions(r.data || []))
      .catch(() => setSuggestions([]));
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setShowSuggestions(true);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = window.setTimeout(() => {
      fetchSuggestions(value);
    }, 250);
  };

  const handleSuggestionClick = (value) => {
    setSearch(value);
    setShowSuggestions(false);
    fetchProducts(selCat, value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    fetchProducts(selCat, search);
  };

  return (
    <>
      <div className="shop-hero">
        <div className="section-label">All Products</div>
        <h1 className="section-title">
          The <em>Shop</em>
        </h1>

        <div className="shop-filters">
          <button
            className={`filter-btn ${selCat === "all" ? "active" : ""}`}
            onClick={() => handleCategory("all")}
          >
            All
          </button>
          {parentCategories.map((parent) => (
            <button
              key={parent}
              className={`filter-btn ${selectedParent === parent ? "active" : ""}`}
              onClick={() => handleCategory(parent)}
            >
              {parent}
            </button>
          ))}

          {selectedParent && currentSubcategories.length > 0 && (
            <>
              <div className="filter-divider" />
              <button
                className={`filter-btn ${selCat === selectedParent ? "active" : ""}`}
                onClick={() => handleCategory(selectedParent)}
              >
                All {selectedParent}
              </button>
              {currentSubcategories.map((sub) => (
                <button
                  key={sub}
                  className={`filter-btn filter-sub ${
                    selCat === `${selectedParent} / ${sub}` ? "active" : ""
                  }`}
                  onClick={() => handleCategory(`${selectedParent} / ${sub}`)}
                >
                  {sub}
                </button>
              ))}
            </>
          )}

          {selectedSubcategory && currentLabels.length > 0 && (
            <>
              <div className="filter-divider" />
              <button
                className={`filter-btn ${
                  selCat === `${selectedParent} / ${selectedSubcategory}`
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleCategory(`${selectedParent} / ${selectedSubcategory}`)
                }
              >
                All {selectedSubcategory}
              </button>
              {currentLabels.map((label) => (
                <button
                  key={label}
                  className={`filter-btn filter-sub ${
                    selCat ===
                    `${selectedParent} / ${selectedSubcategory} / ${label}`
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleCategory(
                      `${selectedParent} / ${selectedSubcategory} / ${label}`,
                    )
                  }
                >
                  {label}
                </button>
              ))}
            </>
          )}
        </div>

        <form
          onSubmit={handleSearch}
          className="search-form"
          autoComplete="off"
        >
          <div className="search-autocomplete">
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              className="search-input"
            />
            {showSuggestions && search.trim() && (
              <div className="autocomplete-dropdown">
                {suggestions.length > 0 ? (
                  suggestions.slice(0, 5).map((item, idx) => (
                    <button
                      key={`${item}-${idx}`}
                      type="button"
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      {item}
                    </button>
                  ))
                ) : (
                  <div className="no-suggestions">
                    No matching products found.
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: "12px 24px", fontSize: "15px" }}
          >
            Search
          </button>
        </form>
      </div>

      <div className="section">
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px",
              fontSize: "18px",
              color: "var(--brown)",
            }}
          >
            Loading products…
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <p style={{ fontSize: "18px", color: "var(--brown)" }}>
              No products found. Try a different search or category.
            </p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="product-card fade-up"
              >
                <div className="product-img">
                  <img
                    src={p.image_url || placeHolder}
                    alt={p.name}
                    loading="lazy"
                  />
                  <div className="product-quick-add">View Product</div>
                  {p.stock === 0 && (
                    <div className="out-of-stock-badge">Out of Stock</div>
                  )}
                </div>
                <div className="product-info">
                  <div className="product-category">
                    {p.category_label || p.subcategory || p.category}
                  </div>
                  <div className="product-name">{p.name}</div>
                  <div className="product-price">
                    ₹{p.price.toLocaleString()}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: p.stock > 0 ? "var(--brown)" : "#c00",
                      marginTop: "4px",
                    }}
                  >
                    {p.stock > 0 ? `${p.stock} in stock` : "Sold out"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
export default Shop;
