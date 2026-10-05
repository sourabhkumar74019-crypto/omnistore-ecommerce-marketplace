// Seed Products Database
const initialProducts = [
  { id: 'p-1', title: 'Acoustic Noise-Cancelling Headphones', category: 'Electronics', price: 249.00, inStock: true, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', desc: 'Active noise cancellation with 40-hour battery life.' },
  { id: 'p-2', title: 'Minimalist Mechanical Keyboard', category: 'Gaming', price: 129.00, inStock: true, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80', desc: 'RGB tactile switches with wireless Bluetooth connectivity.' },
  { id: 'p-3', title: 'Urban Waterproof Cyber Backpack', category: 'Fashion', price: 89.50, inStock: true, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', desc: 'Ergonomic 16-inch laptop compartment with TSA lock.' },
  { id: 'p-4', title: 'Smart Minimalist Desk Lamp', category: 'Home', price: 59.00, inStock: true, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80', desc: 'Wireless phone charger built into heavy aluminum base.' },
  { id: 'p-5', title: 'Ultra-Wide Curved Gaming Monitor', category: 'Gaming', price: 699.00, inStock: true, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80', desc: '144Hz 1ms refresh rate display for immersive gaming.' },
  { id: 'p-6', title: 'Stainless Steel Insulated Bottle', category: 'Home', price: 34.00, inStock: true, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80', desc: 'Keeps drinks cold for 24 hours or hot for 12 hours.' }
];

// State Management
let products = JSON.parse(localStorage.getItem('omni_products')) || initialProducts;
let cart = JSON.parse(localStorage.getItem('omni_cart')) || [];
let currency = 'USD';
let currencyRate = 1; // 1 USD = 83 INR
let isDarkMode = true;
let currentCategory = 'All';
let isDiscountApplied = false;

document.addEventListener('DOMContentLoaded', () => {
  renderStorefront();
  renderMerchantTable();
  updateCartUI();
});

function saveProductsState() { localStorage.setItem('omni_products', JSON.stringify(products)); }
function saveCartState() { localStorage.setItem('omni_cart', JSON.stringify(cart)); }

// Mode Switcher
function switchMode(mode) {
  document.getElementById('storeView').classList.toggle('hidden', mode !== 'store');
  document.getElementById('merchantView').classList.toggle('hidden', mode !== 'merchant');
  document.getElementById('settingsView').classList.toggle('hidden', mode !== 'settings');

  document.getElementById('nav-store').classList.toggle('active', mode === 'store');
  document.getElementById('nav-merchant').classList.toggle('active', mode === 'merchant');
  document.getElementById('nav-settings').classList.toggle('active', mode === 'settings');
}

function switchTab(tab) {
  if (tab === 'settings') switchMode('settings');
}

// Theme Switcher
function toggleTheme() {
  isDarkMode = !isDarkMode;
  const html = document.documentElement;
  const icon = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');

  if (isDarkMode) {
    html.classList.remove('light');
    html.classList.add('dark');
    icon.className = 'fa-solid fa-moon text-indigo-400';
    label.textContent = 'Dark';
  } else {
    html.classList.remove('dark');
    html.classList.add('light');
    icon.className = 'fa-solid fa-sun text-indigo-500';
    label.textContent = 'Light';
  }
}

// Currency Engine
function changeCurrency() {
  currency = document.getElementById('currencySelector').value;
  currencyRate = currency === 'INR' ? 83 : 1;
  renderStorefront();
  renderMerchantTable();
  updateCartUI();
}

function formatPrice(amountUSD) {
  const converted = amountUSD * currencyRate;
  if (currency === 'INR') {
    return `₹${Math.round(converted).toLocaleString()}`;
  }
  return `$${converted.toFixed(2)}`;
}

// Storefront Filter & Search
function filterCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll('#categoryFilterGroup button').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderStorefront();
}

function renderStorefront() {
  const container = document.getElementById('storefrontGrid');
  const query = document.getElementById('storeSearchInput')?.value.toLowerCase() || '';
  const sort = document.getElementById('sortSelector')?.value || 'featured';

  container.innerHTML = '';

  let list = products.filter(p => {
    const matchCat = currentCategory === 'All' || p.category === currentCategory;
    const matchSearch = p.title.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });

  if (sort === 'low') list.sort((a, b) => a.price - b.price);
  if (sort === 'high') list.sort((a, b) => b.price - a.price);

  if (list.length === 0) {
    container.innerHTML = `<div class="col-span-full py-12 text-center text-sub">No products found matching your search.</div>`;
    return;
  }

  list.forEach(prod => {
    const card = document.createElement('div');
    card.className = `product-card card-bg rounded-2xl overflow-hidden border card-border flex flex-col justify-between ${!prod.inStock ? 'opacity-60' : ''}`;
    card.innerHTML = `
      <div>
        <div class="relative h-48 overflow-hidden">
          <img src="${prod.image}" alt="${prod.title}" class="w-full h-full object-cover">
          <span class="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">${prod.category}</span>
          ${!prod.inStock ? '<span class="absolute top-3 right-3 bg-slate-950/90 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Out of Stock</span>' : ''}
        </div>
        <div class="p-5 space-y-2">
          <div class="flex justify-between items-start gap-2">
            <h3 class="font-extrabold text-brand text-sm line-clamp-1">${prod.title}</h3>
            <span class="text-indigo-400 font-black text-sm whitespace-nowrap">${formatPrice(prod.price)}</span>
          </div>
          <p class="text-xs text-sub leading-relaxed line-clamp-2">${prod.desc}</p>
        </div>
      </div>
      <div class="p-5 pt-0">
        <button onclick="addToCart('${prod.id}')" ${!prod.inStock ? 'disabled' : ''} class="w-full ${prod.inStock ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-slate-800 cursor-not-allowed'} text-white font-extrabold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2">
          <i class="fa-solid fa-cart-plus"></i> ${prod.inStock ? 'Add To Bag' : 'Out of Stock'}
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Shopping Cart Drawer Engine
function toggleCartDrawer() {
  document.getElementById('cartDrawer').classList.toggle('hidden');
}

function addToCart(id) {
  const prod = products.find(p => p.id === id);
  if (!prod || !prod.inStock) return;

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...prod, qty: 1 });
  }

  saveCartState();
  updateCartUI();
  showToast(`Added ${prod.title} to bag!`, 'success');
}

function updateCartQty(id, delta) {
  const idx = cart.findIndex(c => c.id === id);
  if (idx !== -1) {
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
  }
  saveCartState();
  updateCartUI();
}

function applyPromoCode() {
  const code = document.getElementById('promoInput').value.trim().toUpperCase();
  if (code === 'SAVE10') {
    isDiscountApplied = true;
    updateCartUI();
    showToast('10% Discount applied!', 'success');
  } else {
    showToast('Invalid promo code. Try SAVE10', 'error');
  }
}

function updateCartUI() {
  const container = document.getElementById('cartItemsContainer');
  const countBadge = document.getElementById('cartCountBadge');
  container.innerHTML = '';

  let totalQty = 0;
  let subtotal = 0;

  cart.forEach(item => {
    totalQty += item.qty;
    subtotal += item.price * item.qty;

    const row = document.createElement('div');
    row.className = 'flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border card-border text-xs';
    row.innerHTML = `
      <div class="space-y-0.5">
        <h4 class="font-bold text-brand line-clamp-1">${item.title}</h4>
        <p class="text-indigo-400 font-bold">${formatPrice(item.price * item.qty)}</p>
      </div>
      <div class="flex items-center gap-2 bg-slate-800 p-1 rounded-lg">
        <button onclick="updateCartQty('${item.id}', -1)" class="w-6 h-6 text-brand font-bold flex items-center justify-center hover:bg-slate-700 rounded">-</button>
        <span class="font-bold text-brand text-xs px-1">${item.qty}</span>
        <button onclick="updateCartQty('${item.id}', 1)" class="w-6 h-6 text-brand font-bold flex items-center justify-center hover:bg-slate-700 rounded">+</button>
      </div>
    `;
    container.appendChild(row);
  });

  const tax = subtotal * 0.10;
  const discount = isDiscountApplied ? subtotal * 0.10 : 0;
  const total = subtotal + tax - discount;

  countBadge.textContent = totalQty;
  document.getElementById('cartSubtotal').textContent = formatPrice(subtotal);
  document.getElementById('cartTax').textContent = formatPrice(tax);

  const discRow = document.getElementById('discountRow');
  if (isDiscountApplied) {
    discRow.classList.remove('hidden');
    document.getElementById('cartDiscount').textContent = `-${formatPrice(discount)}`;
  } else {
    discRow.classList.add('hidden');
  }

  document.getElementById('cartTotal').textContent = formatPrice(total);
}

function handleCheckout() {
  if (cart.length === 0) {
    showToast('Your bag is empty!', 'error');
    return;
  }

  cart = [];
  saveCartState();
  updateCartUI();
  toggleCartDrawer();
  showToast('Order confirmed! Tracking details sent to your email.', 'success');
}

// MERCHANT CRUD CONTROLS
function renderMerchantTable() {
  const tbody = document.getElementById('merchantTableBody');
  tbody.innerHTML = '';

  products.forEach(p => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-900/40 transition';
    tr.innerHTML = `
      <td class="p-4 flex items-center gap-3">
        <img src="${p.image}" class="w-10 h-10 object-cover rounded-xl">
        <div>
          <h4 class="font-bold text-brand text-xs">${p.title}</h4>
          <p class="text-[10px] text-sub truncate max-w-xs">${p.desc}</p>
        </div>
      </td>
      <td class="p-4 text-sub">${p.category}</td>
      <td class="p-4 font-bold text-indigo-400">${formatPrice(p.price)}</td>
      <td class="p-4">
        <button onclick="toggleStockStatus('${p.id}')" class="${p.inStock ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'} border text-[10px] font-extrabold px-2.5 py-1 rounded-full">
          ${p.inStock ? 'In Stock' : 'Out of Stock'}
        </button>
      </td>
      <td class="p-4 text-right space-x-2">
        <button onclick="openEditProductModal('${p.id}')" class="p-2 text-sub hover:text-indigo-400"><i class="fa-solid fa-pen-to-square"></i></button>
        <button onclick="deleteProduct('${p.id}')" class="p-2 text-sub hover:text-rose-500"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function toggleStockStatus(id) {
  const item = products.find(p => p.id === id);
  if (item) {
    item.inStock = !item.inStock;
    saveProductsState();
    renderMerchantTable();
    renderStorefront();
    showToast(`Updated stock status for ${item.title}`, 'success');
  }
}

function openAddProductModal() {
  document.getElementById('editProdId').value = '';
  document.getElementById('productModalTitle').textContent = 'Upload Product Listing';
  document.getElementById('prodTitle').value = '';
  document.getElementById('prodPrice').value = '';
  document.getElementById('prodImage').value = '';
  document.getElementById('prodDesc').value = '';

  openModal('productModal');
}

function openEditProductModal(id) {
  const item = products.find(p => p.id === id);
  if (!item) return;

  document.getElementById('editProdId').value = item.id;
  document.getElementById('productModalTitle').textContent = 'Edit Product Listing';
  document.getElementById('prodTitle').value = item.title;
  document.getElementById('prodCategory').value = item.category;
  document.getElementById('prodPrice').value = item.price;
  document.getElementById('prodImage').value = item.image;
  document.getElementById('prodDesc').value = item.desc;

  openModal('productModal');
}

function handleProductSave(e) {
  e.preventDefault();

  const editId = document.getElementById('editProdId').value;
  const prodData = {
    id: editId || 'p-' + Date.now(),
    title: document.getElementById('prodTitle').value,
    category: document.getElementById('prodCategory').value,
    price: parseFloat(document.getElementById('prodPrice').value),
    image: document.getElementById('prodImage').value,
    desc: document.getElementById('prodDesc').value,
    inStock: true
  };

  if (editId) {
    const idx = products.findIndex(p => p.id === editId);
    if (idx !== -1) products[idx] = prodData;
  } else {
    products.unshift(prodData);
  }

  saveProductsState();
  closeModal('productModal');
  renderMerchantTable();
  renderStorefront();
  showToast('Product listing saved successfully!', 'success');
}

function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this product listing?')) {
    products = products.filter(p => p.id !== id);
    saveProductsState();
    renderMerchantTable();
    renderStorefront();
    showToast('Product deleted from store', 'info');
  }
}

// Settings & Auth Handlers
function handleSettingsSave(e) {
  e.preventDefault();
  showToast('Store settings updated!', 'success');
}

function handleAuthLogin(e) {
  e.preventDefault();
  closeModal('authModal');
  showToast('Logged in as Sourabh Kumar', 'success');
}

// Modal Helpers
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

// Toast System
function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `px-4 py-3 rounded-xl text-xs font-bold text-white shadow-xl backdrop-blur-md border flex items-center gap-2 pointer-events-auto transition transform translate-y-2 opacity-0 ${type === 'success' ? 'bg-emerald-600/90 border-emerald-400' : 'bg-slate-800/90 border-slate-600'}`;
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;

  container.appendChild(toast);
  setTimeout(() => toast.classList.remove('translate-y-2', 'opacity-0'), 10);
  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
