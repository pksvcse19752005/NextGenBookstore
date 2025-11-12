const booksUrl = 'http://localhost:8080/books';
const cartCount = document.getElementById('cart-count');
const booksContainer = document.getElementById('books');
const cartItemsContainer = document.getElementById('cart-items');
const totalAmountElem = document.getElementById('total-amount');
const checkoutBtn = document.getElementById('checkout-button');
let cart = [];

function updateCartUI() {
  cartCount.textContent = cart.length;
  cartItemsContainer.innerHTML = '';
  let total = 0;
  cart.forEach(book => {
    total += book.price;
    const li = document.createElement('li');
    li.textContent = `${book.title} - ₹${book.price}`;
    cartItemsContainer.appendChild(li);
  });
  totalAmountElem.textContent = total.toFixed(2);
  checkoutBtn.disabled = cart.length === 0;
}

async function loadBooks() {
  const res = await fetch(booksUrl);
  const books = await res.json();
  booksContainer.innerHTML = '';
  books.forEach(book => {
    const div = document.createElement('div');
    div.className = 'book';
    div.innerHTML = `
      <img src="${book.imageUrl}" alt="${book.title}" />
      <h3>${book.title}</h3>
      <p>Author: ${book.author}</p>
      <p>Price: ₹${book.price}</p>
      <p>Rating: ${book.rating}</p>
      <button>Add to Cart</button>
    `;
    const btn = div.querySelector('button');
    btn.addEventListener('click', () => {
      cart.push(book);
      updateCartUI();
    });
    booksContainer.appendChild(div);
  });
}

async function createOrder(amount) {
  const orderData = {
    customerName: 'Demo User',
    customerEmail: 'demo@example.com',
    customerPhone: '9999999999',
    customerAddress: 'Demo Address',
    items: cart,
    totalAmount: amount,
    paymentMethod: 'razorpay'
  };
  const response = await fetch('http://localhost:8080/api/orders/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  return response.json();
}

function openRazorpay(order) {
  const options = {
    key: 'YOUR_RAZORPAY_KEY_ID',
    amount: order.amount * 100,
    currency: 'INR',
    name: 'NextGen Bookstore',
    description: 'Book Purchase',
    order_id: order.orderId,
    handler: async function (response) {
      await verifyPayment(order.orderId, response.razorpay_payment_id);
      alert('Payment successful!');
      cart = [];
      updateCartUI();
    },
    prefill: {
      name: 'Demo User',
      email: 'demo@example.com',
      contact: '9999999999'
    },
    theme: { color: '#3399cc' }
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
}

async function verifyPayment(orderId, paymentId) {
  await fetch('http://localhost:8080/api/orders/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId: orderId, razorpayPaymentId: paymentId })
  });
}

checkoutBtn.addEventListener('click', async () => {
  const total = parseFloat(totalAmountElem.textContent);
  if (total > 0) {
    const order = await createOrder(total);
    openRazorpay(order);
  }
});

loadBooks();
updateCartUI();
