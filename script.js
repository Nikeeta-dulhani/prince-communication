const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotContainer = document.getElementById('chatbotContainer');
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');

const apiKey = "AIzaSyARDFTGwiwQQ-cUlu4u_n4gk4z-gW80dWc"; 

// Create and add close (×) button to chatbot container
const chatbotCloseBtn = document.createElement('button');
chatbotCloseBtn.id = 'chatbotCloseBtn';
chatbotCloseBtn.textContent = '×';
chatbotCloseBtn.setAttribute('aria-label', 'Close chatbot');
chatbotCloseBtn.style.cssText = `
  align-self: flex-end;
  font-size: 24px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 4px 10px;
  color: #333;
`;
chatbotContainer.prepend(chatbotCloseBtn);

// Close button hides chatbot container
chatbotCloseBtn.addEventListener('click', () => {
  chatbotContainer.style.display = 'none';
});

// Toggle chatbot display and clear chat on open (no history load)
chatbotToggle.addEventListener('click', () => {
  if(chatbotContainer.style.display === 'flex') {
    chatbotContainer.style.display = 'none';
  } else {
    chatbotContainer.style.display = 'flex';
    chatBox.innerHTML = '';  // Clear chatbox fresh on open
  }
});

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function addMessage(msg, type) {
  const div = document.createElement('div');
  div.className = `message ${type}`;
  div.textContent = msg;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addLoading() {
  const loading = document.createElement('div');
  loading.className = 'loading';
  loading.id = 'loading';
  loading.textContent = 'Typing...';
  chatBox.appendChild(loading);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeLoading() {
  const loading = document.getElementById('loading');
  if (loading) loading.remove();
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  userInput.value = '';
  addLoading();

  const systemInstruction = `
  You are the official AI assistant for Prince Communication Shop.

  📌 Shop Details:
  - Address: Prince Communication Shop, Shahi Bazaar, salehpat,Sukkur,sindh, Pakistan
  - Contact Number: +92 300 1234567
  - Email: princecommunication.com
  - Opening Hours: Mon–Sat 9:00 AM – 9:00 PM, Sun 10:00 AM – 6:00 PM
  - Services: Mobile phones, accessories, internet packages, broadband, mobile repairs, and customer support.
  

  ✅ Answer ONLY questions related to Prince Communication Shop: products, services, prices, timings, offers, and contact info.
  ❌ If asked unrelated questions, reply:
  "I can only answer questions about Prince Communication Shop."

  Be friendly, polite, and helpful when answering customer questions.
`;


  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: `${systemInstruction}\n\nUser: ${message}` }] }
        ]
      })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    removeLoading();

    let reply = "⚠️ No response from Gemini.";
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      reply = data.candidates[0].content.parts[0].text.trim();
    }

    addMessage(reply, 'bot');

  } catch (error) {
    removeLoading();
    addMessage("⚠️ Error: Could not connect to AI. Check your API key or internet.", 'bot');
    console.error("Gemini API Error:", error);
  }
}



// === Search Bar Toggle ===
function showSearchBar() {
  const searchBar = document.getElementById('search-bar');
  searchBar.style.display = searchBar.style.display === 'block' ? 'none' : 'block';
}

// === Scroll To Top ===
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === Product Scrolling ===
document.querySelectorAll('.scroll-container').forEach(container => {
  const parent = container.closest('.position-relative');
  const leftBtn = parent.querySelector('.left-btn');
  const rightBtn = parent.querySelector('.right-btn');
  const scrollAmount = 310;
  let autoScroll;

  const startAutoScroll = () => {
    autoScroll = setInterval(() => {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }, 3000);
  };

  const stopAutoScroll = () => clearInterval(autoScroll);

  leftBtn.addEventListener('click', () => {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  rightBtn.addEventListener('click', () => {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  container.addEventListener('mouseover', stopAutoScroll);
  container.addEventListener('mouseleave', startAutoScroll);

  startAutoScroll();
});

// === Cart Functionality ===
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function toggleCart() {
  const cartSidebar = document.getElementById("cart-sidebar");
  cartSidebar.style.display = cartSidebar.style.display === "block" ? "none" : "block";
}

function updateCartCount() {
  document.getElementById("cart-count").innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartDisplay() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  cartItems.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p class='text-center'>Your cart is empty.</p>";
    cartTotal.innerText = "Rs. 0";
    updateCartCount();
    localStorage.setItem("cart", JSON.stringify(cart));
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    li.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        Rs. ${item.price} x ${item.quantity}
      </div>
      <div class="d-flex gap-1 align-items-center">
        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${index})">−</button>
        <button class="btn btn-sm btn-outline-success" onclick="addToCart('${item.name}', ${item.price})">+</button>
        <i class="bi bi-trash text-danger cursor-pointer" style="cursor:pointer;" onclick="deleteItem(${index})"></i>
      </div>
    `;
    cartItems.appendChild(li);
  });

  const checkoutBtn = document.createElement("button");
  checkoutBtn.className = "btn btn-success w-100 mt-3";
  checkoutBtn.innerText = "Checkout";
  checkoutBtn.onclick = () => alert("Checkout functionality not implemented yet.");
  cartItems.appendChild(checkoutBtn);

  cartTotal.innerText = `Rs. ${total}`;
  updateCartCount();
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCartDisplay();
}

function removeFromCart(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  updateCartDisplay();
}

function deleteItem(index) {
  cart.splice(index, 1);
  updateCartDisplay();
}

// === Initialize Events on Page Load ===
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".product-card .btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");
      const name = card.querySelector(".card-title").innerText;
      const price = parseInt(card.querySelector(".card-text").innerText.replace("Rs. ", ""));
      addToCart(name, price);
    });
  });
  updateCartDisplay();
});
