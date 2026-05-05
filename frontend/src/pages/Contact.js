import React, { useState } from "react";
const faqs = [
  {
    q: "How do I place an order?",
    a: "Simply browse our collection, add your favorite items to the cart, and proceed to checkout. The process is quick, secure, and straightforward.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept major credit cards, UPI, and other secure payment options for a smooth and reliable shopping experience.",
  },
  {
    q: "How long does shipping take?",
    a: "Shipping times vary based on location, but most orders arrive within 10 business days. Check our shipping policy for full details.",
  },
  {
    q: "Can I return or exchange an item?",
    a: "Yes! We offer hassle-free returns and exchanges within 10 days of purchase. Please see our return policy page for complete information.",
  },
  {
    q: "How can I track my order?",
    a: "Once your order ships, you'll receive a tracking number via email so you can monitor its journey directly to your door.",
  },
];

const contactCards = [
  { label: "Visit us", value: "456 Max Ave, Haryana, India", href: null },
  { label: "Call us", value: "+91 8708243427", href: "tel:8708243427" },
  {
    label: "Email us",
    value: "support@benistore.com",
    href: "mailto:support@benistore.com",
  },
  { label: "Business hours", value: "9am – 5pm IST", href: null },
];

export default function Contact() {
  const [openIndex, setOpenIndex] = useState(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <>
      <div className="support-page">
        {/* ── Hero ── */}
        <section className="support-hero">
          <div className="support-hero__text">
            <p className="support-hero__eyebrow">Customer Support</p>
            <h1 className="support-hero__title">
              We're here
              <br />
              to help
            </h1>
            <p className="support-hero__subtitle">
              Questions? Concerns? Let's make your shopping experience seamless
              and enjoyable.
            </p>
          </div>
          <div className="support-hero__image">
            <img
              src="https://framerusercontent.com/images/bFA3c4m4iQTDfKBu2hmASZI5nRc.jpeg?width=673&height=1200"
              alt="Support"
            />
            <div className="support-hero__image-overlay" />
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="support-faq">
          <div>
            <p className="support-faq__label">FAQ</p>
            <h2 className="support-faq__heading">
              Frequently
              <br />
              asked questions
            </h2>
          </div>
          <div className="support-faq__list">
            {faqs.map((item, i) => (
              <div className="faq-item" key={i}>
                <button
                  className="faq-item__button"
                  onClick={() => toggle(i)}
                  aria-expanded={openIndex === i}
                >
                  <span className="faq-item__question">{item.q}</span>
                  <span
                    className={`faq-item__icon${openIndex === i ? " open" : ""}`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`faq-item__answer${openIndex === i ? " open" : ""}`}
                >
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Contact Cards ── */}
        <section className="support-contact">
          {contactCards.map((card, i) => (
            <div className="contact-card" key={i}>
              <p className="contact-card__label">{card.label}</p>
              {card.href ? (
                <a className="contact-card__value" href={card.href}>
                  {card.value}
                </a>
              ) : (
                <span className="contact-card__value">{card.value}</span>
              )}
            </div>
          ))}
        </section>

        {/* ── Newsletter ── */}
        <section className="support-newsletter">
          <div className="support-newsletter__bg" />
          <div className="support-newsletter__content">
            <h2 className="support-newsletter__title">
              Stay ahead with exclusive deals!
            </h2>
            <p className="support-newsletter__desc">
              Be the first to know about special offers. Join our newsletter and
              get exclusive perks delivered straight to your inbox!
            </p>
            {subscribed ? (
              <p
                style={{
                  color: "#c8b89a",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "17px",
                }}
              >
                Thanks for subscribing! ✓
              </p>
            ) : (
              <form
                className="support-newsletter__form"
                onSubmit={handleSubscribe}
              >
                <input
                  className="support-newsletter__input"
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button className="support-newsletter__btn" type="submit">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
