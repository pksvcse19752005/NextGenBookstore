const BACKEND_URL = 'https://nextgenbookstore-1.onrender.com/api';
const cartCount = document.getElementById('cart-count');
const booksContainer = document.getElementById('books');
const cartItemsContainer = document.getElementById('cart-items');
const totalAmountElem = document.getElementById('total-amount');
const checkoutBtn = document.getElementById('checkout-button');
let cart = [];

// Sample books data (since you don't have a /books endpoint yet)
const sampleBooks = [
  { id: 1, title: "Java Programming", author: "John Doe", price: 299, imageUrl: "https://via.placeholder.com/200x250?text=Java" },
  { id: 2, title: "Spring Boot Guide", author: "Jane Smith", price: 399, imageUrl: "https://via.placeholder.com/200x250?text=SpringBoot" },
  { id: 3, title: "REST API Design", author: "Mike Johnson", price: 349, imageUrl: "https://via.placeholder.com/200x250?text=REST" },
  { id: 4, title: "Web Development", author: "Sarah Lee", price: 279, imageUrl: "https://via.placeholder.com/200x250?text=Web" },
  { id: 5, title: "Database Design", author: "Tom Wilson", price: 329, imageUrl: "https://via.placeholder.com/200x250?text=Database" },
  { id: 6, title: "Cloud Computing", author: "Lisa Anderson", price: 449, imageUrl: "https://via.placeholder.com/200x250?text=Cloud" }
];

function updateCartUI() {
  cartCount.textContent = cart.length;
  cartItemsContainer.innerHTML = '';
  let total = 0;
  cart.forEach((book, index) => {
    total += book.price;
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${book.title} - ₹${book.price}</span>
      <button onclick="removeFromCart(${index})" style="background: #dc3545; border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Remove</button>
    `;
    cartItemsContainer.appendChild(li);
  });
  totalAmountElem.textContent = total.toFixed(2);
  checkoutBtn.disabled = cart.length === 0;
}

function loadBooks() {
  booksContainer.innerHTML = '';
  sampleBooks.forEach(book => {
    const div = document.createElement('div');
    div.className = 'book';
    div.innerHTML = `
      <img src="${book.imageUrl}" alt="${book.title}" />
      <h3>${book.title}</h3>
      <p><strong>${book.author}</strong></p>
      <p>₹${book.price}</p>
      <button onclick="addToCart(${book.id}, '${book.title}', ${book.price})">Add to Cart</button>
    `;
    booksContainer.appendChild(div);
  });
}

function addToCart(id, title, price) {
  cart.push({ id, title, price });
  updateCartUI();
  alert(`${title} added to cart!`);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

async function createOrder(amount) {
  const orderData = {
    totalAmount: amount
  };
  const response = await fetch(`${BACKEND_URL}/orders/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  return response.json();
}

function openRazorpay(order) {
  const options = {
    key: 'rzp_test_YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay test key
    amount: order.amount * 100,
    currency: 'INR',
    name: 'NextGen Bookstore',
    description: 'Book Purchase',
    order_id: order.orderId,
    handler: async function (response) {
      await verifyPayment(order.orderId, response.razorpay_payment_id);
      alert('Payment successful! Order ID: ' + order.orderId);
      cart = [];
      updateCartUI();
    },
    prefill: {
      name: 'Demo User',
      email: 'demo@example.com',
      contact: '9999999999'
    },
    theme: { color: '#007bff' }
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
}

async function verifyPayment(orderId, paymentId) {
  try {
    const response = await fetch(`${BACKEND_URL}/orders/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: orderId, razorpayPaymentId: paymentId })
    });
    return response.json();
  } catch (error) {
    console.error('Payment verification error:', error);
  }
}

checkoutBtn.addEventListener('click', async () => {
  const total = parseFloat(totalAmountElem.textContent);
  if (total > 0) {
    try {
      const order = await createOrder(total);
      if (order.orderId) {
        openRazorpay(order);
      } else {
        alert('Failed to create order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed!');
    }
  }
});

// Initialize
loadBooks();
updateCartUI();

updateCartUI();
