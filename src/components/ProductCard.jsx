import React from "react";

export default function ProductCard({ name, price, image, description, rating, reviews, stock, onAddToCart }) {
  // Render full and half stars based on rating out of 5
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} style={{ color: '#fbbf24' }}>★</span>); // Full star
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} style={{ color: '#fbbf24', position: 'relative' }}>
          <span style={{ position: 'absolute', overflow: 'hidden', width: '50%' }}>★</span>
          <span style={{ color: '#e2e8f0' }}>★</span>
        </span>); // Half star trick
      } else {
        stars.push(<span key={i} style={{ color: '#e2e8f0' }}>★</span>); // Empty star
      }
    }
    return stars;
  };

  return (
    <div className="product-card">
      <div className="product-image-container" style={{ position: 'relative' }}>
        <img src={image} alt={name} />
        {stock < 10 && stock > 0 && (
          <span style={{
            position: 'absolute', top: '10px', right: '10px',
            background: 'var(--danger)', color: 'white',
            padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold'
          }}>
            Only {stock} left
          </span>
        )}
      </div>
      
      <div className="product-info" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3>{name}</h3>
        
        {rating && (
          <div className="product-rating" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', fontSize: '1.2rem' }}>
              {renderStars(rating)}
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              {rating.toFixed(1)} ({reviews})
            </span>
          </div>
        )}

        {description && (
          <p className="product-description" style={{
            fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            flex: 1
          }}>
            {description}
          </p>
        )}
        
        <p className="product-price">${Number(price).toFixed(2)}</p>
      </div>

      <button onClick={onAddToCart} disabled={stock === 0} style={{ opacity: stock === 0 ? 0.5 : 1 }}>
        {stock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}
