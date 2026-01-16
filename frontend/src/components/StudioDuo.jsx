import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Gauge, ChartBar, ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductList.css';
import './StudioDuo.css';

// Toast Notification Component (Same as ProductList)
const Toast = ({ message, isVisible, onHide }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onHide();
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onHide]);

    return (
        <div className={`cart-toast ${isVisible ? 'cart-toast--visible' : ''}`}>
            <div className="cart-toast__icon">
                <Check size={18} strokeWidth={3} />
            </div>
            <span className="cart-toast__message">{message}</span>
        </div>
    );
};

// Rectangular CartButton Component with Quantity Stepper (Same as Collections)
const DuoCartButton = ({ product, onFirstAdd }) => {
    const { addToCart, getItemQuantity, updateQuantity, cart } = useCart();
    const quantity = getItemQuantity(product.id);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        const wasZero = quantity === 0;

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image_url_full || product.image,
            image_url_full: product.image_url_full,
            type: 'product'
        });

        if (wasZero) {
            onFirstAdd(product.name);
        }
    };

    const handleIncrement = (e) => {
        e.stopPropagation();
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image_url_full || product.image,
            image_url_full: product.image_url_full,
            type: 'product'
        });
    };

    const handleDecrement = (e) => {
        e.stopPropagation();
        const cartItem = cart.find(item => item.id === product.id);
        if (cartItem) {
            updateQuantity(cartItem.cartKey, quantity - 1);
        }
    };

    // Render rectangular quantity stepper if item is in cart
    if (quantity > 0) {
        return (
            <div className="cart-stepper" onClick={(e) => e.stopPropagation()}>
                <button
                    className="cart-stepper__btn cart-stepper__btn--minus"
                    onClick={handleDecrement}
                    aria-label="Decrease quantity"
                >
                    <Minus size={16} strokeWidth={2.5} />
                </button>
                <span className="cart-stepper__qty">{quantity}</span>
                <button
                    className="cart-stepper__btn cart-stepper__btn--plus"
                    onClick={handleIncrement}
                    aria-label="Increase quantity"
                >
                    <Plus size={16} strokeWidth={2.5} />
                </button>
            </div>
        );
    }

    // Render rectangular Add to Cart button
    return (
        <button
            className="duo-cart-btn"
            onClick={handleAddToCart}
            title="Add to Cart"
        >
            <ShoppingCart size={16} strokeWidth={2.5} />
            <span>Add</span>
        </button>
    );
};

export default function StudioDuo() {
    const navigate = useNavigate();
    const [data, setData] = useState({ products: [], workshops: [] });
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/api/duo/');
                setData(res.data);
            } catch (err) {
                console.error("Failed to load Duo content", err);
            }
        };
        fetchData();
    }, []);

    const handleFirstAdd = useCallback((productName) => {
        setToastMessage(`${productName} added to cart`);
        setToastVisible(true);
    }, []);

    const hideToast = useCallback(() => {
        setToastVisible(false);
    }, []);

    const handleProductClick = (p) => navigate('/products');
    const handleWorkshopClick = (w) => navigate('/workshops');

    return (
        <>
            {/* Toast Notification */}
            <Toast
                message={toastMessage}
                isVisible={toastVisible}
                onHide={hideToast}
            />

            <section className="studio-duo-section">
                {/* Kintsaku Crackle Background SVG */}
                <div className="duo-svg-bg">
                    <svg
                        viewBox="0 0 800 600"
                        xmlns="http://www.w3.org/2000/svg"
                        className="kintsaku-svg"
                        preserveAspectRatio="xMidYMid slice"
                    >
                        {/* Organic crack lines mimicking kintsugi repair */}
                        <path
                            className="kintsaku-line"
                            d="M0,150 Q100,120 200,180 T350,140 Q450,200 550,160 T700,190 L800,170"
                        />
                        <path
                            className="kintsaku-line"
                            d="M50,300 Q150,250 250,320 T400,280 Q500,340 600,290 T750,330 L800,310"
                        />
                        <path
                            className="kintsaku-line"
                            d="M0,450 Q120,400 220,480 T380,420 Q480,500 580,440 T720,490 L800,460"
                        />
                        <path
                            className="kintsaku-line"
                            d="M100,80 Q180,120 260,60 T400,100 Q500,40 600,90 T800,50"
                        />
                        <path
                            className="kintsaku-line"
                            d="M0,550 Q100,520 200,580 T350,530 Q480,590 600,540 T800,570"
                        />
                        {/* Secondary fracture lines */}
                        <path
                            className="kintsaku-line"
                            d="M200,180 Q220,220 200,280"
                            style={{ animationDelay: '3s' }}
                        />
                        <path
                            className="kintsaku-line"
                            d="M400,280 Q420,320 400,380"
                            style={{ animationDelay: '5s' }}
                        />
                        <path
                            className="kintsaku-line"
                            d="M600,160 Q620,200 600,260"
                            style={{ animationDelay: '7s' }}
                        />
                    </svg>
                </div>

                <div className="duo-container">
                    {/* Left Column: Products */}
                    <div className="duo-column">
                        <div className="duo-card-wrapper">
                            <h3 className="duo-heading-inner">PRODUCTS</h3>
                            <div className="duo-items-row">
                                {(data?.products || []).slice(0, 2).map(product => (
                                    <div
                                        key={product.id}
                                        className="duo-product-card"
                                        onClick={() => handleProductClick(product)}
                                    >
                                        <div className="duo-product-image">
                                            <img
                                                src={product.image_url_full || '/static/images/products/placeholder.svg'}
                                                alt={product.name}
                                                className="duo-product-img"
                                            />
                                            {product.is_bestseller && <span className="duo-product-badge">Bestseller</span>}
                                            {product.is_featured && !product.is_bestseller && <span className="duo-product-badge">Featured</span>}
                                        </div>
                                        <div className="duo-product-info">
                                            <h3 className="duo-product-name">{product.name}</h3>
                                            <p className="duo-product-description">{product.short_description}</p>
                                            <div className="duo-product-footer">
                                                <span className="duo-product-price">₹{Number(product.price).toLocaleString('en-IN')}</span>
                                                <DuoCartButton product={product} onFirstAdd={handleFirstAdd} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="duo-cta" onClick={() => navigate('/products')}>Shop Now</button>
                        </div>
                    </div>

                    {/* Right Column: Workshops */}
                    <div className="duo-column">
                        <div className="duo-card-wrapper">
                            <h3 className="duo-heading-inner">WORKSHOPS</h3>
                            <div className="duo-items-row">
                                {(data?.workshops || []).slice(0, 2).map(workshop => (
                                    <div
                                        key={workshop.id}
                                        className="duo-workshop-card"
                                        onClick={() => handleWorkshopClick(workshop)}
                                        style={{
                                            backgroundImage: workshop.image_url ? `url(${workshop.image_url})` : 'none'
                                        }}
                                    >
                                        <div className="duo-workshop-overlay"></div>
                                        {workshop.is_featured && <span className="duo-workshop-badge featured">Featured</span>}
                                        {workshop.is_popular && <span className="duo-workshop-badge popular">Popular</span>}

                                        <div className="duo-workshop-content">
                                            <h3>{workshop.name}</h3>
                                            <p className="duo-workshop-type">{workshop.workshop_type_display}</p>
                                            <div className="duo-workshop-meta">
                                                <span>
                                                    <Gauge size={14} /> {workshop.duration_hours}h
                                                </span>
                                                <span>
                                                    <ChartBar size={14} /> {workshop.difficulty_level_display}
                                                </span>
                                            </div>
                                            <span className="duo-workshop-price">₹{Number(workshop.price).toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="duo-cta" onClick={() => navigate('/workshops')}>Book Now</button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
