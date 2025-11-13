// API Configuration
const API_BASE_URL = 'http://localhost:8080';
const BOOKS_API = `${API_BASE_URL}/books`;
const ORDERS_API = `${API_BASE_URL}/api/orders`;

// State Management
const state = {
  books: [],
  cart: JSON.parse(localStorage.getItem('cart')) || [],
  wishlist: JSON.parse(localStorage.getItem('wishlist')) || [],
  filteredBooks: [],
  currentMood: 'calm',
  darkMode: localStorage.getItem('darkMode') === 'true',
};

// DOM Elements
const app = document.getElementById('app');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
const darkModeToggle = document.getElementById('darkModeToggle');
const moodSelector = document.getElementById('moodSelector');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const featuredBooksSection = document.querySelector('.featured-books');
const cartSidebar = document.getElementById('cart-sidebar');
const cartCloseBtn = document.getElementById('cart-close-btn');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartSubtotal = document.getElementById('cart-subtotal');
const checkoutBtn = document.getElementById('checkout-btn');
const wishlistModal = document.getElementById('wishlist-modal');
const wishlistCloseBtn = document.getElementById('wishlist-close-btn');
const wishlistItems = document.getElementById('wishlist-items');
const dynamicHeroText = document.getElementById('dynamic-hero-text');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initializeDarkMode();
  loadBooks();
  setupEventListeners();
  rotateHeroText();
  updateCartUI();
  updateWishlistUI();
});

// Dark Mode
function initializeDarkMode() {
  if (state.darkMode) {
    app.classList.add('dark-theme');
    app.classList.remove('light-theme');
    darkModeToggle.checked = true;
  } else {
    app.classList.add('light-theme');
    app.classList.remove('dark-theme');
    darkModeToggle.checked = false;
  }
}

darkModeToggle.addEventListener('change', () => {
  state.darkMode = !state.darkMode;
  localStorage.setItem('darkMode', state.darkMode);
  initializeDarkMode();
});

// Event Listeners
function setupEventListeners() {
  hamburger.addEventListener('click', toggleMobileMenu);
  moodSelector.addEventListener('change', changeMood);
  searchBtn.addEventListener('click', handleSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', handleFilter);
  });
  cartCloseBtn.addEventListener('click', () => cartSidebar.classList.remove('open'));
  wishlistCloseBtn.addEventListener('click', () => wishlistModal.classList.remove('open'));
  wishlistModal.addEventListener('click', (e) => {
    if (e.target === wishlistModal) wishlistModal.classList.remove('open');
  });
}

// Mobile Menu
function toggleMobileMenu() {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
}

// Load Books from Backend
async function loadBooks() {
  try {
    const response = await fetch(`${BOOKS_API}?page=1&size=100`);
    if (!response.ok) throw new Error('Failed to load books');
    state.books = await response.json();
    state.filteredBooks = state.books;
    renderBooks(state.filteredBooks);
  } catch (error) {
    console.error('Error loading books:', error);
    featuredBooksSection.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; color: red;">Failed to load books. Please ensure the backend is running on http://localhost:8080</p>';
  }
}

// Reading Mood Selector
function changeMood() {
  state.currentMood = moodSelector.value;
  const moodColors = {
    calm: '--primary-color: #6366f1; --secondary-color: #ec4899;',
    focus: '--primary-color: #3b82f6; --secondary-color: #f59e0b;',
    adventure: '--primary-color: #ec4899; --secondary-color: #f59e0b;',
  };
  document.documentElement.style.cssText = moodColors[state.currentMood];
}

// Hero Text Rotation
function rotateHeroText() {
  const heroTexts = [
    'Find your next story',
    'Read more, dream more',
    'Books that change you',
    'Discover new worlds',
    'Escape into a book',
  ];
  let index = 0;
  setInterval(() => {
    dynamicHeroText.style.opacity = '0';
    setTimeout(() => {
      dynamicHeroText.textContent = heroTexts[index % heroTexts.length];
      dynamicHeroText.style.opacity = '1';
      index++;
    }, 300);
  }, 4000);
}

// Search Functionality
function handleSearch() {
  const query = searchInput.value.toLowerCase().trim();
  if (!query) {
    state.filteredBooks = state.books;
  } else {
    state.filteredBooks = state.books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
  }
  renderBooks(state.filteredBooks);
}

// Filter Functionality
function handleFilter(e) {
  const category = e.target.dataset.category;
  filterBtns.forEach((btn) => btn.classList.remove('active'));
  e.target.classList.add('active');

  if (category === 'all') {
    state.filteredBooks = state.books;
  } else {
    state.filteredBooks = state.books.filter(
      (book) => book.category === category
    );
  }
  renderBooks(state.filteredBooks);
}

// Render Books
function renderBooks(books) {
  if (!books || books.length === 0) {
    featuredBooksSection.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center;">No books found</p>';
    return;
  }

  featuredBooksSection.innerHTML = books
    .map(
      (book) => `
    <div class="book-card" data-id="${book.id}">
      <div style="position: relative;">
        <img src="${book.imageUrl || 'https://via.placeholder.com/220x300?text=' + encodeURIComponent(book.title)}" 
             alt="${book.title}" class="book-image" />
        <div class="book-tooltip">
          ${book.title} • Avg read time: 4-6 hours
        </div>
      </div>
      <div class="book-info">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">by ${book.author}</p>
        <div class="book-rating">
          ⭐ ${book.rating} / 5
        </div>
        <p class="book-price">₹${book.price.toFixed(2)}</p>
        <div class="book-actions">
          <button class="btn btn-add-cart" onclick="addToCart(${book.id})">Add to Cart</button>
          <button class="btn btn-wishlist ${
            state.wishlist.some((item) => item.id === book.id) ? 'active' : ''
          }" onclick="toggleWishlist(${book.id})">❤️</button>
        </div>
      </div>
    </div>
  `
    )
    .join('');
}

// Cart Functions
function addToCart(bookId) {
  const book = state.books.find((b) => b.id === bookId);
  if (!book) return;

  const existingItem = state.cart.find((item) => item.id === bookId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({ ...book, quantity: 1 });
  }

  saveCart();
  updateCartUI();
  animateAddToCart(bookId);
  showCartNotification();
}

function animateAddToCart(bookId) {
  const bookCard = document.querySelector(`[data-id="${bookId}"]`);
  if (!bookCard) return;

  const bookImage = bookCard.querySelector('.book-image');
  const cartIcon = document.querySelector('.nav-link');
  const rect1 = bookImage.getBoundingClientRect();
  const rect2 = cartIcon.getBoundingClientRect();

  const flyingImage = bookImage.cloneNode(true);
  flyingImage.style.position = 'fixed';
  flyingImage.style.left = rect1.left + 'px';
  flyingImage.style.top = rect1.top + 'px';
  flyingImage.style.width = rect1.width + 'px';
  flyingImage.style.height = rect1.height + 'px';
  flyingImage.style.zIndex = '9999';
  flyingImage.style.pointerEvents = 'none';
  document.body.appendChild(flyingImage);

  setTimeout(() => {
    flyingImage.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    flyingImage.style.left = rect2.left + 'px';
    flyingImage.style.top = rect2.top + 'px';
    flyingImage.style.width = '30px';
    flyingImage.style.height = '30px';
    flyingImage.style.opacity = '0';
  }, 10);

  setTimeout(() => document.body.removeChild(flyingImage), 800);
}

function showCartNotification() {
  const notification = document.createElement('div');
  notification.textContent = '✅ Added to cart!';
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    z-index: 10000;
    animation: slideIn 0.3s ease, slideOut 0.3s ease 2.7s forwards;
  `;
  document.body.appendChild(notification);
  setTimeout(() => document.body.removeChild(notification), 3000);
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(state.cart));
}

function updateCartUI() {
  cartCount.textContent = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartSubtotal.textContent = subtotal.toFixed(2);

  cartItems.innerHTML =
    state.cart.length === 0
      ? '<p style="text-align: center; padding: 2rem;">Your cart is empty</p>'
      : state.cart
          .map(
            (item) => `
        <div class="cart-item">
          <img src="${item.imageUrl || 'https://via.placeholder.com/60x80'}" 
               alt="${item.title}" class="cart-item-image" />
          <div class="cart-item-details">
            <p class="cart-item-title">${item.title}</p>
            <p class="cart-item-price">₹${item.price.toFixed(2)} x ${item.quantity}</p>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart(${item.id})">🗑️</button>
        </div>
      `
          )
          .join('');
}

function removeFromCart(bookId) {
  state.cart = state.cart.filter((item) => item.id !== bookId);
  saveCart();
  updateCartUI();
}

function showCart() {
  cartSidebar.classList.add('open');
}

// Wishlist Functions
function toggleWishlist(bookId) {
  const book = state.books.find((b) => b.id === bookId);
  if (!book) return;

  const existingItem = state.wishlist.find((item) => item.id === bookId);
  if (existingItem) {
    state.wishlist = state.wishlist.filter((item) => item.id !== bookId);
  } else {
    state.wishlist.push(book);
  }

  saveWishlist();
  updateWishlistUI();
  renderBooks(state.filteredBooks);
}

function saveWishlist() {
  localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
}

function updateWishlistUI() {
  wishlistItems.innerHTML =
    state.wishlist.length === 0
      ? '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">Your wishlist is empty</p>'
      : state.wishlist
          .map(
            (item) => `
        <div class="wishlist-item">
          <img src="${item.imageUrl || 'https://via.placeholder.com/150x200'}" 
               alt="${item.title}" class="wishlist-item-image" />
          <div class="wishlist-item-info">
            <p class="wishlist-item-title">${item.title}</p>
            <p class="wishlist-item-price">₹${item.price.toFixed(2)}</p>
            <button class="wishlist-remove" onclick="toggleWishlist(${item.id})">Remove</button>
          </div>
        </div>
      `
          )
          .join('');
}

function showWishlist() {
  wishlistModal.classList.add('open');
}

// Checkout
checkoutBtn.addEventListener('click', async () => {
  if (state.cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  const totalAmount = state.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  try {
    const response = await fetch(`${ORDERS_API}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        totalAmount: totalAmount,
        items: state.cart,
      }),
    });

    if (!response.ok) throw new Error('Failed to create order');
    const order = await response.json();

    alert(`✅ Order created successfully!\nOrder ID: ${order.orderId}\nAmount: ₹${totalAmount.toFixed(2)}`);

    state.cart = [];
    saveCart();
    updateCartUI();
    cartSidebar.classList.remove('open');
  } catch (error) {
    console.error('Checkout error:', error);
    alert('❌ Failed to create order. Please try again.');
  }
});

// Navigation Links
document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');

    if (href === '#cart') {
      e.preventDefault();
      showCart();
    } else if (href === '#wishlist') {
      e.preventDefault();
      showWishlist();
    } else if (href === '#books') {
      e.preventDefault();
      document.querySelector('.featured-books').scrollIntoView({ behavior: 'smooth' });
    }

    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

// Scroll Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeIn 0.6s ease forwards';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(20px); }
  }
`;
document.head.appendChild(style);

