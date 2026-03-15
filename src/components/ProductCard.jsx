import React from "react";
import { FiBox, FiTruck, FiShield } from "react-icons/fi";

export default function ProductCard({ 
  name, price, image, description, rating, reviews, stock, 
  brand, discountPercentage, tags, shippingInformation, warrantyInformation, availabilityStatus, 
  weight, dimensions,
  onAddToCart 
}) {
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

  const isLowStock = availabilityStatus === "Low Stock" || (stock < 10 && stock > 0);
  const isOutOfStock = availabilityStatus === "Out of Stock" || stock === 0;

  return (
    <div className="product-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="product-image-container" style={{ position: 'relative' }}>
        <img src={image} alt={name} />
        
        {/* Discount Badge */}
        {discountPercentage > 5 && (
          <span style={{
            position: 'absolute', top: '10px', left: '10px',
            background: 'var(--danger)', color: 'white',
            padding: '4px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 'bold',
            boxShadow: 'var(--shadow-sm)'
          }}>
            -{Math.round(discountPercentage)}% OFF
          </span>
        )}

        {/* Low Stock Badge */}
        {isLowStock && (
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
        {brand && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{brand}</span>}
        <h3 style={{ marginBottom: '0.3rem' }}>{name}</h3>
        
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

        {/* Price display with optional strikethrough */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem' }}>
          <p className="product-price" style={{ margin: 0 }}>${Number(price).toFixed(2)}</p>
          {discountPercentage > 5 && (
            <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              ${(price / (1 - discountPercentage / 100)).toFixed(2)}
            </span>
          )}
        </div>

        {description && (
          <p className="product-description" style={{
            fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '1rem',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {description}
          </p>
        )}

        {/* Meta Info: Shipping, Warranty, Quality */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: 'auto', marginBottom: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
           {shippingInformation && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiTruck size={12} /> {shippingInformation}</div>}
           {warrantyInformation && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiShield size={12} /> {warrantyInformation}</div>}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {tags.slice(0, 3).map((tag, i) => (
              <span key={i} style={{ background: 'var(--bg-default)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.65rem', color: 'var(--text-muted)', border: '1px solid var(--glass-border)' }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Specifications Section */}
        {(weight || dimensions) && (
          <div style={{ padding: '0.8rem', background: 'var(--bg-default)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', marginTop: 'auto', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Specifications</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.75rem' }}>
              {weight && (
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Weight:</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 'bold', marginLeft: '4px' }}>{weight}g</span>
                </div>
              )}
              {dimensions && (
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Dim:</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 'bold', marginLeft: '4px' }}>
                    {dimensions.width}x{dimensions.height}x{dimensions.depth}cm
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <button onClick={onAddToCart} disabled={isOutOfStock} style={{ opacity: isOutOfStock ? 0.5 : 1, marginTop: 'auto' }}>
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}
