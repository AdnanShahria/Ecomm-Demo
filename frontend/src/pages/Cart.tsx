import React from 'react';
import { useCartStore } from '../store/cartStore';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckSquare, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { parseImages } from '../utils/parseImages';

export const Cart: React.FC = () => {
  const { items, selectedItemIds, removeItem, updateQuantity, toggleSelection, setSelectedItems, clearSelection } = useCartStore();
  const navigate = useNavigate();

  const handleQuantityChange = (id: string, qty: number) => {
    if (qty < 1) return;
    updateQuantity(id, qty);
  };

  const isAllSelected = items.length > 0 && selectedItemIds.length === items.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      setSelectedItems(items.map(item => item.product.id));
    }
  };

  const selectedItemsCount = selectedItemIds.length;
  const subtotal = items
    .filter(item => selectedItemIds.includes(item.product.id))
    .reduce((sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="cart-page" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <ShoppingBag size={28} />
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet. Browse our products and find something you love!</p>
          <button onClick={() => navigate('/shop')} className="cart-empty-cta">
            Start Shopping <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  const getThumb = (product: { images?: string | string[] }) => {
    const imgs = parseImages(product.images);
    return imgs.length > 0 ? imgs[0] : null;
  };

  return (
    <div className="cart-page">
      {/* Header */}
      <div className="cart-header">
        <h1 className="cart-title">Your Cart</h1>
        <div className="cart-controls">
          <button onClick={toggleSelectAll} className="cart-select-all-btn">
            {isAllSelected
              ? <CheckSquare size={16} className="icon-active" />
              : <Square size={16} />}
            Select All ({items.length})
          </button>
          {selectedItemsCount > 0 && (
            <button onClick={clearSelection} className="cart-deselect-btn">
              Deselect All
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items-col">
          {items.map((item) => {
            const isSelected = selectedItemIds.includes(item.product.id);
            const thumb = getThumb(item.product);
            return (
              <div
                key={item.product.id}
                className={`cart-item${isSelected ? ' selected' : ''}`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleSelection(item.product.id)}
                  className={`cart-item-checkbox${isSelected ? ' checked' : ''}`}
                >
                  {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>

                {/* Thumbnail */}
                <div className="cart-item-thumb">
                  {thumb ? (
                    <img src={thumb} alt={item.product.title} />
                  ) : (
                    <div className="cart-item-thumb-placeholder">
                      <ShoppingBag size={18} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="cart-item-info">
                  <span className="cart-item-name">{item.product.title}</span>
                  <span className="cart-item-brand">{item.product.brand}</span>
                  <span className="cart-item-price">
                    ৳{(item.product.salePrice || item.product.price).toLocaleString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="cart-item-actions">
                  <div className="cart-qty-stepper">
                    <button
                      onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                      className="cart-qty-btn"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="cart-qty-value">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                      className="cart-qty-btn"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="cart-remove-btn"
                  >
                    <Trash2 size={11} /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="cart-summary-col">
          <div className="cart-summary">
            <h2 className="cart-summary-title">Summary</h2>

            <div className="cart-summary-rows">
              <div className="cart-summary-row">
                <span>Selected Items</span>
                <span className="value">{selectedItemsCount}</span>
              </div>
              <div className="cart-summary-divider" />
              <div className="cart-summary-total">
                <span className="label">Subtotal</span>
                <span className="amount">৳{subtotal.toLocaleString()}</span>
              </div>
            </div>

            <p className="cart-summary-note">
              Shipping & discounts calculated at checkout
            </p>

            <button
              onClick={() => navigate('/checkout')}
              disabled={selectedItemsCount === 0}
              className="cart-checkout-btn"
            >
              Checkout Now <ArrowRight size={16} />
            </button>

            <button
              onClick={() => navigate('/shop')}
              className="cart-continue-btn"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
