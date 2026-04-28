import React from "react";
import { Link } from "react-router-dom";

function About() {
  return (
    <>
      <section className="about-hero">
        <div className="about-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80"
            alt="About Ben's Store"
          />
        </div>
        <div className="about-hero-content">
          <h1>
            Our story,
            <br />
            our craft.
          </h1>
        </div>
      </section>

      <section className="section about-section">
        <div className="about-grid">
          <div>
            <div className="section-label fade-up">Who we are</div>
            <h2 className="section-title fade-up" style={{ marginBottom: 24 }}>
              Crafted with
              <br />
              <em>intention</em>
            </h2>
            <p className="fade-up about-copy">
              Ben&apos;s Store was born from a simple belief: that everyday
              products should be beautiful, functional, and made to last. We
              curate only the finest items — from skincare rituals to home
              essentials — built by makers who share our obsession with quality.
            </p>
            <p className="fade-up about-copy">
              Each product in our catalog is hand-selected and tested by our
              team. We believe in transparency, fair pricing, and building a
              community of people who appreciate the finer things in everyday
              life.
            </p>
            <Link to="/shop" className="btn-dark fade-up">
              Shop the Collection
            </Link>
          </div>
          <div className="about-image-wrapper fade-up">
            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80"
              alt="About Ben's Store"
            />
          </div>
        </div>
      </section>

      <section className="features-strip">
        <div className="features-inner">
          <div className="feature-item">
            <div className="feature-num">500+</div>
            <h3>Products curated</h3>
            <p>
              Every item hand-picked for quality, design, and everyday utility.
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-num">50k+</div>
            <h3>Happy customers</h3>
            <p>
              Shoppers across 40+ countries trust Ben&apos;s Store for their
              purchases.
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-num">4.9★</div>
            <h3>Average rating</h3>
            <p>
              Consistently praised for product quality and shopping experience.
            </p>
          </div>
        </div>
      </section>

      <section className="section founder-section">
        <div className="founder-header fade-up">
          <div className="section-label">Meet the founder</div>
          <h2 className="section-title">
            Beni, the <em>curator</em>
          </h2>
        </div>
        <div className="founder-grid">
          <div className="founder-image fade-up">
            <img src="./images/avatar.png" alt="Beni, Founder of Ben's Store" />
          </div>
          <div className="founder-content fade-up">
            <p className="founder-bio">
              Gourav Beniwal spent a decade traveling the world, collecting
              stories and discovering makers who share his passion for quality
              and craftsmanship. Each product in our store represents a
              connection to these artisans and their dedication to excellence.
            </p>
            <p className="founder-bio">
              Today, Ben's Store is more than just a collection of products—it's
              a movement toward intentional living and meaningful consumption.
              Every purchase supports craftspeople and helps build a more
              conscious, connected community.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
