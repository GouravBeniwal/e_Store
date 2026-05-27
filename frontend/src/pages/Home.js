import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import groceryHero from "../assets/grocery_bg.jpg";
import fashionHero from "../assets/fashion-hero.jpg";
import decorationHero from "../assets/decoration-hero.jpeg";
import technologyHero from "../assets/tech-hero.jpeg";

const heroSlides = [
  {
    category: "Fashion",
    label: "New Season Style",
    title: "Dress Up Your Everyday",
    description:
      "Discover bold looks, polished essentials, and wardrobe favorites for every occasion.",
    image: fashionHero,
  },
  {
    category: "Technology",
    label: "Fresh Tech Picks",
    title: "Gear for Modern Living",
    description:
      "Shop smart gadgets, sleek accessories, and daily tech that keeps you connected.",
    image: technologyHero,
  },
  {
    category: "Decoration",
    label: "Home Interior",
    title: "Make Your Space Feel Alive",
    description:
      "Refresh your home with decor, lighting, and accents designed to inspire comfort.",
    image: decorationHero,
  },
  {
    category: "Grocery",
    label: "Fresh Finds",
    title: "Daily Essentials Delivered",
    description:
      "Stock up on pantry staples, healthy picks, and everyday favorites with ease.",
    image: groceryHero,
  },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/products`)
      .then((r) => setProducts(r.data.slice(0, 4)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[activeSlide];

  return (
    <>
      {/* HERO */}
      <section className="hero hero-slider">
        <div className="hero-bg">
          <img src={slide.image} alt={slide.category} />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-label">{slide.label}</div>
          <h1>
            {slide.title.split(" ").map((word, index) => (
              <React.Fragment key={index}>
                {word}
                <br />
              </React.Fragment>
            ))}
          </h1>
          <p>{slide.description}</p>
          <Link
            to={`/shop?category=${encodeURIComponent(slide.category)}`}
            className="btn-primary"
          >
            Explore {slide.category} →
          </Link>
          <div className="hero-dots">
            {heroSlides.map((item, index) => (
              <button
                key={item.category}
                className={
                  index === activeSlide ? "hero-dot active" : "hero-dot"
                }
                onClick={() => setActiveSlide(index)}
                aria-label={`Show ${item.category}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <div className="section">
        <div className="section-label fade-up">Fresh Selections</div>
        <div className="section-header fade-up">
          <h2 className="section-title">
            New <em>Arrivals</em>
          </h2>
          <Link to="/shop" className="view-all">
            View More
          </Link>
        </div>
        <div className="products-grid">
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="product-card fade-up"
            >
              <div className="product-img">
                <img
                  src={p.image_url || "https://via.placeholder.com/300x400"}
                  alt={p.name}
                  loading="lazy"
                />
                <div className="product-quick-add">Quick View</div>
              </div>
              <div className="product-info">
                <div className="product-category">{p.category}</div>
                <div className="product-name">{p.name}</div>
                <div className="product-price">₹{p.price.toLocaleString()}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FEATURES STRIP */}
      <div className="features-strip">
        <div className="features-inner">
          {[
            {
              num: "01",
              title: "Premium Quality",
              desc: "Every product passes rigorous quality checks. Built to last and perform.",
            },
            {
              num: "02",
              title: "Fast & Free Shipping",
              desc: "Orders over ₹2000 ship free. Most orders delivered within 3-5 days.",
            },
            {
              num: "03",
              title: "Easy Returns",
              desc: "Not satisfied? 10-day hassle-free returns on all products.",
            },
          ].map(({ num, title, desc }) => (
            <div className="feature-item" key={num}>
              <div className="feature-num">{num}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="section" style={{ textAlign: "center" }}>
        <div className="section-label">Browse By</div>
        <h2 className="section-title">Categories</h2>
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "32px",
          }}
        >
          {["Fashion", "Technology", "Decoration", "Grocery"].map((cat) => (
            <Link
              key={cat}
              to={`/shop?category=${cat}`}
              className="btn-primary"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
export default Home;
