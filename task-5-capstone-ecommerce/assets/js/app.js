/**
 * PrimeTech E-Commerce Storefront - Single Page Application Engine
 * Integrates an immutable State manager, a Hash Router, and an interactive Cart structure.
 */

// Global Immutable-Style State Model
let state = {
    products: [
        { id: 1, name: "Alpha Audio Headset", category: "Audio", price: 89.99, description: "Professional wireless over-ear noise-cancelling headphones.", icon: "🎧" },
        { id: 2, name: "Mechanical Tactile Keyboard", category: "Accessories", price: 129.50, description: "Compact hot-swappable keyboard with linear visual switches.", icon: "⌨️" },
        { id: 3, name: "Vanguard Smart Sportwatch", category: "Wearables", price: 159.00, description: "Advanced fitness tracking with GPS coordinate maps.", icon: "⌚" },
        { id: 4, name: "Precision Laser Gaming Mouse", category: "Accessories", price: 59.99, description: "Ultra-lightweight mouse with high-polling telemetry configurations.", icon: "🖱️" },
        { id: 5, name: "Dynamic Soundwave Soundbar", category: "Audio", price: 199.99, description: "Deep bass room-filling acoustic dynamic speaker configurations.", icon: "🔊" },
        { id: 6, name: "Pro-Display Ultra-Wide Panel", category: "Displays", price: 449.00, description: "High-refresh-rate curved monitor designed for immersion.", icon: "🖥️" }
    ],
    cart: [], // Elements: { id, name, price, quantity, icon }
    activeFilter: 'all',
    searchQuery: ''
};

document.addEventListener('DOMContentLoaded', () => {
    // DOM Mounting Node Target
    const appView = document.getElementById('app-view');
    const cartBadge = document.getElementById('cart-badge');

    // Load initial cart state from persistence layers
    initCart();

    // STEP 1: Routing Engine Configuration
    const routes = {
        '#home': renderHome,
        '#catalog': renderCatalog,
        '#cart': renderCart
    };

    window.addEventListener('hashchange', router);
    window.addEventListener('load', router);

    function router() {
        const currentHash = window.location.hash || '#home';
        const renderView = routes[currentHash] || renderHome;

        // Synchronize top nav active states
        updateNavigationState(currentHash);

        // Execute view renderer
        renderView();
    }

    /**
     * Toggles CSS classes in navigation headers to reflect state location
     * @param {string} hash - Target anchor link
     */
    function updateNavigationState(hash) {
        const navHome = document.getElementById('nav-home');
        const navCatalog = document.getElementById('nav-catalog');
        const navCart = document.getElementById('nav-cart');

        navHome.classList.remove('active');
        navCatalog.classList.remove('active');
        navCart.classList.remove('active');

        if (hash === '#home') navHome.classList.add('active');
        if (hash === '#catalog') navCatalog.classList.add('active');
        if (hash === '#cart') navCart.classList.add('active');
    }

    // STEP 2: View Templates Compilation

    function renderHome() {
        appView.innerHTML = `
            <div class="hero-view">
                <h1>Next-Gen Engineering Accessories</h1>
                <p>Welcome to PrimeTech. Explore our curated ecosystem of high-grade developer workspace devices.</p>
                <a href="#catalog" class="btn btn-primary" aria-label="Go to Catalog View">Shop the Catalog</a>
            </div>
        `;
    }

    function renderCatalog() {
        appView.innerHTML = `
            <div class="catalog-header">
                <h1 class="section-title">Product Catalog</h1>
                
                <div class="search-filter-row">
                    <div class="search-input-wrapper">
                        <label for="search-bar" class="visually-hidden">Search Products</label>
                        <input 
                            type="text" 
                            id="search-bar" 
                            placeholder="Search workspace gear..." 
                            value="${state.searchQuery}"
                            autocomplete="off"
                        >
                    </div>
                    
                    <div class="filter-group" role="tablist" aria-label="Filter products by category">
                        <button class="filter-pill ${state.activeFilter === 'all' ? 'active' : ''}" data-filter="all" role="tab">All Category</button>
                        <button class="filter-pill ${state.activeFilter === 'Audio' ? 'active' : ''}" data-filter="Audio" role="tab">Audio</button>
                        <button class="filter-pill ${state.activeFilter === 'Accessories' ? 'active' : ''}" data-filter="Accessories" role="tab">Accessories</button>
                        <button class="filter-pill ${state.activeFilter === 'Wearables' ? 'active' : ''}" data-filter="Wearables" role="tab">Wearables</button>
                        <button class="filter-pill ${state.activeFilter === 'Displays' ? 'active' : ''}" data-filter="Displays" role="tab">Displays</button>
                    </div>
                </div>
            </div>

            <div id="catalog-products" class="product-grid">
                <!-- Javascript will dynamically paint filtered products here -->
            </div>
        `;

        // Attach listeners directly to search inputs
        const searchBar = document.getElementById('search-bar');
        searchBar.addEventListener('input', (e) => {
            state.searchQuery = e.target.value.toLowerCase();
            renderCatalogItems();
        });

        // Attach listeners directly to category filters
        const filterGroup = document.querySelector('.filter-group');
        filterGroup.addEventListener('click', (e) => {
            const targetPill = e.target.closest('.filter-pill');
            if (!targetPill) return;

            filterGroup.querySelectorAll('.filter-pill').forEach(pill => pill.classList.remove('active'));
            targetPill.classList.add('active');

            state.activeFilter = targetPill.dataset.filter;
            renderCatalogItems();
        });

        // Initialize display list
        renderCatalogItems();
    }

    function renderCatalogItems() {
        const productsGrid = document.getElementById('catalog-products');
        if (!productsGrid) return;

        // Apply filters & search queries using array manipulation pipelines
        const displayItems = state.products.filter(product => {
            const matchCategory = state.activeFilter === 'all' || product.category === state.activeFilter;
            const matchSearch = product.name.toLowerCase().includes(state.searchQuery) || 
                                product.description.toLowerCase().includes(state.searchQuery);
            return matchCategory && matchSearch;
        });

        if (displayItems.length === 0) {
            productsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;" class="card">
                    <p style="color: var(--text-muted);">No products match your search query filters.</p>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = displayItems.map(product => `
            <article class="card product-card">
                <div>
                    <div class="product-thumbnail-wrapper" aria-hidden="true">${product.icon}</div>
                    <h3>${product.name}</h3>
                    <p class="product-desc">${product.description}</p>
                </div>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})" aria-label="Add ${product.name} to cart">Add to Cart</button>
                </div>
            </article>
        `).join('');
    }

    function renderCart() {
        if (state.cart.length === 0) {
            appView.innerHTML = `
                <div class="empty-cart-state">
                    <span class="empty-cart-graphic" aria-hidden="true">🛒</span>
                    <h2>Your shopping cart is empty</h2>
                    <p style="margin: 0.5rem 0 2rem 0;">Browse our catalog and select professional developer gear to populate this space.</p>
                    <a href="#catalog" class="btn btn-primary">Go to Catalog</a>
                </div>
            `;
            return;
        }

        const subtotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shippingFee = subtotal > 150 ? 0 : 15.00;
        const netTotal = subtotal + shippingFee;

        appView.innerHTML = `
            <h1 class="section-title">Your Shopping Bag</h1>
            
            <div class="cart-layout">
                <!-- Left panel: item lists -->
                <section class="cart-items-panel" aria-label="Item list">
                    ${state.cart.map(item => `
                        <div class="cart-item">
                            <span style="font-size: 2rem; margin-right: 0.5rem;" aria-hidden="true">${item.icon}</span>
                            <div class="cart-item-info">
                                <h3 class="cart-item-title">${item.name}</h3>
                                <p class="cart-item-price">$${item.price.toFixed(2)} each</p>
                            </div>
                            
                            <!-- Quantity Manipulation Controls -->
                            <div class="quantity-controls">
                                <button class="qty-btn" onclick="updateQty(${item.id}, -1)" aria-label="Decrease quantity for ${item.name}">-</button>
                                <span class="qty-val" aria-live="polite">${item.quantity}</span>
                                <button class="qty-btn" onclick="updateQty(${item.id}, 1)" aria-label="Increase quantity for ${item.name}">+</button>
                            </div>

                            <button class="remove-btn" onclick="removeItem(${item.id})" aria-label="Remove ${item.name} from cart">Remove</button>
                        </div>
                    `).join('')}
                </section>

                <!-- Right panel: checkout metrics -->
                <aside class="checkout-panel" aria-label="Checkout Summary">
                    <h3>Checkout Order Summary</h3>
                    <div class="checkout-row">
                        <span>Items Subtotal</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="checkout-row">
                        <span>Delivery Fee</span>
                        <span>${shippingFee === 0 ? "Free Shipping" : `$${shippingFee.toFixed(2)}`}</span>
                    </div>
                    
                    <div class="checkout-total">
                        <span>Total Due</span>
                        <span>$${netTotal.toFixed(2)}</span>
                    </div>

                    <button class="btn btn-success btn-checkout" onclick="executeCheckout()" aria-label="Proceed to payment processing">Place Order</button>
                </aside>
            </div>
        `;
    }

    // STEP 3: Immutable State Cart Engine Operations

    /**
     * Initializes and parses cart data from local storage
     */
    function initCart() {
        const storedCart = localStorage.getItem('state_cart');
        if (storedCart) {
            try {
                state.cart = JSON.parse(storedCart);
                syncCartCounter();
            } catch (err) {
                console.error("Cart retrieval corrupted. Flushed.", err);
                state.cart = [];
            }
        }
    }

    /**
     * Immutable push action appending new item mappings
     * @param {number} id - Target product ID to add
     */
    window.addToCart = function(id) {
        const product = state.products.find(p => p.id === id);
        if (!product) return;

        const cartItemIdx = state.cart.findIndex(item => item.id === id);

        if (cartItemIdx > -1) {
            // Update quantity utilizing immutable array mapping transformations
            state.cart = state.cart.map((item, idx) => {
                if (idx === cartItemIdx) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });
        } else {
            // Create a completely new object mapping and append using spread structure
            state.cart = [...state.cart, { ...product, quantity: 1 }];
        }

        saveCartAndSync();
        alert(`${product.name} added to shopping bag.`);
    };

    /**
     * Immutable quantity mapping operations
     * @param {number} id - Target product ID
     * @param {number} delta - Operational offset (+1 or -1)
     */
    window.updateQty = function(id, delta) {
        state.cart = state.cart.map(item => {
            if (item.id === id) {
                const targetQty = item.quantity + delta;
                return { ...item, quantity: targetQty };
            }
            return item;
        }).filter(item => item.quantity > 0); // Drop items if count drops below 1

        saveCartAndSync();
        renderCart();
    };

    /**
     * Immutable item removal mapping operations
     * @param {number} id - Target product ID to clear
     */
    window.removeItem = function(id) {
        state.cart = state.cart.filter(item => item.id !== id);
        saveCartAndSync();
        renderCart();
    };

    /**
     * Flushes and processes final mock checkout conversions
     */
    window.executeCheckout = function() {
        alert("Success! Your simulated order transaction was processed successfully. Thank you!");
        state.cart = []; // Flush local state array
        saveCartAndSync();
        window.location.hash = '#home'; // Route user back to landing page
    };

    function saveCartAndSync() {
        localStorage.setItem('state_cart', JSON.stringify(state.cart));
        syncCartCounter();
    }

    function syncCartCounter() {
        const totalItems = state.cart.reduce((count, item) => count + item.quantity, 0);
        cartBadge.textContent = totalItems;
    }
});