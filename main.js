// Initialize Lucide Icons
lucide.createIcons();

// Product Data
const products = [
  {
    id: 1,
    name: 'Crunchy Plantain Chip',
    category: 'snacks',
    price: 500,
    image: 'images/plantainchip.jpeg',
    description: 'Crispy, salty, and delicious plantain chips.'
  },
  {
    id: 2,
    name: 'Peanut & Chinchin Pack',
    category: 'snacks',
    price: 200,
    image: 'images/peanut-chinchin.jpeg',
    description: 'A perfect mix of roasted peanuts and crunchy chinchin.'
  },
  {
    id: 3,
    name: 'Fluffy Doughnuts',
    category: 'bakery',
    price: 500,
    image: 'images/donut.jpeg',
    description: 'Soft, airy doughnuts with a sweet glaze.'
  },
  {
    id: 4,
    name: 'Golden Egg Roll',
    category: 'pastries',
    price: 800,
    image: 'images/eggroll.jpeg',
    description: 'Classic eggroll encased in delicious pastry.'
  },
  {
    id: 5,
    name: 'Savory Fish Roll',
    category: 'pastries',
    price: 500,
    image: 'images/fishroll.jpeg',
    description: 'Flaky pastry with a savory fish filling.'
  },
  {
    id: 6,
    name: 'Buttery Shortbread',
    category: 'bakery',
    price: 500,
    image: 'images/shortbread.jpeg',
    description: 'Rich, melt-in-your-mouth shortbread biscuits.'
  },
  {
    id: 7,
    name: 'Gourmet Snack Mix',
    category: 'snacks',
    price: 5000,
    image: 'images/snack.jpeg',
    description: 'The ultimate selection of Egosy treats.'
  }
];

// State Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const themes = { light: 'light', dark: 'dark' };
let currentTheme = themes.light;

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartCountElements = document.querySelectorAll('.cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const subtotalElement = document.getElementById('subtotal');
const loginModal = document.getElementById('login-modal');
const cartModal = document.getElementById('cart-modal');
const header = document.getElementById('header');

// Functions
function renderProducts(filter = 'all') {
  productGrid.innerHTML = '';
  const filteredProducts = filter === 'all' ? products : products.filter(p => p.category === filter);
  
  filteredProducts.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-img">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-badge">${product.category}</span>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-footer">
          <span class="price">₦${product.price.toLocaleString()}</span>
          <button class="add-btn" onclick="addToCart(${product.id})">
            <i data-lucide="plus"></i>
          </button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });
  lucide.createIcons();
}

window.addToCart = function(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  updateCart();
  showCart();
};

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}

function updateQuantity(productId, delta) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCart();
    }
  }
}

function updateCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update counts
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElements.forEach(el => el.textContent = totalItems);
  
  // Render cart items
  cartItemsContainer.innerHTML = cart.length === 0 ? '<p>Your cart is empty</p>' : '';
  
  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.quantity;
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-header">
          <h4>${item.name}</h4>
          <button onclick="removeFromCart(${item.id})"><i data-lucide="x" style="width:16px;"></i></button>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
          <span style="margin-left:auto; font-weight:700;">₦${(item.price * item.quantity).toLocaleString()}</span>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(itemEl);
  });
  
  subtotalElement.textContent = `₦${subtotal.toLocaleString()}`;
  lucide.createIcons();
}

// Modal Toggle Functions
function showCart() { cartModal.classList.add('active'); }
function hideCart() { cartModal.classList.remove('active'); }
function showLogin() { loginModal.classList.add('active'); }
function hideLogin() { loginModal.classList.remove('active'); }

// Event Listeners
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.onclick = () => {
    hideCart();
    hideLogin();
  };
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.onclick = (e) => {
    if (e.target === overlay) {
      hideCart();
      hideLogin();
    }
  };
});

document.getElementById('cart-btn').onclick = showCart;
document.getElementById('login-trigger').onclick = showLogin;

// Filtering
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    btn.classList.add('active');
    renderProducts(btn.dataset.filter);
  };
});

// Scroll Effects
window.onscroll = () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};

// Form Handlers
document.getElementById('login-form').onsubmit = (e) => {
  e.preventDefault();
  alert('Login successful! Welcome back to Egosy Treat.');
  hideLogin();
};

document.querySelector('.contact-form').onsubmit = (e) => {
  e.preventDefault();
  alert('Message sent! We will contact you soon via email or WhatsApp.');
  e.target.reset();
};

document.getElementById('checkout-btn').onclick = () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  const whatsappUrl = `https://wa.me/2348124551723?text=I'd like to place an order from Egosy Treat: ${cart.map(i => `${i.name} (x${i.quantity})`).join(', ')}`;
  window.open(whatsappUrl, '_blank');
};

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCart();
});

// Expose functions for onclick
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
