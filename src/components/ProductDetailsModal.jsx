import React from "react";
import { FiX, FiShoppingCart, FiTruck, FiShield, FiPackage, FiBox } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ProductDetailsModal({ product, onClose, onAddToCart }) {
  const navigate = useNavigate();
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content product-details-modal" onClick={(e) => e.stopPropagation()} style={{
        maxWidth: '900px',
        width: '95%',
        padding: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '95vh',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--glass-border)',
        zIndex: 1001
      }}>
        <style>{`
          @media (max-width: 768px) {
            .details-container { flex-direction: column; overflow-y: auto; }
            .details-image { flex: 0 0 auto !important; padding: 1rem !important; }
            .details-info { flex: 0 0 auto !important; padding: 1.5rem !important; }
            .details-info h1 { font-size: 1.5rem !important; }
            .details-info .price { font-size: 1.8rem !important; }
          }
        `}</style>
        <button className="close-btn" onClick={onClose} style={{ top: '15px', right: '15px', zIndex: 10 }}>
          <FiX />
        </button>

        <div className="details-container" style={{ display: 'flex', flexWrap: 'wrap', height: '100%' }}>
          {/* Left: Image Section */}
          <div className="details-image" style={{
            flex: '1 1 400px',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            position: 'relative'
          }}>
            <img src={product.image} alt={product.name} style={{
              maxWidth: '100%',
              maxHeight: '500px',
              objectFit: 'contain'
            }} />
            
            {product.discountPercentage > 5 && (
              <span style={{
                position: 'absolute', top: '20px', left: '20px',
                background: 'var(--danger)', color: 'white',
                padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 'bold'
              }}>
                -{Math.round(product.discountPercentage)}% OFF
              </span>
            )}
          </div>

          {/* Right: Info Section */}
          <div className="details-info" style={{
            flex: '1 1 400px',
            padding: '3rem 2.5rem',
            background: 'white',
            overflowY: 'auto'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              {product.brand && <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{product.brand}</span>}
              <h1 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{product.name}</h1>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '1rem 0' }}>
                <div style={{ display: 'flex', color: '#fbbf24', fontSize: '1.4rem' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>{i < Math.floor(product.rating || 0) ? '★' : '☆'}</span>
                    ))}
                </div>
                <span style={{ color: 'var(--text-muted)' }}>({product.reviews} reviews)</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px', marginBottom: '2rem' }}>
              <span className="price" style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)' }}>${product.price.toFixed(2)}</span>
              {product.discountPercentage > 5 && (
                <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                  ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                </span>
              )}
            </div>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: '1.7', marginBottom: '2rem' }}>
              {product.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <FiTruck color="var(--primary)" size={18} />
                <span>{product.shippingInformation}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <FiShield color="var(--primary)" size={18} />
                <span>{product.warrantyInformation}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <FiPackage color="var(--primary)" size={18} />
                <span>{product.availabilityStatus}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <FiBox color="var(--primary)" size={18} />
                <span>{product.weight}g / {product.dimensions?.width}x{product.dimensions?.height}cm</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => { 
                  onAddToCart(product); 
                  onClose();
                  navigate("/cart");
                }}
                className="btn-primary" 
                style={{ flex: 2, padding: '1.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              >
                <FiShoppingCart /> ORDER NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
