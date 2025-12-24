import React from "react";

export default function About() {
  return (
    <section className="info-page">
      <div className="info-container">
        <h1>About QuickCart</h1>
        
        <div className="info-content">
          <h2>Who We Are</h2>
          <p>
            QuickCart is your premier destination for online shopping, offering a vast selection 
            of over 200+ quality products at competitive prices. We're committed to making your 
            shopping experience seamless, enjoyable, and secure.
          </p>

          <h2>Our Mission</h2>
          <p>
            To provide customers with a fast, reliable, and user-friendly e-commerce platform 
            that delivers quality products right to your doorstep. We believe shopping should 
            be convenient, affordable, and accessible to everyone.
          </p>

          <h2>Why Choose Us?</h2>
          <ul>
            <li><strong>Wide Selection:</strong> Browse through 200+ carefully curated products</li>
            <li><strong>Competitive Prices:</strong> Get the best deals on quality items</li>
            <li><strong>Secure Shopping:</strong> Your data and transactions are protected</li>
            <li><strong>Fast Delivery:</strong> Quick and reliable shipping to your location</li>
            <li><strong>Customer Support:</strong> We're here to help whenever you need us</li>
          </ul>

          <h2>Our Values</h2>
          <p>
            <strong>Quality:</strong> We partner with trusted suppliers to ensure every product meets our high standards.
          </p>
          <p>
            <strong>Trust:</strong> Your satisfaction and security are our top priorities.
          </p>
          <p>
            <strong>Innovation:</strong> We continuously improve our platform to serve you better.
          </p>

          <h2>Contact Us</h2>
          <p>
            Have questions or feedback? We'd love to hear from you! Visit our{" "}
            <a href="/contact" className="inline-link">Contact page</a> to get in touch.
          </p>
        </div>
      </div>
    </section>
  );
}
