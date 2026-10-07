/* ============================================================
   LUXE BOUTIQUE v3: MAISON
   Adapter-based data layer (LocalAdapter today, Supabase later).
   Motion: GSAP + ScrollTrigger (guarded: site works without CDN).
   ============================================================ */

const IMGQ = '?q=80&w=900&auto=format&fit=crop';
const PRODUCTS_SEED = [
  { id: 1, name: 'Luxury Watch', price: 3999.99, category: 'watches', stock: 4,
    image: 'https://images.unsplash.com/photo-1670177257750-9b47927f68eb?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1670177257750-9b47927f68eb' + IMGQ,
             './images/p1-a1.jpg',
             './images/p1-a2.jpg'],
    rating: 4.8, reviews: 124, badge: 'Bestseller',
    description: 'A timeless statement piece with precision quartz movement, sapphire-coated glass and a genuine leather strap. Water-resistant and crafted to be worn for decades.' },
  { id: 2, name: 'Designer Handbag', price: 2299.99, category: 'bags', stock: 7,
    image: 'https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fERlc2lnbmVyJTIwSGFuZGJhZ3xlbnwwfHwwfHx8MA%3D%3D',
    images: ['https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?w=900&auto=format&fit=crop&q=60',
             './images/p2-a1.jpg',
             './images/p2-a2.jpg'],
    rating: 4.9, reviews: 89, badge: 'New',
    description: 'Crafted from premium vegan leather with gold-tone hardware and a suede-soft interior. Spacious, structured, and effortlessly elegant, from workdays to evenings.' },
  { id: 3, name: 'Premium Sunglasses', price: 1399.99, category: 'accessories', stock: 12,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083' + IMGQ,
             './images/p3-a1.jpg',
             './images/p3-a2.jpg'],
    rating: 4.7, reviews: 203, badge: '',
    description: 'Polarized UV400 lenses set in a hand-finished acetate frame. A classic silhouette with all-day comfort and unmistakable presence.' },
  { id: 4, name: 'Elegant Necklace', price: 1799.99, category: 'jewelry', stock: 2,
    image: 'https://images.unsplash.com/photo-1721103418218-416182aca079?w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1721103418218-416182aca079' + IMGQ,
             './images/p4-a1.jpg',
             './images/p4-a2.jpg'],
    rating: 4.9, reviews: 67, badge: 'Limited',
    description: 'An 18k gold-plated pendant on a delicate chain, hand-polished for a lasting shine. Arrives in our signature gift box, ready for special moments.' },
  { id: 5, name: 'Silk Scarf', price: 1199.99, category: 'accessories', stock: 15,
    image: 'https://images.unsplash.com/photo-1601244005535-a48d21d951ac?q=80&w=1370&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    images: ['https://images.unsplash.com/photo-1601244005535-a48d21d951ac' + IMGQ,
             './images/p5-a1.jpg',
             './images/p5-a2.jpg'],
    rating: 4.6, reviews: 158, badge: '',
    description: '100% mulberry silk with hand-rolled edges and an exclusive print. Drapes beautifully and elevates any outfit, season after season.' },
  { id: 6, name: 'Leather Belt', price: 1149.99, category: 'accessories', stock: 9,
    image: 'https://images.unsplash.com/photo-1711443982852-b3df5c563448?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGJyYW5kZWQlMjBsZXRoZXIlMjBiZWx0fGVufDB8fDB8fHww',
    images: ['https://images.unsplash.com/photo-1711443982852-b3df5c563448?q=80&w=900&auto=format&fit=crop',
             './images/p6-a1.jpg',
             './images/p6-a2.jpg'],
    rating: 4.7, reviews: 92, badge: '',
    description: 'Full-grain leather with a brushed metal buckle. Cut, dyed and stitched by hand for a perfect finish that ages gracefully.' }
];

function localCustomProducts() { try { return JSON.parse(localStorage.getItem('luxe_custom_products') || '[]'); } catch (e) { return []; } }
function localDeletedIds() { try { return JSON.parse(localStorage.getItem('luxe_deleted_products') || '[]'); } catch (e) { return []; } }
function localPromosRaw() { try { return JSON.parse(localStorage.getItem('luxe_promos') || 'null') || { WELCOME10: { percent: 0.10, active: true } }; } catch (e) { return { WELCOME10: { percent: 0.10, active: true } }; } }

const LocalAdapter = {
  async getProducts() {
    let overrides = {};
    try { overrides = JSON.parse(localStorage.getItem('luxe_product_overrides') || '{}'); } catch (e) {}
    const deleted = new Set(localDeletedIds());
    const base = PRODUCTS_SEED.filter(p => !deleted.has(p.id)).map(p => ({ ...p, ...(overrides[p.id] || {}) }));
    return [...base, ...localCustomProducts()];
  },
  async getProduct(id) {
    const all = await this.getProducts();
    const p = all.find(x => x.id === Number(id));
    return p ? { ...p } : null;
  },
  async createOrder(order) {
    const orders = JSON.parse(localStorage.getItem('luxe_orders') || '[]');
    orders.push(order);
    localStorage.setItem('luxe_orders', JSON.stringify(orders));
    return order;
  },
  async getOrder(number) {
    const orders = JSON.parse(localStorage.getItem('luxe_orders') || '[]');
    return orders.find(o => o.number === String(number).trim().toUpperCase()) || null;
  },
  async createNewsletter(email) {
    const list = JSON.parse(localStorage.getItem('luxe_newsletter') || '[]');
    if (!list.some(e => e.email === email)) {
      list.push({ email, at: new Date().toISOString() });
      localStorage.setItem('luxe_newsletter', JSON.stringify(list));
    }
  },
  async createMessage(m) {
    const all = JSON.parse(localStorage.getItem('luxe_messages') || '[]');
    all.unshift({ id: Date.now(), name: m.name, email: m.email, message: m.message, created_at: new Date().toISOString() });
    localStorage.setItem('luxe_messages', JSON.stringify(all));
  },
  async getMessages() {
    return JSON.parse(localStorage.getItem('luxe_messages') || '[]');
  },
  async deleteMessage(id) {
    const all = JSON.parse(localStorage.getItem('luxe_messages') || '[]').filter(x => String(x.id) !== String(id));
    localStorage.setItem('luxe_messages', JSON.stringify(all));
  },
  /* ---- admin (demo mode) ---- */
  async adminLogin(password) {
    if (password === 'luxe-admin') return 'local-demo-token';
    throw new Error('Invalid password');
  },
  async getOrders() {
    const orders = JSON.parse(localStorage.getItem('luxe_orders') || '[]');
    return [...orders].reverse();
  },
  async updateOrderStatus(number, status) {
    const orders = JSON.parse(localStorage.getItem('luxe_orders') || '[]');
    const o = orders.find(x => x.number === number);
    if (o) { o.status = status; localStorage.setItem('luxe_orders', JSON.stringify(orders)); }
  },
  async getNewsletterList() {
    const list = JSON.parse(localStorage.getItem('luxe_newsletter') || '[]');
    return [...list].reverse().map(e => ({ email: e.email, created_at: e.at }));
  },
  async updateProduct(id, patch) {
    let overrides = {};
    try { overrides = JSON.parse(localStorage.getItem('luxe_product_overrides') || '{}'); } catch (e) {}
    overrides[id] = { ...(overrides[id] || {}), ...patch };
    localStorage.setItem('luxe_product_overrides', JSON.stringify(overrides));
    const p = PRODUCTS.find(x => x.id === Number(id));
    if (p) Object.assign(p, patch);
    const custom = localCustomProducts();
    const cp = custom.find(x => x.id === Number(id));
    if (cp) { Object.assign(cp, patch); localStorage.setItem('luxe_custom_products', JSON.stringify(custom)); }
  },
  async createProduct(data) {
    const custom = localCustomProducts();
    let nextId = 100;
    try { nextId = Number(localStorage.getItem('luxe_next_id') || 100); } catch (e) {}
    const p = { rating: 5.0, reviews: 0, badge: '', stock: 10, visible: true, ...data, id: nextId };
    if (!p.images || !p.images.length) p.images = [p.image];
    custom.push(p);
    localStorage.setItem('luxe_custom_products', JSON.stringify(custom));
    localStorage.setItem('luxe_next_id', String(nextId + 1));
    PRODUCTS.push({ ...p });
    return { ...p };
  },
  async deleteProduct(id) {
    id = Number(id);
    if (PRODUCTS_SEED.some(p => p.id === id)) {
      const d = localDeletedIds();
      if (!d.includes(id)) d.push(id);
      localStorage.setItem('luxe_deleted_products', JSON.stringify(d));
    } else {
      localStorage.setItem('luxe_custom_products', JSON.stringify(localCustomProducts().filter(p => p.id !== id)));
    }
    PRODUCTS = PRODUCTS.filter(p => p.id !== id);
  },
  async deleteOrder(number) {
    const orders = JSON.parse(localStorage.getItem('luxe_orders') || '[]');
    localStorage.setItem('luxe_orders', JSON.stringify(orders.filter(o => o.number !== number)));
  },
  async getPromos() {
    const raw = localPromosRaw();
    const m = {};
    Object.keys(raw).forEach(k => { if (raw[k] && raw[k].active !== false) m[k] = Number(raw[k].percent); });
    return m;
  },
  async getPromoList() {
    const raw = localPromosRaw();
    return Object.keys(raw).sort().map(k => ({ code: k, percent: Number(raw[k].percent), active: raw[k].active !== false }));
  },
  async savePromo(code, percent, active) {
    const raw = localPromosRaw();
    raw[code] = { percent, active };
    localStorage.setItem('luxe_promos', JSON.stringify(raw));
  },
  async deletePromo(code) {
    const raw = localPromosRaw();
    delete raw[code];
    localStorage.setItem('luxe_promos', JSON.stringify(raw));
  },
  async getSettings() {
    try { return JSON.parse(localStorage.getItem('luxe_settings') || '{}'); } catch (e) { return {}; }
  },
  async saveSetting(key, value) {
    let s = {};
    try { s = JSON.parse(localStorage.getItem('luxe_settings') || '{}'); } catch (e) {}
    s[key] = value;
    localStorage.setItem('luxe_settings', JSON.stringify(s));
    SETTINGS[key] = value;
  },
  async uploadImage(file) {
    if (file.size > 1500000) throw new Error('Image must be under 1.5MB in demo mode');
    return await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => reject(new Error('Could not read image'));
      r.readAsDataURL(file);
    });
  }
};

/* ============================================================
   BACKEND CONFIG: Supabase (real production database)
   1. Create a FREE project at https://supabase.com (2 minutes)
   2. In its SQL Editor run BOTH files, in this order:
      a) supabase-setup.sql        (tables, security, seed products)
      b) supabase-cms-upgrade.sql  (promos, content settings, image storage)
   3. Paste your Project URL + anon key below
   Leave blank to keep using the built-in local demo database.
   ============================================================ */
const SUPABASE_URL = 'https://wuiwcpignumyzskklslw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1aXdjcGlnbnVteXpza2tsc2x3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyODY3NDQsImV4cCI6MjEwNjg2Mjc0NH0.Iob4Ra6xpFH_irnK3tc190J33t1rwHz3LuXjpHc8etk';
const USE_SUPABASE = SUPABASE_URL.startsWith('http') && SUPABASE_ANON_KEY.length > 20;

// ---- Order confirmation emails (EmailJS) ----
const EMAILJS_PUBLIC_KEY = 'dvj2IratEQ_j0T49y';
const EMAILJS_SERVICE_ID = 'service_ct93ba9';
const EMAILJS_TEMPLATES = ['template_5wf5xlz', 'template_ye988sb'];
let emailjsReady = false;
function initEmailJS() {
  try {
    if (window.emailjs && EMAILJS_PUBLIC_KEY && EMAILJS_TEMPLATES.length) {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      emailjsReady = true;
    }
  } catch (e) { emailjsReady = false; }
}
function nextEmailTemplate() {
  let idx = 0;
  try { idx = parseInt(localStorage.getItem('luxe_tpl_idx') || '0', 10) || 0; } catch (e) {}
  const id = EMAILJS_TEMPLATES[idx % EMAILJS_TEMPLATES.length];
  try { localStorage.setItem('luxe_tpl_idx', String((idx + 1) % EMAILJS_TEMPLATES.length)); } catch (e) {}
  return id;
}
function sendOrderConfirmationEmail(order, templateId, note) {
  if (!emailjsReady || !order || !order.email) return Promise.resolve(false);
  const itemsHtml = (order.items || []).map(it => {
    const qty = it.qty || 1;
    return `${escapeHtml(it.name)} × ${qty} — ${money(it.price * qty)}`;
  }).join('<br>');
  const params = {
    to_email: order.email,
    email: order.email,
    customer_name: order.name || 'Customer',
    customer_phone: order.phone || '',
    order_number: order.number,
    order_id: order.number,
    order_items: itemsHtml,
    order_total: money(order.total),
    personal_note: (note || '').replace(/\n/g, '<br>')
  };
  return emailjs.send(EMAILJS_SERVICE_ID, templateId || nextEmailTemplate(), params)
    .then(() => true).catch(() => false);
}
// Admin order status update + confirmation-email modal
function doStatusUpdate(num, newStatus, selEl) {
  DB.updateOrderStatus(num, newStatus, adminToken)
    .then(() => {
      const o = adminOrdersCache.find(x => x.number === num);
      if (o) o.status = newStatus;
      const sel = selEl || document.querySelector(`select[data-status="${CSS.escape(num)}"]`);
      const pill = sel ? sel.closest('.a-order-right')?.querySelector('.a-status') : null;
      if (pill) { pill.className = `a-status ${newStatus}`; pill.textContent = capitalize(newStatus); }
      showToast(`Order ${num} → ${newStatus}`);
      const od = document.getElementById('order-drawer');
      if (od && od.classList.contains('open')) openOrderDrawer(num);
    })
    .catch(() => showToast('Status update failed'));
}
let pendingEmailOrder = null;
let pendingEmailPrevStatus = '';
function openEmailModal(num, order) {
  pendingEmailOrder = order;
  pendingEmailPrevStatus = order.status || 'placed';
  document.getElementById('em-to').textContent = order.email;
  document.getElementById('em-tpl').value = 'auto';
  document.getElementById('em-note').value = '';
  document.getElementById('email-modal').classList.add('open');
}
function closeEmailModal(revert) {
  document.getElementById('email-modal').classList.remove('open');
  if (revert && pendingEmailOrder) {
    const sel = document.querySelector(`select[data-status="${CSS.escape(pendingEmailOrder.number)}"]`);
    if (sel) sel.value = pendingEmailPrevStatus;
  }
  pendingEmailOrder = null;
}

/* Supabase REST helper (no extra library needed) */
async function sb(path, opts = {}, token) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...opts,
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token || SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      ...(opts.headers || {})
    }
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Supabase ${res.status}: ${t.slice(0, 140)}`);
  }
  const txt = await res.text();
  return txt ? JSON.parse(txt) : null;
}
function mapProductRow(r) {
  return {
    id: r.id, name: r.name, price: Number(r.price), category: r.category,
    stock: r.stock != null ? r.stock : 10,
    visible: r.visible !== false,
    image: r.image, images: (r.images && r.images.length ? r.images : [r.image]),
    rating: Number(r.rating || 0), reviews: r.reviews || 0,
    badge: r.badge || '', description: r.description || ''
  };
}
function mapOrderRow(r) {
  return {
    number: r.number, date: r.date, name: r.name, phone: r.phone, email: r.email,
    address: r.address, city: r.city || '', notes: r.notes, items: r.items || [],
    subtotal: Number(r.subtotal || 0), discount: Number(r.discount || 0),
    delivery: Number(r.delivery || 0),
    promo: r.promo, total: Number(r.total), status: r.status, payment: r.payment
  };
}

const SupabaseAdapter = {
  async getProducts() {
    const rows = await sb('products?select=*&order=id.asc');
    return (rows || []).map(mapProductRow);
  },
  async getProduct(id) {
    const rows = await sb(`products?select=*&id=eq.${Number(id)}`);
    return rows && rows[0] ? mapProductRow(rows[0]) : null;
  },
  async createOrder(order) {
    const base = {
      number: order.number, date: order.date, name: order.name, phone: order.phone,
      email: order.email || null, address: order.address, notes: order.notes || null,
      items: order.items, subtotal: order.subtotal, discount: order.discount,
      promo: order.promo, total: order.total, status: 'placed', payment: 'COD'
    };
    const full = { ...base, delivery: order.delivery || 0, city: order.city || null };
    try {
      await sb('orders', { method: 'POST', headers: { 'Prefer': 'return=minimal' }, body: JSON.stringify(full) });
    } catch (e) {
      // Fallback if the city/delivery migration hasn't been run yet
      await sb('orders', { method: 'POST', headers: { 'Prefer': 'return=minimal' }, body: JSON.stringify(base) });
    }
    return order;
  },
  async getOrder(number) {
    const rows = await sb('rpc/get_order_by_number', {
      method: 'POST', body: JSON.stringify({ p_number: String(number).trim().toUpperCase() })
    });
    return rows && rows[0] ? mapOrderRow(rows[0]) : null;
  },
  async createNewsletter(email) {
    await sb('newsletter', { method: 'POST', headers: { 'Prefer': 'return=minimal' }, body: JSON.stringify({ email }) });
  },
  async createMessage(m) {
    await sb('messages', { method: 'POST', headers: { 'Prefer': 'return=minimal' }, body: JSON.stringify({ name: m.name, email: m.email, message: m.message }) });
  },
  async getMessages(token) {
    const rows = await sb('messages?select=*&order=created_at.desc', {}, token);
    return (rows || []).map(r => ({ id: r.id, name: r.name, email: r.email, message: r.message, created_at: r.created_at }));
  },
  async deleteMessage(id, token) {
    await sb(`messages?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' }, token);
  },
  /* ---- admin (authenticated) ---- */
  async adminLogin(email, password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Invalid email or password');
    const j = await res.json();
    return j.access_token;
  },
  async getOrders(token) {
    const rows = await sb('orders?select=*&order=created_at.desc', {}, token);
    return (rows || []).map(mapOrderRow);
  },
  async updateOrderStatus(number, status, token) {
    await sb(`orders?number=eq.${encodeURIComponent(number)}`, {
      method: 'PATCH', body: JSON.stringify({ status })
    }, token);
  },
  async getNewsletterList(token) {
    return await sb('newsletter?select=email,created_at&order=created_at.desc', {}, token) || [];
  },
  async updateProduct(id, patch, token) {
    try {
      await sb(`products?id=eq.${Number(id)}`, { method: 'PATCH', body: JSON.stringify(patch) }, token);
    } catch (e) {
      // Fallback if the 'visible' column migration hasn't been run yet
      const { visible, ...rest } = patch;
      if (Object.keys(rest).length) await sb(`products?id=eq.${Number(id)}`, { method: 'PATCH', body: JSON.stringify(rest) }, token);
      else throw e;
    }
  },
  async createProduct(data, token) {
    const payload = { ...data };
    delete payload.id; // id is auto-generated
    try {
      const rows = await sb('products', { method: 'POST', headers: { 'Prefer': 'return=representation' }, body: JSON.stringify(payload) }, token);
      return rows && rows[0] ? mapProductRow(rows[0]) : null;
    } catch (e) {
      // Fallback if the 'visible' column migration hasn't been run yet
      delete payload.visible;
      const rows = await sb('products', { method: 'POST', headers: { 'Prefer': 'return=representation' }, body: JSON.stringify(payload) }, token);
      return rows && rows[0] ? mapProductRow(rows[0]) : null;
    }
  },
  async deleteProduct(id, token) {
    await sb(`products?id=eq.${Number(id)}`, { method: 'DELETE' }, token);
  },
  async deleteOrder(number, token) {
    await sb(`orders?number=eq.${encodeURIComponent(number)}`, { method: 'DELETE' }, token);
  },
  async getPromos() {
    const rows = await sb('promos?select=code,percent');
    const m = {};
    (rows || []).forEach(r => { m[r.code] = Number(r.percent); });
    return m;
  },
  async getPromoList(token) {
    const rows = await sb('promos?select=code,percent,active&order=code.asc', {}, token);
    return (rows || []).map(r => ({ code: r.code, percent: Number(r.percent), active: !!r.active }));
  },
  async savePromo(code, percent, active, token) {
    await sb('promos', {
      method: 'POST', headers: { 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify({ code, percent, active })
    }, token);
  },
  async deletePromo(code, token) {
    await sb(`promos?code=eq.${encodeURIComponent(code)}`, { method: 'DELETE' }, token);
  },
  async getSettings() {
    const rows = await sb('settings?select=key,value');
    const m = {};
    (rows || []).forEach(r => { m[r.key] = r.value; });
    return m;
  },
  async saveSetting(key, value, token) {
    await sb('settings', {
      method: 'POST', headers: { 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify({ key, value })
    }, token);
  },
  async uploadImage(file, token) {
    const ext = ((file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg');
    const name = `p-${Date.now()}.${ext}`;
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/product-images/${name}`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${token}`, 'Content-Type': file.type || 'image/jpeg' },
      body: file
    });
    if (!res.ok) throw new Error('Image upload failed: check the storage bucket exists');
    return `${SUPABASE_URL}/storage/v1/object/public/product-images/${name}`;
  }
};

/* Adapter-based data layer: LocalAdapter today, SupabaseAdapter when configured. */
const DB = USE_SUPABASE ? SupabaseAdapter : LocalAdapter;

// ---------- DOM ----------
const mainContent = document.getElementById('main-content');
const topwrap = document.querySelector('.topwrap');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mainNav = document.querySelector('.main-nav');
const cartToggle = document.querySelector('.cart-toggle');
const cartCount = document.querySelector('.cart-count');
const cart = document.getElementById('cart');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const drawerCartCount = document.getElementById('drawer-cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const cartClose = document.querySelector('.cart-close');
const wishlistToggle = document.querySelector('.wishlist-toggle');
const wishlistCount = document.querySelector('.wishlist-count');
const wishlistDrawer = document.getElementById('wishlist');
const wishlistItemsEl = document.getElementById('wishlist-items');
const wishlistClose = document.querySelector('.wishlist-close');
const scrim = document.getElementById('drawer-scrim');
const quickview = document.getElementById('quickview');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toast-msg');

// ---------- State ----------
let PRODUCTS = [];
let cartContents = [];
let wishlist = [];
let currentFilter = 'all';
let currentSort = 'default';
let currentSearch = '';

// ---------- Helpers ----------
function saveCart() { localStorage.setItem('luxe_cart', JSON.stringify(cartContents)); }
function saveWishlist() { localStorage.setItem('luxe_wishlist', JSON.stringify(wishlist)); }
function loadPersisted() {
  try {
    const raw = JSON.parse(localStorage.getItem('luxe_cart') || '[]');
    const merged = new Map(); // id -> qty (merges legacy duplicate rows)
    (Array.isArray(raw) ? raw : []).forEach(it => {
      if (!it || !PRODUCTS.some(p => p.id === it.id)) return;
      merged.set(it.id, (merged.get(it.id) || 0) + (it.qty || 1));
    });
    cartContents = [...merged.entries()].map(([id, qty]) => {
      const p = PRODUCTS.find(x => x.id === id);
      return { ...p, qty: Math.max(1, Math.min(qty, p.stock || 10)) };
    });
  } catch (e) { cartContents = []; }
  try {
    const w = JSON.parse(localStorage.getItem('luxe_wishlist') || '[]');
    wishlist = Array.isArray(w) ? w.filter(id => PRODUCTS.some(p => p.id === id)) : [];
  } catch (e) { wishlist = []; }
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function money(n) { return 'Rs. ' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

// ---------- Promo codes (loaded from DB, managed in admin CMS) ----------
let PROMOS = { WELCOME10: 0.10 };
let SETTINGS = {};
function defaultSettings() {
  return {
    announcement: 'The Winter Edit: Flat 25% Off',
    hero_eyebrow: 'Maison de Luxe · Est. 2026',
    hero_line1: 'Timeless',
    hero_line2: 'Elegance,',
    hero_line3: 'Worn Daily',
    sale_enabled: '1',
    sale_ends_at: '',
    delivery_fee: '250',
    delivery_cities: '{}',
    store_open: '1',
    sales_goal: '50000',
    store_phone: '+92 318-1654176',
    store_email: 'ghulamghous208@gmail.com',
    store_address: 'Rajana Road Kamalia, District Toba Tek Singh, Pakistan'
  };
}
function applySettings() {
  const track = document.querySelector('.announce-track');
  if (track && SETTINGS.announcement) {
    const msgs = [SETTINGS.announcement, 'Complimentary delivery across Pakistan', 'Cash on Delivery'];
    const half = msgs.map(m => `<span>${escapeHtml(m)}</span><i>◆</i>`).join('');
    track.innerHTML = half + half;
  }
  const fp = document.getElementById('foot-phone');
  if (fp && SETTINGS.store_phone) fp.textContent = SETTINGS.store_phone;
  const fe = document.getElementById('foot-email');
  if (fe && SETTINGS.store_email) fe.textContent = SETTINGS.store_email;
  const fa = document.getElementById('foot-address');
  if (fa && SETTINGS.store_address) fa.textContent = SETTINGS.store_address;
  let banner = document.getElementById('store-closed-banner');
  if (!isStoreOpen()) {
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'store-closed-banner';
      banner.innerHTML = '<i class="fas fa-pause-circle"></i> We are not accepting orders right now — please check back soon.';
      document.body.prepend(banner);
    }
  } else if (banner) banner.remove();
}
let promoCode = '';
try { promoCode = localStorage.getItem('luxe_promo') || ''; } catch (e) {}
if (promoCode && !PROMOS[promoCode]) promoCode = '';
function cartSubtotal() { return cartContents.reduce((s, l) => s + l.price * l.qty, 0); }
function cartDiscount() { const r = PROMOS[promoCode]; return r ? cartSubtotal() * r : 0; }
function promoPctLabel(code) { const p = PROMOS[code]; return p ? Math.round(p * 100) : 0; }
function cartTotal() { return cartSubtotal() - cartDiscount() + cartDelivery(); }
// ---------- Delivery charges (per city, managed in admin Settings) ----------
let checkoutCity = '';
function deliveryCities() {
  try { return JSON.parse(SETTINGS.delivery_cities || '{}') || {}; } catch (e) { return {}; }
}
function baseDeliveryFee() { return Number(SETTINGS.delivery_fee || 0) || 0; }
function deliveryFeeFor(city) {
  const cities = deliveryCities();
  if (city && cities[city] != null) return Number(cities[city]) || 0;
  return baseDeliveryFee();
}
function cartDelivery() { return deliveryFeeFor(checkoutCity); }
function isStoreOpen() { return SETTINGS.store_open !== '0'; }
function cartQty() { return cartContents.reduce((s, l) => s + l.qty, 0); }
async function applyPromo(code) {
  code = String(code || '').trim().toUpperCase();
  try { const fresh = await DB.getPromos().catch(() => null); if (fresh) PROMOS = fresh; } catch (e) {}
  if (PROMOS[code]) {
    promoCode = code;
    try { localStorage.setItem('luxe_promo', code); } catch (e) {}
    return true;
  }
  return false;
}
function removePromo() {
  promoCode = '';
  try { localStorage.removeItem('luxe_promo'); } catch (e) {}
}
function starsHTML(rating) {
  const full = Math.round(rating);
  let s = '';
  for (let i = 1; i <= 5; i++) s += `<i class="fas fa-star${i <= full ? '' : ' dim'}"></i>`;
  return `<span class="card-stars">${s}</span>`;
}
let toastTimer;
function showToast(msg) {
  toastMsg.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}
function closeMenus() { mainNav.classList.remove('active'); mobileMenuToggle.classList.remove('active'); }
function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function validPhone(v) { return /^[0-9+\-\s]{7,15}$/.test(v.trim()); }

// ---------- Motion (GSAP, guarded) ----------
function killTriggers() {
  if (window.ScrollTrigger) ScrollTrigger.getAll().forEach(t => t.kill());
}
function killGridTriggers() {
  if (!window.ScrollTrigger) return;
  ScrollTrigger.getAll().forEach(t => {
    if (t.trigger && t.trigger.closest && t.trigger.closest('#products-grid')) t.kill();
  });
}
function bindReveals(scope) {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const vh = window.innerHeight || 800;
  (scope || document).querySelectorAll('[data-reveal]').forEach(el => {
    const r = el.getBoundingClientRect();
    const inView = r.top < vh * 0.92 && r.bottom > 0;
    if (inView) {
      gsap.from(el, { y: 46, opacity: 0, duration: 1.1, ease: 'power3.out' });
    } else {
      gsap.from(el, {
        y: 46, opacity: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    }
  });
}
function bindParallax() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('[data-parallax]').forEach(el => {
    gsap.to(el, {
      yPercent: parseFloat(el.dataset.parallax) || 12, ease: 'none',
      scrollTrigger: { trigger: el.closest('section, header') || el, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
}
function initMotion() {
  bindReveals(document);
  bindParallax();
  if (window.ScrollTrigger) ScrollTrigger.refresh();
}
function heroIntro() {
  if (!window.gsap) return;
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero-bg', { scale: 1.12, duration: 2.4, ease: 'power2.out' }, 0)
    .from('.hero-eyebrow', { y: 24, opacity: 0, duration: .9 }, .15)
    .from('.hero-title .line', { yPercent: 118, duration: 1.25, stagger: .13 }, .3)
    .from('.hero-sub', { y: 26, opacity: 0, duration: 1 }, .9)
    .from('.hero-cta > *', { y: 24, opacity: 0, duration: .9, stagger: .12 }, 1.05)
    .from('.hero-rail', { opacity: 0, duration: 1.4, stagger: .15 }, 1.15)
    .from('.hero-scroll', { opacity: 0, duration: 1 }, 1.35);
}

// Rotating hero word
let heroRotTimer = null;
function startRotator() {
  const words = ['watches', 'handbags', 'jewelry', 'accessories'];
  let wi = 0;
  if (heroRotTimer) clearInterval(heroRotTimer);
  heroRotTimer = setInterval(() => {
    const el = document.getElementById('hero-rotator');
    if (!el) return;
    el.classList.add('swap');
    setTimeout(() => {
      const live = document.getElementById('hero-rotator');
      if (!live) return;
      wi = (wi + 1) % words.length;
      live.textContent = words[wi];
      live.classList.remove('swap');
    }, 320);
  }, 2600);
}
function stopPageFx() {
  killTriggers();
  removePdpJsonLd();
  if (heroRotTimer) { clearInterval(heroRotTimer); heroRotTimer = null; }
}

// ---------- Preloader ----------
function runPreloader(done) {
  const pre = document.getElementById('preloader');
  const bar = document.getElementById('pre-bar');
  const pct = document.getElementById('pre-pct');
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    pre.classList.add('done');
    document.body.classList.add('loaded');
    done && done();
  };
  let p = 0;
  const t = setInterval(() => {
    p = Math.min(100, p + Math.random() * 22);
    bar.style.transform = `scaleX(${p / 100})`;
    pct.textContent = String(Math.floor(p)).padStart(2, '0');
    if (p >= 100) { clearInterval(t); setTimeout(finish, 250); }
  }, 130);
  setTimeout(() => { clearInterval(t); finish(); }, 3200); // hard fallback
}

// ---------- Recently viewed ----------
function getRecent() { try { return JSON.parse(localStorage.getItem('luxe_recent') || '[]'); } catch (e) { return []; } }
function pushRecent(id) {
  try {
    const r = [Number(id), ...getRecent().filter(x => x !== Number(id))].slice(0, 6);
    localStorage.setItem('luxe_recent', JSON.stringify(r));
  } catch (e) {}
}

// ---------- Product JSON-LD (rich snippets) ----------
function removePdpJsonLd() { const el = document.getElementById('pdp-jsonld'); if (el) el.remove(); }
function setPdpJsonLd(p) {
  removePdpJsonLd();
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.id = 'pdp-jsonld';
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    image: p.images || [p.image],
    description: p.description,
    category: p.category,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PKR',
      price: Number(p.price).toFixed(2),
      availability: (p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock')
    },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.reviews }
  });
  document.head.appendChild(s);
}

// ---------- Cards ----------
function cardHTML(p) {
  const wished = wishlist.includes(p.id) ? ' active' : '';
  const out = (p.stock || 0) <= 0;
  const lowStock = !out && (p.stock || 0) <= 3 ? `<p class="card-stock">Only ${p.stock} left</p>` : '';
  return `
  <article class="card" data-reveal>
    <div class="card-media" data-product="${p.id}" role="link" tabindex="0" aria-label="View ${escapeHtml(p.name)}">
      <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" decoding="async" />
      ${p.badge ? `<span class="card-badge">${escapeHtml(p.badge)}</span>` : ''}
      ${out ? `<span class="card-badge oos">Out of Stock</span>` : ''}
      <button class="card-quick" data-qv="${p.id}">Quick View</button>
    </div>
    <button class="card-wish${wished}" data-wish="${p.id}" aria-label="Toggle wishlist" aria-pressed="${wishlist.includes(p.id)}"><i class="fas fa-heart"></i></button>
    <div class="card-body">
      <h3 data-product="${p.id}" role="link" tabindex="0">${escapeHtml(p.name)}</h3>
      <div>${starsHTML(p.rating)}<small style="color:#8b8578;letter-spacing:1px;margin-left:8px;font-size:12px;">(${p.reviews})</small></div>
      <p class="card-price">${money(p.price)}</p>
      ${lowStock}
      <button class="card-add" data-id="${p.id}"${out ? ' disabled' : ''}>${out ? 'Out of Stock' : 'Add to Bag'}</button>
    </div>
  </article>`;
}

// ---------- Home ----------
function renderHome() {
  const featured = PRODUCTS.slice(0, 4);
  mainContent.innerHTML = `
  <section class="hero" aria-label="Welcome to Luxe Boutique">
    <div class="hero-bg" data-parallax="16"></div>
    <div class="hero-glow"></div>
    <div class="hero-watermark" data-parallax="-8" aria-hidden="true">LUXE</div>
    <div class="hero-shade"></div>
    <div class="hero-grain" aria-hidden="true"></div>
    <aside class="hero-rail left" aria-hidden="true">N°1 · Maison de Luxe</aside>
    <aside class="hero-rail right" aria-hidden="true">Est. 2026 · Pakistan</aside>
    <div class="hero-inner">
      <p class="hero-eyebrow">${escapeHtml(SETTINGS.hero_eyebrow || 'Maison de Luxe · Est. 2026')}</p>
      <h1 class="hero-title">
        <span class="mask"><span class="line">${escapeHtml(SETTINGS.hero_line1 || 'Timeless')}</span></span>
        <span class="mask"><span class="line"><em>${escapeHtml(SETTINGS.hero_line2 || 'Elegance,')}</em></span></span>
        <span class="mask"><span class="line">${escapeHtml(SETTINGS.hero_line3 || 'Worn Daily')}</span></span>
      </h1>
      <p class="hero-sub">Curated <span class="rotator" id="hero-rotator">watches</span>, delivered to your doorstep across Pakistan.</p>
      <div class="hero-cta">
        <a href="#" class="btn-solid" data-page="products">Shop the Collection</a>
        <a href="#" class="btn-ghost" data-page="about">Our Story</a>
      </div>
      <div class="hero-scroll" aria-hidden="true"><span></span></div>
    </div>
  </section>

  <div class="marquee" aria-hidden="true">
    <div class="marquee-track">
      <span>Watches</span><i>◆</i><span>Handbags</span><i>◆</i><span>Jewelry</span><i>◆</i><span>Accessories</span><i>◆</i>
      <span>Watches</span><i>◆</i><span>Handbags</span><i>◆</i><span>Jewelry</span><i>◆</i><span>Accessories</span><i>◆</i>
    </div>
  </div>

  <section class="editorial">
    <div class="editorial-media"><img data-parallax="10" src="https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=1200&auto=format&fit=crop" alt="Craftsmanship" loading="lazy" /></div>
    <div class="editorial-copy">
      <p class="eyebrow" data-reveal>The Craft</p>
      <h2 data-reveal>Chosen slowly.<br /><em>Worn forever.</em></h2>
      <p data-reveal>Every piece in our maison is selected for its craftsmanship: inspected by hand, finished without compromise, and made to outlive trends.</p>
      <div class="stat-row" data-reveal>
        <div class="stat"><b>100%</b><span>Inspected</span></div>
        <div class="stat"><b>7-Day</b><span>Returns</span></div>
        <div class="stat"><b>COD</b><span>Nationwide</span></div>
      </div>
      <a href="#" class="btn-line" data-page="about" data-reveal>Discover the maison</a>
    </div>
  </section>

  <section class="section wrap">
    <div class="section-head" data-reveal>
      <p class="eyebrow">Curated for you</p>
      <h2>The <em>Icons</em></h2>
      <p>Pieces our clients return for</p>
    </div>
    <div class="cards">${featured.map(cardHTML).join('')}</div>
    <div class="center mt" data-reveal><a href="#" class="btn-line" data-page="products">View all pieces</a></div>
  </section>

  <section class="quote-banner">
    <div class="quote-bg" data-parallax="14"></div>
    <div class="quote-inner" data-reveal>
      <blockquote>“Luxury is not the absence of vulgarity: it is the presence of care in every detail.”</blockquote>
      <cite>The Luxe Atelier</cite>
    </div>
  </section>

  ${SETTINGS.sale_enabled === '1' ? `
  <section class="section sale" style="padding-top:110px;padding-bottom:110px;">
    <div class="sale-inner wrap" data-reveal>
      <p class="eyebrow">Limited time</p>
      <h2>The Winter Edit: <em>Flat 25% Off</em></h2>
      <div class="countdown" role="timer" aria-label="Sale ends in">
        <div><b id="cd-d">00</b><span>Days</span></div>
        <div><b id="cd-h">00</b><span>Hours</span></div>
        <div><b id="cd-m">00</b><span>Mins</span></div>
        <div><b id="cd-s">00</b><span>Secs</span></div>
      </div>
      <a href="#" class="btn-solid" data-page="products">Shop the Sale</a>
    </div>
  </section>` : ''}

  <section class="section wrap">
    <div class="section-head" data-reveal>
      <p class="eyebrow">Loved across Pakistan</p>
      <h2>Word of <em>Mouth</em></h2>
    </div>
    <div class="testis">
      ${[
        ['The watch exceeded every expectation. The packaging alone felt like a gift.', 'Ayesha K., Lahore'],
        ['Ordered Monday, wearing it by Thursday. Cash on delivery made it effortless.', 'Danish R., Karachi'],
        ['Finally a local store that actually feels premium. The necklace is stunning.', 'Mahnoor S., Islamabad']
      ].map(([q, w]) => `
        <figure class="testi" data-reveal>
          <div class="card-stars">${'<i class="fas fa-star"></i>'.repeat(5)}</div>
          <blockquote>“${q}”</blockquote>
          <figcaption>${w}</figcaption>
        </figure>`).join('')}
    </div>
  </section>

  <section class="section newsletter">
    <div class="wrap" data-reveal>
      <p class="eyebrow">The inner circle</p>
      <h2>Receive <em>10% off</em> your first order</h2>
      <p>Private previews · Boutique stories · No noise</p>
      <form class="nl-form" id="nl-form" novalidate>
        <input id="nl-email" type="email" placeholder="Your email address" aria-label="Email address" />
        <button type="submit">Join</button>
      </form>
      <p class="nl-code">Members use code <b>WELCOME10</b> for 10% off the first order</p>
    </div>
  </section>`;
  startCountdown();
  startRotator();
}

// ---------- Shop ----------
function getFilteredProducts() {
  let list = PRODUCTS.filter(p => p.visible !== false && (currentFilter === 'all' || p.category === currentFilter));
  if (currentSearch.trim()) {
    const q = currentSearch.trim().toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q));
  }
  if (currentSort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
  else if (currentSort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
  else if (currentSort === 'name-asc') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  return list;
}
function productGridHTML(list) {
  return list.length ? list.map(cardHTML).join('') : '<p class="d-empty">No pieces match your search.</p>';
}
function renderProducts() {
  const cats = ['all', ...new Set(PRODUCTS.map(p => p.category))];

  mainContent.innerHTML = `
  <section class="shop-head">
    <p data-reveal>The Collection</p>
    <h1 data-reveal>All <em>Pieces</em></h1>
  </section>
  <div class="filters">
    <div class="f-group"><label for="filter-category">Category</label>
      <select id="filter-category">${cats.map(c => `<option value="${c}"${c === currentFilter ? ' selected' : ''}>${capitalize(c)}</option>`).join('')}</select>
    </div>
    <div class="f-group"><label for="sort-products">Sort</label>
      <select id="sort-products">
        <option value="default"${currentSort === 'default' ? ' selected' : ''}>Featured</option>
        <option value="price-asc"${currentSort === 'price-asc' ? ' selected' : ''}>Price ↑</option>
        <option value="price-desc"${currentSort === 'price-desc' ? ' selected' : ''}>Price ↓</option>
        <option value="name-asc"${currentSort === 'name-asc' ? ' selected' : ''}>A–Z</option>
      </select>
    </div>
    <div class="f-group"><label for="search-products">Search</label>
      <input id="search-products" type="search" placeholder="Search pieces…" value="${escapeHtml(currentSearch)}" />
    </div>
  </div>
  <section class="shop-grid wrap">
    <div class="cards" id="products-grid">${productGridHTML(getFilteredProducts())}</div>
  </section>`;
}

// ---------- Product detail ----------
async function renderProductDetail(id) {
  const p = await DB.getProduct(id);
  if (!p) { renderPage('products'); return; }
  stopPageFx();
  closeMenus();
  closeDrawers();
  document.body.classList.add('solid-header'); // PDP starts on light bg: keep header readable
  pushRecent(p.id);
  setPdpJsonLd(p);
  const recentIds = getRecent().filter(rid => rid !== p.id);
  let related = recentIds.map(rid => PRODUCTS.find(x => x.id === rid)).filter(Boolean);
  const catFill = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id && !related.some(r => r.id === x.id));
  related = [...related, ...catFill].slice(0, 4);
  if (!related.length) related = PRODUCTS.filter(x => x.id !== p.id).slice(0, 4);
  const wished = wishlist.includes(p.id) ? ' active' : '';
  const gallery = p.images && p.images.length ? p.images : [p.image];
  const stockHTML = (p.stock || 0) <= 5
    ? `<p class="stock-line low"><i class="fas fa-bolt"></i> Only ${p.stock} left in the atelier</p>`
    : `<p class="stock-line ok"><i class="fas fa-check"></i> In the atelier, ships within 24 hours</p>`;

  mainContent.innerHTML = `
  <div class="pdp-wrap">
    <nav class="crumb" aria-label="Breadcrumb">
      <a href="#" data-page="home">Home</a><span class="sep">/</span>
      <a href="#" data-page="products">${capitalize(p.category)}</a><span class="sep">/</span>
      <span>${escapeHtml(p.name)}</span>
    </nav>
    <section class="pdp">
      <div class="pdp-media">
        <div class="frame"><img id="pdp-main-img" src="${gallery[0]}" alt="${escapeHtml(p.name)}" decoding="async" /><span class="pdp-zoom-hint" aria-hidden="true"><i class="fas fa-search-plus"></i> Tap to zoom</span></div>
        <div class="pdp-thumbs" aria-label="Product images">
          ${gallery.map((src, i) => `<button type="button" class="${i === 0 ? 'active' : ''}" data-thumb="${i}" aria-label="View image ${i + 1}"><img src="${src}" alt="" loading="lazy" decoding="async" /></button>`).join('')}
        </div>
      </div>
      <div class="pdp-info">
        ${p.badge ? `<span class="pdp-badge">${escapeHtml(p.badge)}</span>` : ''}
        <h1>${escapeHtml(p.name)}</h1>
        <div class="pdp-rating">${starsHTML(p.rating)} <span>${p.rating.toFixed(1)} · ${p.reviews} reviews</span></div>
        <p class="pdp-price">${money(p.price)}</p>
        ${stockHTML}
        <p class="pdp-desc">${escapeHtml(p.description)}</p>
        <div class="pdp-buy">
          <div class="qty">
            <button type="button" id="qty-minus" aria-label="Decrease quantity">−</button>
            <input id="pdp-qty" type="number" value="1" min="1" max="10" readonly aria-label="Quantity" />
            <button type="button" id="qty-plus" aria-label="Increase quantity">+</button>
          </div>
          <button class="btn-solid" id="pdp-add"${(p.stock || 0) <= 0 ? ' disabled' : ''}>${(p.stock || 0) <= 0 ? 'Out of Stock' : 'Add to Bag'}</button>
          <button class="pdp-wish${wished}" data-wish="${p.id}" aria-label="Toggle wishlist"><i class="fas fa-heart"></i></button>
        </div>
        <div class="pdp-meta">
          <div><i class="fas fa-truck"></i> Complimentary delivery across Pakistan</div>
          <div><i class="fas fa-money-bill-wave"></i> Cash on delivery available</div>
          <div><i class="fas fa-undo"></i> 7-day easy returns, no questions asked</div>
        </div>
        <div class="acc">
          <div class="acc-item">
            <button class="acc-head" type="button">Details <i class="fas fa-chevron-down"></i></button>
            <div class="acc-body"><p>${escapeHtml(p.description)} Each piece is inspected by our atelier before dispatch and arrives in signature Luxe Boutique packaging.</p></div>
          </div>
          <div class="acc-item">
            <button class="acc-head" type="button">Shipping & Returns <i class="fas fa-chevron-down"></i></button>
            <div class="acc-body"><p>Orders ship within 24 hours, Monday to Saturday. Delivery takes 2–4 working days nationwide. Not in love? Return it within 7 days for a full refund.</p></div>
          </div>
        </div>
      </div>
    </section>
    <section class="related">
      <div class="section-head"><p class="eyebrow">Continue exploring</p><h2>You May Also <em>Adore</em></h2></div>
      <div class="cards">${related.map(cardHTML).join('')}</div>
    </section>
  </div>`;
  jumpTop();

  const qtyInput = document.getElementById('pdp-qty');
  const maxQty = Math.min(p.stock || 10, 10);
  document.getElementById('qty-minus').addEventListener('click', () => { qtyInput.value = Math.max(1, parseInt(qtyInput.value, 10) - 1); });
  document.getElementById('qty-plus').addEventListener('click', () => { qtyInput.value = Math.min(maxQty, parseInt(qtyInput.value, 10) + 1); });
  document.getElementById('pdp-add').addEventListener('click', () => addToCart(p.id, parseInt(qtyInput.value, 10) || 1));
  const mainImg = document.getElementById('pdp-main-img');
  // Circular magnifier lens on the main image (desktop hover only)
  const pdpFrame = mainImg.closest('.frame');
  const lens = document.createElement('div');
  lens.className = 'zoom-lens';
  lens.setAttribute('aria-hidden', 'true');
  pdpFrame.appendChild(lens);
  const LENS_SIZE = 180, LENS_ZOOM = 2.2;
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    pdpFrame.addEventListener('mousemove', e => {
      const r = pdpFrame.getBoundingClientRect();
      let x = e.clientX - r.left, y = e.clientY - r.top;
      x = Math.max(0, Math.min(x, r.width)); y = Math.max(0, Math.min(y, r.height));
      const nw = mainImg.naturalWidth, nh = mainImg.naturalHeight;
      if (!nw || !nh) return;
      const scale = Math.max(r.width / nw, r.height / nh); // matches object-fit: cover
      const dw = nw * scale, dh = nh * scale;
      const ox = (r.width - dw) / 2, oy = (r.height - dh) / 2; // cover centers the image
      lens.style.display = 'block';
      lens.style.backgroundImage = `url("${mainImg.currentSrc || mainImg.src}")`;
      lens.style.backgroundSize = `${dw * LENS_ZOOM}px ${dh * LENS_ZOOM}px`;
      lens.style.backgroundPosition = `-${(x - ox) * LENS_ZOOM - LENS_SIZE / 2}px -${(y - oy) * LENS_ZOOM - LENS_SIZE / 2}px`;
      lens.style.left = (x - LENS_SIZE / 2) + 'px';
      lens.style.top = (y - LENS_SIZE / 2) + 'px';
    });
    pdpFrame.addEventListener('mouseleave', () => { lens.style.display = 'none'; });
  }
  document.querySelectorAll('[data-thumb]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-thumb]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const src = gallery[parseInt(btn.getAttribute('data-thumb'), 10)];
    mainImg.style.opacity = '0';
    setTimeout(() => { mainImg.src = src; mainImg.onload = () => { mainImg.style.opacity = '1'; }; setTimeout(() => { mainImg.style.opacity = '1'; }, 400); }, 180);
  }));
  document.querySelectorAll('.acc-head').forEach(h => h.addEventListener('click', () => {
    const item = h.parentElement;
    const body = item.querySelector('.acc-body');
    const open = item.classList.toggle('open');
    body.style.maxHeight = open ? body.scrollHeight + 'px' : '0';
  }));
  initMotion();
}

// ---------- Static pages ----------
function renderAbout() {
  mainContent.innerHTML = `
  <section class="page-hero"><p data-reveal>The Boutique</p><h1 data-reveal>Our <em>Story</em></h1></section>
  <section class="page-body">
    <div class="about-split">
      <img data-reveal src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&auto=format&fit=crop" alt="Luxe Boutique atelier" loading="lazy" />
      <div>
        <p class="eyebrow" data-reveal>Est. 2026 · Pakistan</p>
        <h2 data-reveal>Luxury, <em>without</em> the distance.</h2>
        <p data-reveal>We started Luxe Boutique with a simple frustration: true luxury felt out of reach at home. So we built a maison that curates the world's finest watches, handbags and jewelry, delivered to your doorstep, anywhere in Pakistan.</p>
        <p data-reveal>Every piece is chosen slowly, inspected by hand, and backed by our 7-day promise. No noise, no compromises: just objects worth keeping.</p>
        <a href="#" class="btn-line" data-page="products" data-reveal>Explore the collection</a>
      </div>
    </div>
    <div class="values">
      <div class="value" data-reveal><h3>Craftsmanship</h3><p>We choose products for their make: materials, finish, and the hands behind them.</p></div>
      <div class="value" data-reveal><h3>Honesty</h3><ul><li>Cash on delivery, nationwide</li><li>Clear 7-day returns</li><li>Real human support</li></ul></div>
      <div class="value" data-reveal><h3>Timelessness</h3><p>We don't chase seasons. We collect pieces you'll still love in ten years.</p></div>
    </div>
  </section>`;
}

function renderContact() {
  mainContent.innerHTML = `
  <section class="page-hero"><p data-reveal>We reply within 24 hours</p><h1 data-reveal>Contact <em>Us</em></h1></section>
  <section class="page-body">
    <div class="contact-grid">
      <div class="contact-card" data-reveal>
        <h3>Client Care</h3>
        <p><a href="mailto:${escapeHtml(SETTINGS.store_email || 'ghulamghous208@gmail.com')}">${escapeHtml(SETTINGS.store_email || 'ghulamghous208@gmail.com')}</a></p>
        <p><a href="tel:${escapeHtml((SETTINGS.store_phone || '+92 318-1654176').replace(/\D/g, ''))}">${escapeHtml(SETTINGS.store_phone || '+92 318-1654176')}</a></p>
        <p>Mon–Fri · 9:00–17:00 PKT</p>
      </div>
      <div class="contact-card" data-reveal>
        <h3>Visit Us</h3>
        <p>${escapeHtml(SETTINGS.store_address || 'Rajana Road Kamalia, District Toba Tek Singh, Pakistan').replace(/, /g, ',<br />')}</p>
      </div>
      <div class="contact-card" data-reveal>
        <h3>Write to Us</h3>
        <form id="contact-form" novalidate>
          <div class="field"><label for="contact-name">Name</label><input id="contact-name" type="text" placeholder="Your name" required /></div>
          <div class="field"><label for="contact-email">Email</label><input id="contact-email" type="email" placeholder="Your email" required /></div>
          <div class="field"><label for="contact-message">Message</label><textarea id="contact-message" rows="3" placeholder="How can we help?" required></textarea></div>
          <button type="submit" class="btn-solid w-full">Send Message</button>
        </form>
      </div>
    </div>
  </section>`;
}

function renderTrack() {
  mainContent.innerHTML = `
  <section class="page-hero"><p data-reveal>Where is my order?</p><h1 data-reveal>Track <em>Order</em></h1></section>
  <section class="page-body">
    <div class="paper" data-reveal>
      <form id="track-form" novalidate>
        <div class="field"><label for="track-number">Order Number</label><input id="track-number" type="text" placeholder="e.g. LB-2026-4821" style="text-transform:uppercase;letter-spacing:.1em;" /></div>
        <button type="submit" class="btn-solid w-full">Track Order</button>
      </form>
      <div id="track-result" style="margin-top:36px;"></div>
    </div>
  </section>`;
}

function orderTimelineHTML(order) {
  const steps = ['Placed', 'Confirmed', 'Shipped', 'Delivered'];
  const idx = { placed: 0, confirmed: 1, shipped: 2, delivered: 3 }[order.status] ?? 0;
  return `
    <div class="order-head" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:8px;">
      <div><strong style="font-family:var(--serif);font-size:22px;">${escapeHtml(order.number)}</strong><br /><span style="font-size:12px;color:var(--stone);letter-spacing:.1em;">${escapeHtml(order.date)}</span></div>
      <span class="order-status" style="background:#eef7ee;color:#2e7d32;padding:8px 20px;border-radius:50px;font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;">${capitalize(order.status)}</span>
    </div>
    <div class="timeline">
      ${steps.map((s, i) => `<div class="t-step${i <= idx ? ' done' : ''}"><span class="t-dot"></span><span>${s}</span></div>`).join('')}
    </div>
    <ul class="o-lines">
      ${order.items.map(it => `<li><span>${escapeHtml(it.name)} <em>× ${it.qty || 1}</em></span><span>${money(it.price * (it.qty || 1))}</span></li>`).join('')}
    </ul>
    ${order.discount > 0 ? `<div class="sum-row"><span>Promo ${escapeHtml(order.promo || '')} (−${order.subtotal ? Math.round(order.discount / order.subtotal * 100) : 0}%)</span><span>−${money(order.discount)}</span></div>` : ''}
    ${(order.delivery || 0) > 0 ? `<div class="sum-row"><span>Delivery</span><span>${money(order.delivery)}</span></div>` : ''}
    <div class="sum-row grand" style="border-top:1px solid var(--line);padding-top:16px;"><span>Total (COD)</span><span>${money(order.total)}</span></div>`;
}

function renderCheckout() {
  if (!cartContents.length) { renderPage('home'); showToast('Your bag is empty'); return; }
  if (!isStoreOpen()) {
    mainContent.innerHTML = `
    <section class="page-hero"><p data-reveal>Almost yours</p><h1 data-reveal>Check<em>out</em></h1></section>
    <section class="page-body"><div class="paper" style="text-align:center;" data-reveal>
      <p class="eyebrow" style="text-align:center;">Paused</p>
      <h2 style="font-family:var(--serif);font-weight:500;">We are not accepting orders right now</h2>
      <p style="color:#57534a;max-width:420px;margin:0 auto 30px;">Please check back soon. Your bag is saved.</p>
      <button class="btn-solid" id="checkout-cancel">Continue Shopping</button>
    </div></section>`;
    return;
  }
  const cities = Object.keys(deliveryCities());
  mainContent.innerHTML = `
  <section class="page-hero"><p data-reveal>Almost yours</p><h1 data-reveal>Check<em>out</em></h1></section>
  <section class="page-body">
    <div class="paper" data-reveal>
      <div class="cod-line"><i class="fas fa-money-bill-wave"></i><span><strong>Cash on Delivery.</strong> Pay in cash when your order arrives, no advance payment, no cards.</span></div>
      <div class="sum">
        <ul class="o-lines">
          ${cartContents.map(l => `<li><span>${escapeHtml(l.name)} <em>× ${l.qty}</em></span><span>${money(l.price * l.qty)}</span></li>`).join('')}
        </ul>
        <div class="sum-row"><span>Subtotal</span><span id="sum-subtotal">${money(cartSubtotal())}</span></div>
        <div class="sum-row" id="sum-promo-row" style="${promoCode ? '' : 'display:none;'}"><span id="sum-promo-label">Promo ${escapeHtml(promoCode)} (−${promoPctLabel(promoCode)}%) <button type="button" id="promo-remove" class="link-btn">remove</button></span><span id="sum-discount">−${money(cartDiscount())}</span></div>
        <div class="sum-row"><span>Delivery</span><span id="sum-delivery">${money(cartDelivery())}</span></div>
        <div class="sum-row grand"><span>Total</span><span id="sum-grand">${money(cartTotal())}</span></div>
      </div>
      <div class="promo-field">
        <input id="promo-code" type="text" placeholder="Promo code: try WELCOME10" value="${escapeHtml(promoCode)}" aria-label="Promo code" />
        <button type="button" id="promo-apply" class="btn-line">Apply</button>
      </div>
      <form id="checkout-form" novalidate>
        <div class="field"><label for="co-name">Full Name</label><input id="co-name" type="text" placeholder="Your name" required /></div>
        <div class="field"><label for="co-phone">Phone Number</label><input id="co-phone" type="tel" placeholder="03XX-XXXXXXX" required /></div>
        <div class="field"><label for="co-email">Email <span class="opt">(optional)</span></label><input id="co-email" type="email" placeholder="you@example.com" /></div>
        <div class="field"><label for="co-city">City</label>
          <select id="co-city" required>
            <option value="">Select your city…</option>
            ${cities.map(c => `<option value="${escapeHtml(c)}"${c === checkoutCity ? ' selected' : ''}>${escapeHtml(c)} — ${money(deliveryFeeFor(c))} delivery</option>`).join('')}
            <option value="__other"${checkoutCity === '__other' ? ' selected' : ''}>Other city — ${money(baseDeliveryFee())} delivery</option>
          </select>
        </div>
        <div class="field"><label for="co-address">Complete Address</label><input id="co-address" type="text" placeholder="House, street, area" required /></div>
        <div class="field"><label for="co-notes">Order Notes <span class="opt">(optional)</span></label><input id="co-notes" type="text" placeholder="Anything we should know?" /></div>
        <button type="submit" class="btn-solid w-full" id="place-order-btn">Place Order: ${money(cartTotal())} COD</button>
        <button type="button" id="checkout-cancel" class="ghost-dark">Cancel</button>
      </form>
    </div>
  </section>`;
}

function refreshCheckoutTotals() {
  const row = document.getElementById('sum-promo-row');
  if (!row) return;
  if (promoCode) {
    row.style.display = '';
    document.getElementById('sum-promo-label').innerHTML = `Promo ${escapeHtml(promoCode)} (−${promoPctLabel(promoCode)}%) <button type="button" id="promo-remove" class="link-btn">remove</button>`;
    document.getElementById('sum-discount').textContent = '−' + money(cartDiscount());
  } else {
    row.style.display = 'none';
  }
  const inp = document.getElementById('promo-code');
  if (inp) inp.value = promoCode;
  document.getElementById('sum-subtotal').textContent = money(cartSubtotal());
  document.getElementById('sum-grand').textContent = money(cartTotal());
  const delEl = document.getElementById('sum-delivery');
  if (delEl) delEl.textContent = money(cartDelivery());
  document.getElementById('place-order-btn').textContent = `Place Order: ${money(cartTotal())} COD`;
}

function renderOrderSuccess(order) {
  stopPageFx();
  closeDrawers();
  mainContent.innerHTML = `
  <section class="page-hero"><p data-reveal>Merci</p><h1 data-reveal>Order <em>Placed</em></h1></section>
  <section class="page-body">
    <div class="paper" style="text-align:center;" data-reveal>
      <div class="success-mark"><i class="fas fa-check"></i></div>
      <p class="eyebrow" style="text-align:center;">Thank you, ${escapeHtml(order.name.split(' ')[0])}</p>
      <div class="order-no">${escapeHtml(order.number)}</div>
      <p style="color:#57534a;max-width:420px;margin:0 auto 34px;">We will call you shortly to confirm. Please keep <strong>${money(order.total)}</strong> ready in cash on delivery.</p>
      <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;">
        <a href="#" class="btn-solid" data-page="track">Track Order</a>
        <a href="#" class="ghost-dark" data-page="products" style="width:auto;padding:16px 34px;">Continue Shopping</a>
      </div>
    </div>
  </section>`;
}

function jumpTop() {
  const de = document.documentElement;
  const prev = de.style.scrollBehavior;
  de.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  de.style.scrollBehavior = prev;
  // Re-assert after paint: defeats anything (late layout shifts, animation
  // refresh) that yanks the scroll position back down after a route change.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (window.scrollY > 60) {
      const p2 = de.style.scrollBehavior;
      de.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      de.style.scrollBehavior = p2;
    }
  }));
}
function renderPage(page) {
  stopPageFx();
  closeMenus();
  closeDrawers();
  document.body.classList.remove('solid-header');
  document.body.classList.remove('is-admin');
  switch (page) {
    case 'home': renderHome(); break;
    case 'products': renderProducts(); break;
    case 'about': renderAbout(); break;
    case 'contact': renderContact(); break;
    case 'track': renderTrack(); break;
    case 'checkout': renderCheckout(); break;
    case 'admin': renderAdmin(); break;
    default: renderHome();
  }
  jumpTop();
  initMotion();
  if (page === 'home') {
    const pre = document.getElementById('preloader');
    if (pre && pre.classList.contains('done')) setTimeout(heroIntro, 60);
  }
}

// ---------- Bag ----------
function addToCart(id, qty = 1, silent = false) {
  const p = PRODUCTS.find(x => x.id === Number(id));
  if (!p) return;
  if (!isStoreOpen()) { showToast('We are not accepting orders right now'); return; }
  if ((p.stock || 0) <= 0) { showToast('This piece is out of stock'); return; }
  const line = cartContents.find(l => l.id === p.id);
  const cur = line ? line.qty : 0;
  const maxAdd = Math.min(p.stock || 10, 10) - cur;
  const add = Math.min(qty, maxAdd);
  if (add <= 0) { showToast(`Only ${p.stock || 10} available`); return; }
  if (line) line.qty += add;
  else cartContents.push({ ...p, qty: add });
  saveCart(); updateCart();
  if (!silent) { openDrawer(cart); showToast('Added to your bag'); }
}
function changeQty(id, delta) {
  const line = cartContents.find(l => l.id === Number(id));
  if (!line) return;
  const p = PRODUCTS.find(x => x.id === line.id);
  line.qty = Math.max(1, Math.min(line.qty + delta, p ? (p.stock || 10) : 10, 10));
  saveCart(); updateCart();
}
function removeLine(id) {
  cartContents = cartContents.filter(l => l.id !== Number(id));
  saveCart(); updateCart();
}
function updateCart() {
  const qty = cartQty();
  cartCount.textContent = qty;
  drawerCartCount.textContent = qty ? `(${qty})` : '';
  const sub = cartSubtotal(), disc = cartDiscount(), total = cartTotal();
  cartTotalEl.textContent = money(total).replace('Rs. ', '');
  cartItemsEl.innerHTML = cartContents.length === 0
    ? '<p class="d-empty">Your bag is empty.<br />Beautiful things await.</p>'
    : cartContents.map(l => `
      <div class="d-item">
        <img src="${l.image}" alt="${escapeHtml(l.name)}" loading="lazy" decoding="async" />
        <div class="d-info">
          <strong>${escapeHtml(l.name)}</strong>
          <span class="d-price">${money(l.price)}</span>
          <div class="d-qty">
            <button data-dec="${l.id}" aria-label="Decrease quantity">−</button>
            <span>${l.qty}</span>
            <button data-inc="${l.id}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="d-right">
          <span class="d-line-total">${money(l.price * l.qty)}</span>
          <button class="d-rm" data-rm-id="${l.id}" aria-label="Remove"><i class="fas fa-times"></i></button>
        </div>
      </div>`).join('')
      + (disc > 0 ? `<div class="d-promo-row"><span>Promo ${escapeHtml(promoCode)} (−${promoPctLabel(promoCode)}%)</span><span>−${money(disc)}</span></div>` : '');
  const foot = document.querySelector('#cart .drawer-foot');
  if (foot) foot.style.display = cartContents.length ? '' : 'none';
}

// ---------- Wishlist ----------
function toggleWishlist(id) {
  id = Number(id);
  const i = wishlist.indexOf(id);
  if (i >= 0) { wishlist.splice(i, 1); showToast('Removed from wishlist'); }
  else { wishlist.push(id); showToast('Saved to your wishlist'); }
  saveWishlist(); updateWishlist();
  document.querySelectorAll(`[data-wish="${id}"]`).forEach(b => {
    b.classList.toggle('active', wishlist.includes(id));
    b.setAttribute('aria-pressed', wishlist.includes(id));
  });
}
function updateWishlist() {
  wishlistCount.textContent = wishlist.length;
  const items = wishlist.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  wishlistItemsEl.innerHTML = items.length === 0
    ? '<p class="d-empty">Your wishlist is empty.<br />Tap the heart on any piece to save it here.</p>'
    : items.map(p => `
      <div class="d-item">
        <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" />
        <div class="d-info"><strong>${escapeHtml(p.name)}</strong><span class="d-price">${money(p.price)}</span></div>
        <div class="d-actions">
          <button class="d-mini" data-move-bag="${p.id}">Bag</button>
          <button class="d-mini" data-wish="${p.id}">Remove</button>
        </div>
      </div>`).join('');
}

// ---------- Focus trap (keyboard / screen-reader users) ----------
let lastFocus = null;
function trapTab(e, container) {
  if (e.key !== 'Tab' || !container) return;
  const f = Array.from(container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
    .filter(el => !el.disabled && el.getClientRects().length > 0);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  if (quickview.classList.contains('open')) trapTab(e, quickview.querySelector('.qv-box'));
  else if (cart.classList.contains('open')) trapTab(e, cart);
  else if (wishlistDrawer.classList.contains('open')) trapTab(e, wishlistDrawer);
});

// ---------- Drawers ----------
function openDrawer(el) {
  lastFocus = document.activeElement;
  el.classList.add('open');
  el.setAttribute('aria-hidden', 'false');
  document.body.classList.add('drawer-open');
  document.body.style.overflow = 'hidden';
  const c = el.querySelector('.drawer-close');
  if (c) c.focus();
}
function closeDrawers() {
  const wasOpen = cart.classList.contains('open') || wishlistDrawer.classList.contains('open');
  [cart, wishlistDrawer].forEach(el => { el.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); });
  document.body.classList.remove('drawer-open');
  document.body.style.overflow = '';
  if (wasOpen && lastFocus && document.contains(lastFocus)) lastFocus.focus();
}

// ---------- Quick view ----------
let qvId = null;
function openQuickView(id) {
  const p = PRODUCTS.find(x => x.id === Number(id));
  if (!p) return;
  qvId = p.id;
  document.getElementById('qv-img').src = p.image;
  document.getElementById('qv-img').alt = p.name;
  document.getElementById('qv-name').textContent = p.name;
  document.getElementById('qv-rating').innerHTML = `${starsHTML(p.rating)} <span>${p.rating.toFixed(1)} · ${p.reviews} reviews</span>`;
  document.getElementById('qv-price').textContent = money(p.price);
  document.getElementById('qv-desc').textContent = p.description;
  document.getElementById('qv-full').setAttribute('data-product', p.id);
  lastFocus = document.activeElement;
  quickview.classList.add('open');
  document.body.style.overflow = 'hidden';
  const qc = quickview.querySelector('.qv-close');
  if (qc) qc.focus();
}
function closeQuickView() {
  const wasOpen = quickview.classList.contains('open');
  quickview.classList.remove('open');
  if (!document.body.classList.contains('drawer-open')) document.body.style.overflow = '';
  if (wasOpen && lastFocus && document.contains(lastFocus)) lastFocus.focus();
}
// Mobile tap-to-zoom lightbox (touch devices only; desktop uses the hover lens)
const isTouchDevice = () => window.matchMedia('(hover: none), (pointer: coarse)').matches;
let zlLastTap = 0;
function openZoomLightbox() {
  const mainImg = document.getElementById('pdp-main-img');
  if (!mainImg) return;
  const zi = document.getElementById('zl-img');
  zi.src = mainImg.src;
  zi.alt = mainImg.alt || 'Zoomed product image';
  zi.classList.remove('zl-zoomed');
  document.getElementById('zl-scroll').scrollTo(0, 0);
  document.getElementById('zoom-lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeZoomLightbox() {
  document.getElementById('zoom-lightbox').classList.remove('open');
  if (!document.body.classList.contains('drawer-open')) document.body.style.overflow = '';
}

// ---------- Countdown ----------
let cdTimer = null;
function startCountdown() {
  clearInterval(cdTimer);
  let end = 0;
  if (SETTINGS.sale_ends_at) {
    const t = Date.parse(SETTINGS.sale_ends_at);
    if (!isNaN(t) && t > Date.now()) end = t;
  }
  if (!end) {
    end = Number(localStorage.getItem('luxe_sale_end') || 0);
    if (!end || end < Date.now()) {
      end = Date.now() + (2 * 24 * 3600 + 14 * 3600 + 22 * 60) * 1000;
      localStorage.setItem('luxe_sale_end', String(end));
    }
  }
  const pad = n => String(n).padStart(2, '0');
  const tick = () => {
    const dEl = document.getElementById('cd-d');
    if (!dEl) { clearInterval(cdTimer); return; }
    const s = Math.max(0, Math.floor((end - Date.now()) / 1000));
    dEl.textContent = pad(Math.floor(s / 86400));
    document.getElementById('cd-h').textContent = pad(Math.floor(s % 86400 / 3600));
    document.getElementById('cd-m').textContent = pad(Math.floor(s % 3600 / 60));
    document.getElementById('cd-s').textContent = pad(s % 60);
  };
  tick();
  cdTimer = setInterval(tick, 1000);
}

// ---------- Orders ----------
function makeOrderNumber() { return 'LB-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000); }

// ---------- Admin dashboard ----------
let adminToken = null;
let adminTab = 'overview';
let adminOrdersCache = [];
let adminNlCache = [];
let adminPromoCache = [];
let adminMsgCache = [];
let adminOrderFilter = 'all';
let adminOrderSearch = '';

function renderAdmin() {
  stopPageFx();
  closeMenus();
  closeDrawers();
  document.body.classList.add('solid-header');
  document.body.classList.add('is-admin');
  jumpTop();

  if (!adminToken) {
    try {
      const s = JSON.parse(sessionStorage.getItem('luxe_admin') || 'null');
      if (s && s.token && Date.now() - (s.ts || 0) < 12 * 3600 * 1000) adminToken = s.token;
    } catch (e) {}
  }

  if (!adminToken) {
    mainContent.innerHTML = `
    <section class="page-hero"><p>Private</p><h1>Atelier <em>Admin</em></h1></section>
    <section class="page-body">
      <div class="paper">
        <p class="eyebrow" style="text-align:center;">Restricted area</p>
        <form id="admin-login-form" novalidate>
          ${USE_SUPABASE ? `
          <div class="field"><label for="admin-email">Admin Email</label><input id="admin-email" type="email" placeholder="you@example.com" required /></div>
          <div class="field"><label for="admin-pass">Password</label><input id="admin-pass" type="password" placeholder="••••••••" required /></div>` : `
          <div class="field"><label for="admin-pass">Password</label><input id="admin-pass" type="password" placeholder="Demo password" required /></div>
          <p class="admin-hint">Demo mode: password is <b>luxe-admin</b>.<br/>Connect Supabase in script.js for real admin logins.</p>`}
          <button type="submit" class="btn-solid w-full">Sign In</button>
          <p class="admin-err" id="admin-err"></p>
        </form>
      </div>
    </section>`;
    initMotion();
    return;
  }

  const navItems = [
    ['overview', 'Overview', 'fa-chart-pie'],
    ['orders', 'Orders', 'fa-bag-shopping'],
    ['products', 'Products', 'fa-gem'],
    ['customers', 'Customers', 'fa-users'],
    ['promos', 'Promos', 'fa-tag'],
    ['content', 'Content', 'fa-pen-nib'],
    ['messages', 'Messages', 'fa-envelope'],
    ['newsletter', 'Newsletter', 'fa-paper-plane'],
    ['settings', 'Settings', 'fa-gear']
  ];
  mainContent.innerHTML = `
  <section class="admin-shell">
    <div class="admin-scrim" id="admin-scrim"></div>
    <aside class="admin-side" id="admin-side">
      <div class="admin-brand"><span class="ab-luxe">LUXE</span><span class="ab-sub">BOUTIQUE · ATELIER</span></div>
      <nav class="admin-nav">
        ${navItems.map(([k, l, ic]) => `
        <button data-atab="${k}" class="${k === adminTab ? 'active' : ''}">
          <i class="fas ${ic}"></i><span>${l}</span><em class="nav-badge" data-navbadge="${k}"></em>
        </button>`).join('')}
      </nav>
      <div class="admin-side-foot">
        <a href="#/" class="as-link"><i class="fas fa-store"></i><span>View store</span></a>
        <button id="admin-logout" class="as-link"><i class="fas fa-right-from-bracket"></i><span>Sign out</span></button>
      </div>
    </aside>
    <div class="admin-main">
      <header class="admin-topbar">
        <button id="admin-menu-btn" aria-label="Menu"><i class="fas fa-bars"></i></button>
        <h2 id="admin-page-title">${navItems.find(n => n[0] === adminTab)?.[1] || 'Overview'}</h2>
        <div class="admin-topbar-right">
          <div class="admin-search">
            <i class="fas fa-search"></i>
            <input id="admin-global-search" type="search" placeholder="Search orders, products, customers…" autocomplete="off" aria-label="Global search" />
            <div id="admin-search-results"></div>
          </div>
          <span class="admin-mode ${USE_SUPABASE ? 'live' : ''}">${USE_SUPABASE ? '● Live' : '● Demo'}</span>
        </div>
      </header>
      <div class="admin-body" id="admin-content"><p class="d-empty">Loading…</p></div>
    </div>
  </section>
  <div class="order-drawer-scrim" id="order-drawer-scrim"></div>
  <aside class="order-drawer" id="order-drawer" aria-label="Order details"></aside>`;
  jumpTop();
  initMotion();
  loadAdminData();
}

// ---------- Global admin search ----------
function renderAdminSearch(q) {
  const box = document.getElementById('admin-search-results');
  if (!box) return;
  q = String(q || '').trim().toLowerCase();
  if (q.length < 2) { box.classList.remove('open'); box.innerHTML = ''; return; }
  let html = '';
  const orders = (adminOrdersCache || []).filter(o =>
    `${o.number} ${o.name} ${o.phone}`.toLowerCase().includes(q)).slice(0, 4);
  if (orders.length) {
    html += '<div class="sr-group">Orders</div>' + orders.map(o => `
      <button class="sr-item" data-sr="order:${escapeHtml(o.number)}">
        <i class="fas fa-bag-shopping"></i>
        <span><strong>${escapeHtml(o.number)}</strong><small>${escapeHtml(o.name || '')} · ${money(o.total || 0)}</small></span>
      </button>`).join('');
  }
  const prods = PRODUCTS.filter(p => p.name.toLowerCase().includes(q)).slice(0, 3);
  if (prods.length) {
    html += '<div class="sr-group">Products</div>' + prods.map(p => `
      <button class="sr-item" data-sr="product:${p.id}">
        <i class="fas fa-gem"></i>
        <span><strong>${escapeHtml(p.name)}</strong><small>${money(p.price)} · Stock ${p.stock || 0}</small></span>
      </button>`).join('');
  }
  const seen = {};
  const custs = [];
  (adminOrdersCache || []).forEach(o => {
    const key = String(o.phone || '').replace(/\D/g, '');
    if (!key || seen[key]) return;
    if (`${o.name} ${o.phone}`.toLowerCase().includes(q)) { seen[key] = 1; custs.push(o); }
  });
  if (custs.length) {
    html += '<div class="sr-group">Customers</div>' + custs.slice(0, 3).map(o => `
      <button class="sr-item" data-sr="customer:${escapeHtml(String(o.phone || '').replace(/\D/g, ''))}">
        <i class="fas fa-user"></i>
        <span><strong>${escapeHtml(o.name || '-')}</strong><small>${escapeHtml(o.phone || '')}</small></span>
      </button>`).join('');
  }
  box.innerHTML = html || '<div class="sr-empty">No matches found.</div>';
  box.classList.add('open');
}
function handleSearchSelect(el) {
  const [type, val] = el.getAttribute('data-sr').split(':');
  const inp = document.getElementById('admin-global-search');
  const box = document.getElementById('admin-search-results');
  if (inp) inp.value = '';
  if (box) { box.classList.remove('open'); box.innerHTML = ''; }
  if (type === 'order') { adminTab = 'orders'; adminOrderFilter = 'all'; adminOrderSearch = val; }
  else if (type === 'product') { adminTab = 'products'; }
  else if (type === 'customer') { adminTab = 'customers'; }
  renderAdminTab();
  if (type === 'product') showToast('Product: ' + val);
}
// ---------- New-order alerts (admin dashboard) ----------
let lastOrderCount = 0;
let orderPollTimer = null;
function playAlertSound() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = 'sine'; o.frequency.value = 880;
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.06);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    o.start(); o.stop(ctx.currentTime + 0.75);
  } catch (e) {}
}
function startOrderPolling() {
  stopOrderPolling();
  orderPollTimer = setInterval(() => {
    if (!adminToken) return;
    DB.getOrders(adminToken).then(list => {
      const n = (list || []).length;
      if (n > lastOrderCount) {
        const fresh = n - lastOrderCount;
        adminOrdersCache = list;
        lastOrderCount = n;
        playAlertSound();
        showToast(fresh === 1 ? 'New order received!' : `${fresh} new orders received!`);
        if (['orders', 'overview', 'customers'].includes(adminTab)) renderAdminTab();
        renderAdminStats();
      }
    }).catch(() => {});
  }, 60000);
}
function stopOrderPolling() {
  if (orderPollTimer) { clearInterval(orderPollTimer); orderPollTimer = null; }
}

async function loadAdminData() {
  const box = document.getElementById('admin-content');
  try {
    const [orders, nl, promos, msgs] = await Promise.all([
      DB.getOrders(adminToken),
      DB.getNewsletterList(adminToken),
      DB.getPromoList(adminToken).catch(() => []),
      DB.getMessages(adminToken).catch(() => [])
    ]);
    adminOrdersCache = orders;
    adminNlCache = nl;
    adminPromoCache = promos;
    adminMsgCache = msgs;
    lastOrderCount = (orders || []).length;
    startOrderPolling();
    renderAdminStats();
    renderAdminTab();
  } catch (err) {
    const msg = err.message || 'Unknown error';
    if (/401|403/.test(msg)) {
      try { sessionStorage.removeItem('luxe_admin'); } catch (e) {}
      adminToken = null; stopOrderPolling();
      renderAdmin();
      showToast('Session expired: please sign in again');
      return;
    }
    if (box) box.innerHTML = `<p class="d-empty">Could not load data.<br/>${escapeHtml(msg)}</p>`;
  }
}

function renderAdminStats() {
  const el = document.getElementById('admin-stats');
  if (!el) return;
  const revenue = adminOrdersCache.reduce((s, o) => s + Number(o.total || 0), 0);
  el.innerHTML = `
    <div class="a-stat"><b>${money(revenue)}</b><span>Revenue</span></div>
    <div class="a-stat"><b>${adminOrdersCache.length}</b><span>Orders</span></div>
    <div class="a-stat"><b>${adminOrdersCache.length ? money(revenue / adminOrdersCache.length) : money(0)}</b><span>Avg. order</span></div>
    <div class="a-stat"><b>${adminNlCache.length}</b><span>Newsletter</span></div>`;
}

const ADMIN_TITLES = { overview: 'Overview', orders: 'Orders', products: 'Products', customers: 'Customers', promos: 'Promos', content: 'Content', messages: 'Messages', newsletter: 'Newsletter', settings: 'Settings' };
function closeAdminSide() {
  const s = document.getElementById('admin-side'), sc = document.getElementById('admin-scrim');
  if (s) s.classList.remove('open');
  if (sc) sc.classList.remove('open');
}
function updateNavBadges() {
  const set = (k, v) => {
    const el = document.querySelector(`[data-navbadge="${k}"]`);
    if (el) { el.textContent = v > 0 ? v : ''; el.style.display = v > 0 ? 'inline-block' : 'none'; }
  };
  set('orders', (adminOrdersCache || []).filter(o => o.status === 'placed').length);
  set('messages', (adminMsgCache || []).length);
  set('products', PRODUCTS.filter(p => (p.stock || 0) <= 5).length);
}
function renderAdminTab() {
  const box = document.getElementById('admin-content');
  if (!box) return;
  document.querySelectorAll('[data-atab]').forEach(b => b.classList.toggle('active', b.getAttribute('data-atab') === adminTab));
  const pt = document.getElementById('admin-page-title');
  if (pt) pt.textContent = ADMIN_TITLES[adminTab] || 'Overview';
  updateNavBadges();
  try {
    if (adminTab === 'overview') box.innerHTML = overviewTabHTML();
    else if (adminTab === 'orders') box.innerHTML = ordersTabHTML();
    else if (adminTab === 'products') box.innerHTML = productsTabHTML();
    else if (adminTab === 'customers') box.innerHTML = customersTabHTML();
    else if (adminTab === 'promos') box.innerHTML = promosTabHTML();
    else if (adminTab === 'content') box.innerHTML = contentTabHTML();
    else if (adminTab === 'messages') box.innerHTML = messagesTabHTML();
    else if (adminTab === 'settings') box.innerHTML = settingsTabHTML();
    else box.innerHTML = newsletterTabHTML();
  } catch (err) {
    console.error('Admin tab error:', err);
    box.innerHTML = `<p class="d-empty">Couldn't load this section (${escapeHtml(err.message)}). Try refreshing the page.</p>`;
  }
  if (adminTab === 'overview') { animateCountUp(); bindChartTooltip(); }
}

// ---------- Overview / analytics 2.0 ----------
let overviewRange = '7'; // '7' | '30' | 'all'
const DONUT_COLORS = { placed: '#c6a15b', confirmed: '#4a90d9', shipped: '#8b5cf6', delivered: '#1faa53' };
function parseOrderDate(s) {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}
function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function dayKey(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function shortMoney(n) {
  n = Number(n) || 0;
  if (n >= 1000) return 'Rs. ' + (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return 'Rs. ' + Math.round(n);
}
function overviewData() {
  const now = new Date();
  const orders = (adminOrdersCache || []).map(o => ({ o, d: parseOrderDate(o.date) })).filter(x => x.d);
  const n = overviewRange === 'all' ? 0 : Number(overviewRange);
  let start, prevStart, prevEnd;
  if (overviewRange === 'all') {
    start = new Date(2000, 0, 1);
  } else {
    start = new Date(now); start.setDate(now.getDate() - (n - 1)); start.setHours(0, 0, 0, 0);
    prevEnd = new Date(start.getTime() - 1);
    prevStart = new Date(start); prevStart.setDate(start.getDate() - n);
  }
  const inCur = orders.filter(x => x.d >= start);
  const inPrev = overviewRange === 'all' ? [] : orders.filter(x => x.d >= prevStart && x.d <= prevEnd);
  const rev = inCur.reduce((s, x) => s + Number(x.o.total || 0), 0);
  const prevRev = inPrev.reduce((s, x) => s + Number(x.o.total || 0), 0);
  const trend = prevRev > 0 ? Math.round((rev - prevRev) / prevRev * 100) : (rev > 0 ? 100 : 0);
  const units = inCur.reduce((s, x) => s + (x.o.items || []).reduce((a, it) => a + (it.qty || 1), 0), 0);
  const aov = inCur.length ? rev / inCur.length : 0;
  const status = { placed: 0, confirmed: 0, shipped: 0, delivered: 0 };
  inCur.forEach(x => { const st = x.o.status || 'placed'; if (status[st] != null) status[st]++; });
  let series = [], labels = [], countSeries = [], unitsSeries = [];
  const bucketAgg = list => ({
    rev: list.reduce((s, x) => s + Number(x.o.total || 0), 0),
    count: list.length,
    units: list.reduce((s, x) => s + (x.o.items || []).reduce((a, it) => a + (it.qty || 1), 0), 0)
  });
  if (overviewRange === 'all') {
    for (let i = 11; i >= 0; i--) {
      const dm = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const agg = bucketAgg(orders.filter(x => x.d.getFullYear() === dm.getFullYear() && x.d.getMonth() === dm.getMonth()));
      series.push(agg.rev); countSeries.push(agg.count); unitsSeries.push(agg.units);
      labels.push(dm.toLocaleDateString('en-US', { month: 'short' }));
    }
  } else {
    for (let i = n - 1; i >= 0; i--) {
      const dd = new Date(now); dd.setDate(now.getDate() - i);
      const agg = bucketAgg(orders.filter(x => sameDay(x.d, dd)));
      series.push(agg.rev); countSeries.push(agg.count); unitsSeries.push(agg.units);
      labels.push(dd.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }));
    }
  }
  const aovSeries = series.map((r, i) => countSeries[i] ? r / countSeries[i] : 0);
  const pq = {};
  inCur.forEach(x => (x.o.items || []).forEach(it => { pq[it.id] = (pq[it.id] || 0) + (it.qty || 1); }));
  const top = Object.entries(pq).sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([id, qty]) => ({ p: PRODUCTS.find(p => String(p.id) === String(id)), qty }))
    .filter(x => x.p);
  const maxTop = Math.max(1, ...top.map(t => t.qty));
  const recent = [...inCur].sort((a, b) => b.d - a.d).slice(0, 5);
  const lowStock = PRODUCTS.filter(p => (p.stock || 0) <= 5);
  const pending = (adminOrdersCache || []).filter(o => o.status === 'placed').length;
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthRev = orders.filter(x => x.d >= monthStart).reduce((s, x) => s + Number(x.o.total || 0), 0);
  const salesGoal = Number(SETTINGS.sales_goal || 50000) || 50000;
  return { rev, trend, count: inCur.length, units, aov, status, series, labels, countSeries, unitsSeries, aovSeries, top, maxTop, recent, lowStock, pending, monthRev, salesGoal };
}
function areaChartSVG(series, labels) {
  const W = 640, H = 240, PL = 44, PR = 10, PT = 14, PB = 30;
  const max = Math.max(1, ...series);
  const n = series.length;
  const X = i => PL + (n === 1 ? (W - PL - PR) / 2 : i * (W - PL - PR) / (n - 1));
  const Y = v => PT + (1 - v / max) * (H - PT - PB);
  const pts = series.map((v, i) => [X(i), Y(v)]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const area = line + ` L${X(n - 1).toFixed(1)},${H - PB} L${X(0).toFixed(1)},${H - PB} Z`;
  const gid = 'ag' + String(Math.floor(Math.random() * 1e9));
  const grids = [0, 0.25, 0.5, 0.75, 1].map(f => {
    const y = (PT + (1 - f) * (H - PT - PB)).toFixed(1);
    return `<line x1="${PL}" y1="${y}" x2="${W - PR}" y2="${y}" stroke="#ece4d2" stroke-width="1"/>`
      + `<text x="${PL - 6}" y="${+y + 3}" font-size="9" fill="#a09a8c" text-anchor="end">${shortMoney(max * f)}</text>`;
  }).join('');
  const dots = pts.map((p, i) =>
    `<circle data-i="${i}" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="5" fill="transparent" stroke="none"><title>${escapeHtml(labels[i])}: ${money(series[i])}</title></circle>`
    + `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4.5" fill="#fff" stroke="#9a7b3f" stroke-width="2.5" pointer-events="none"/>`
  ).join('');
  const li = Math.max(1, Math.ceil(n / 7));
  const xlabels = pts.map((p, i) => (i % li === 0 || i === n - 1)
    ? `<text x="${p[0].toFixed(1)}" y="${H - 10}" font-size="9" fill="#a09a8c" text-anchor="middle">${escapeHtml(labels[i])}</text>` : '').join('');
  return `<svg viewBox="0 0 ${W} ${H}" class="ov-chart-svg" role="img" aria-label="Sales chart">`
    + `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">`
    + `<stop offset="0" stop-color="#c6a15b" stop-opacity=".45"/><stop offset="1" stop-color="#c6a15b" stop-opacity="0"/>`
    + `</linearGradient></defs>${grids}<path d="${area}" fill="url(#${gid})"/>`
    + `<path d="${line}" fill="none" stroke="#9a7b3f" stroke-width="2.5" stroke-linejoin="round"/>${dots}${xlabels}</svg>`;
}
function donutSVG(status) {
  const total = Object.values(status).reduce((s, v) => s + v, 0);
  const R = 62, C = 2 * Math.PI * R;
  let acc = 0;
  const segs = Object.entries(status).map(([k, v]) => {
    const frac = total ? v / total : 0;
    const s = `<circle cx="80" cy="80" r="${R}" fill="none" stroke="${DONUT_COLORS[k]}" stroke-width="24"`
      + ` stroke-dasharray="${(frac * C).toFixed(1)} ${C.toFixed(1)}" stroke-dashoffset="${(-acc * C).toFixed(1)}"`
      + ` transform="rotate(-90 80 80)"><title>${capitalize(k)}: ${v}</title></circle>`;
    acc += frac;
    return s;
  }).join('');
  return `<svg viewBox="0 0 160 160" class="ov-donut" role="img" aria-label="Orders by status">${segs}`
    + `<text x="80" y="78" text-anchor="middle" font-size="26" font-family="Georgia,serif" fill="#0d0c0a">${total}</text>`
    + `<text x="80" y="98" text-anchor="middle" font-size="9" fill="#8b8578" letter-spacing="2">ORDERS</text></svg>`;
}
function sparkSVG(data, color) {
  const W = 120, H = 34;
  const max = Math.max(...data), min = Math.min(...data);
  const rng = Math.max(1e-9, max - min);
  const n = data.length;
  const X = i => n === 1 ? W / 2 : 3 + i * (W - 6) / (n - 1);
  const Y = v => 3 + (1 - (v - min) / rng) * (H - 6);
  const pts = data.map((v, i) => [X(i), Y(v)]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const last = pts[pts.length - 1];
  return `<svg viewBox="0 0 ${W} ${H}" class="ov-spark" aria-hidden="true"><path d="${line}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/><circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="3" fill="${color}"/></svg>`;
}
function goalRingSVG(pct) {
  const R = 32, C = 2 * Math.PI * R, p = Math.min(100, Math.max(0, pct));
  return `<svg viewBox="0 0 80 80" class="ov-goal-ring" role="img" aria-label="Sales goal ${Math.round(p)} percent">
    <circle cx="40" cy="40" r="${R}" fill="none" stroke="rgba(198,161,91,.22)" stroke-width="8"/>
    <circle cx="40" cy="40" r="${R}" fill="none" stroke="#c6a15b" stroke-width="8" stroke-linecap="round"
      stroke-dasharray="${(p / 100 * C).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 40 40)"/>
    <text x="40" y="45" text-anchor="middle" font-size="14" fill="#f4efe6" font-family="Georgia,serif">${Math.round(p)}%</text></svg>`;
}
function animateCountUp() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('[data-countup]').forEach(el => {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const target = parseFloat(el.getAttribute('data-countup')) || 0;
    const isMoney = el.hasAttribute('data-money');
    const dur = 1000, t0 = performance.now();
    const fmt = v => isMoney ? money(v) : Math.round(v).toLocaleString('en-US');
    el.textContent = fmt(0);
    const tick = t => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * e);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}
let chartData = null;
function bindChartTooltip() {
  const svg = document.querySelector('.ov-chart-svg');
  const tip = document.getElementById('chart-tip');
  if (!svg || !tip || !chartData) return;
  svg.addEventListener('mousemove', e => {
    const circ = e.target.closest ? e.target.closest('circle[data-i]') : null;
    if (circ) {
      const i = Number(circ.getAttribute('data-i'));
      tip.innerHTML = `<strong>${money(chartData.series[i])}</strong><span>${escapeHtml(chartData.labels[i])}</span>`;
      tip.style.display = 'block';
      const r = svg.getBoundingClientRect();
      let x = e.clientX - r.left, y = e.clientY - r.top;
      tip.style.left = Math.min(r.width - 110, Math.max(0, x - 50)) + 'px';
      tip.style.top = Math.max(0, y - 62) + 'px';
    } else tip.style.display = 'none';
  });
  svg.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
}
function overviewTabHTML() {
  const d = overviewData();
  chartData = { series: d.series, labels: d.labels };
  const ranges = [['7', '7 days'], ['30', '30 days'], ['all', 'All time']];
  const up = d.trend >= 0;
  const sparkColor = '#c6a15b';
  const heroCards = [
    ['Orders', d.count, 'fa-bag-shopping', d.countSeries, false],
    ['Units sold', d.units, 'fa-box-open', d.unitsSeries, false],
    ['Avg. order value', d.aov, 'fa-receipt', d.aovSeries, true],
    ['Pending orders', d.pending, 'fa-hourglass-half', null, false]
  ];
  const goalPct = d.salesGoal > 0 ? d.monthRev / d.salesGoal * 100 : 0;
  return `
  <div class="ov-range" role="tablist" aria-label="Date range">
    ${ranges.map(([v, l]) => `<button class="${overviewRange === v ? 'active' : ''}" data-ov-range="${v}">${l}</button>`).join('')}
  </div>
  <div class="ov-hero">
    <div class="ov-hero-main">
      <span class="ov-label">Total sales</span>
      <span class="ov-hero-val" data-countup="${d.rev}" data-money>${money(d.rev)}</span>
      <span class="ov-trend ${up ? 'up' : 'down'}"><i class="fas fa-arrow-${up ? 'up' : 'down'}"></i> ${Math.abs(d.trend)}% <em>vs previous period</em></span>
    </div>
    <div class="ov-goal">
      ${goalRingSVG(goalPct)}
      <div><span class="ov-label">Month goal</span><strong>${money(d.monthRev)} <em>of ${shortMoney(d.salesGoal)}</em></strong></div>
    </div>
    <div class="ov-hero-cards">
      ${heroCards.map(([l, v, ic, spark, isMoney]) => `
      <div class="ov-card">
        <div class="ov-card-head"><i class="fas ${ic}"></i><span class="ov-label">${l}</span></div>
        <span class="ov-val" data-countup="${v}"${isMoney ? ' data-money' : ''}>${isMoney ? money(v) : v}</span>
        ${spark ? `<div class="ov-spark-wrap">${sparkSVG(spark, sparkColor)}</div>` : '<div class="ov-spark-wrap"></div>'}
      </div>`).join('')}
    </div>
  </div>
  <div class="ov-grid">
    <div class="ov-panel ov-wide" style="position:relative;">
      <h4>Sales over time</h4>
      <div id="chart-tip" class="chart-tip"></div>
      ${areaChartSVG(d.series, d.labels)}
    </div>
    <div class="ov-panel">
      <h4>Orders by status</h4>
      <div class="ov-donut-wrap">${donutSVG(d.status)}
        <ul class="ov-legend">
          ${Object.entries(d.status).map(([k, v]) => `<li><i style="background:${DONUT_COLORS[k]}"></i><span>${capitalize(k)}</span><strong>${v}</strong></li>`).join('')}
        </ul>
      </div>
    </div>
  </div>
  <div class="ov-grid">
    <div class="ov-panel">
      <h4>Top products</h4>
      ${d.top.length ? `<ul class="ov-bars">${d.top.map(({ p, qty }) => `
        <li><div class="ov-bar-row"><span>${escapeHtml(p.name)}</span><strong>${qty} sold</strong></div>
        <div class="ov-track"><div class="ov-fill" style="width:${Math.round(qty / d.maxTop * 100)}%"></div></div></li>`).join('')}</ul>`
        : '<p class="d-empty">No sales in this period.</p>'}
    </div>
    <div class="ov-panel">
      <h4>Recent orders</h4>
      ${d.recent.length ? `<ul class="ov-list">${d.recent.map(({ o }) => `
        <li><span><strong>${escapeHtml(o.number)}</strong><span class="a-order-meta"> · ${escapeHtml(o.name || '-')}</span></span>
        <span class="ov-recent-right"><span class="a-status ${o.status} sm">${capitalize(o.status || 'placed')}</span><strong>${money(o.total || 0)}</strong></span></li>`).join('')}</ul>`
        : '<p class="d-empty">No orders in this period.</p>'}
    </div>
  </div>
  <div class="ov-panel">
    <h4>Low stock alert ${d.lowStock.length ? `<em>${d.lowStock.length}</em>` : ''}</h4>
    ${d.lowStock.length ? `<ul class="ov-list">${d.lowStock.map(p => `
      <li><span>${escapeHtml(p.name)}</span><strong class="${(p.stock || 0) === 0 ? 'out' : 'low'}">${(p.stock || 0) === 0 ? 'OUT OF STOCK' : `Only ${p.stock} left`}</strong></li>`).join('')}</ul>`
      : '<p class="d-empty">All stocked up.</p>'}
  </div>`;
}

// ---------- Order detail drawer ----------
function openOrderDrawer(number) {
  const o = (adminOrdersCache || []).find(x => x.number === number);
  if (!o) return;
  const opts = ['placed', 'confirmed', 'shipped', 'delivered'];
  const stepIdx = opts.indexOf(o.status || 'placed');
  const wa = waLink(o);
  const itemCount = (o.items || []).reduce((s, it) => s + (it.qty || 1), 0);
  document.getElementById('order-drawer').innerHTML = `
    <div class="od-head">
      <div><span class="ov-label">Order</span><h3>${escapeHtml(o.number)}</h3>
      <span class="a-order-meta">${escapeHtml(o.date || '')} · ${itemCount} item${itemCount === 1 ? '' : 's'}</span></div>
      <button class="od-close" id="order-drawer-close" aria-label="Close"><i class="fas fa-times"></i></button>
    </div>
    <div class="od-sec">
      <h5>Status</h5>
      <div class="od-timeline">
        ${opts.map((s, i) => `<div class="od-step${i <= stepIdx ? ' done' : ''}">${s}</div>`).join('')}
      </div>
      <div style="margin-top:16px;display:flex;gap:10px;align-items:center;">
        <span class="a-status ${o.status}">${capitalize(o.status || 'placed')}</span>
        <select data-status="${escapeHtml(o.number)}" aria-label="Update status" style="flex:1;">
          ${opts.map(s => `<option value="${s}"${s === o.status ? ' selected' : ''}>${capitalize(s)}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="od-sec">
      <h5>Customer</h5>
      <div class="od-row"><span><strong>${escapeHtml(o.name || '-')}</strong></span></div>
      <div class="od-row"><span>Phone</span><span>${escapeHtml(o.phone || '-')}</span></div>
      ${o.email ? `<div class="od-row"><span>Email</span><span>${escapeHtml(o.email)}</span></div>` : ''}
      <div class="od-row"><span>Address</span><span style="text-align:right;max-width:60%;">${escapeHtml(o.address || '-')}${o.city ? ', ' + escapeHtml(o.city) : ''}</span></div>
      ${o.notes ? `<div class="od-row"><span>Notes</span><span style="text-align:right;max-width:60%;">${escapeHtml(o.notes)}</span></div>` : ''}
      <div class="od-actions">
        ${wa ? `<a class="d-mini wa" href="${wa}" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> WhatsApp</a>` : ''}
        ${o.phone ? `<a class="d-mini" href="tel:${escapeHtml(String(o.phone).replace(/\D/g, ''))}"><i class="fas fa-phone"></i> Call</a>` : ''}
        <button class="d-mini" data-print-invoice="${escapeHtml(o.number)}"><i class="fas fa-print"></i> Invoice</button>
      </div>
    </div>
    <div class="od-sec">
      <h5>Items</h5>
      ${(o.items || []).map(it => `<div class="od-row"><span>${escapeHtml(it.name)} <em>× ${it.qty || 1}</em></span><span>${money(it.price * (it.qty || 1))}</span></div>`).join('')}
    </div>
    <div class="od-sec">
      <h5>Totals</h5>
      <div class="od-row"><span>Subtotal</span><span>${money(o.subtotal || 0)}</span></div>
      ${(o.discount || 0) ? `<div class="od-row"><span>Discount${o.promo ? ' (' + escapeHtml(o.promo) + ')' : ''}</span><span>−${money(o.discount)}</span></div>` : ''}
      ${(o.delivery || 0) ? `<div class="od-row"><span>Delivery</span><span>${money(o.delivery)}</span></div>` : ''}
      <div class="od-row" style="font-size:17px;margin-top:6px;"><strong>Total (COD)</strong><strong>${money(o.total || 0)}</strong></div>
      <div class="od-actions">
        <button class="d-mini danger" data-del-order="${escapeHtml(o.number)}">Delete order</button>
      </div>
    </div>`;
  document.getElementById('order-drawer').classList.add('open');
  document.getElementById('order-drawer-scrim').classList.add('open');
}
function closeOrderDrawer() {
  const d = document.getElementById('order-drawer'), s = document.getElementById('order-drawer-scrim');
  if (d) d.classList.remove('open');
  if (s) s.classList.remove('open');
}

function waLink(o) {
  const digits = String((o && o.phone) || '').replace(/\D/g, '');
  if (!digits) return '';
  const intl = digits.startsWith('0') ? '92' + digits.slice(1) : digits;
  return 'https://wa.me/' + intl;
}
function orderCountByPhone(phone) {
  if (!phone) return 0;
  const p = String(phone).trim();
  return adminOrdersCache.filter(o => o && String(o.phone || '').trim() === p).length;
}
function ordersTabHTML() {
  const f = adminOrderFilter;
  const q = adminOrderSearch.trim().toLowerCase();
  const list = adminOrdersCache.filter(o => {
    if (f !== 'all' && o.status !== f) return false;
    if (q && !`${o.number} ${o.name} ${o.phone}`.toLowerCase().includes(q)) return false;
    return true;
  });
  const opts = ['placed', 'confirmed', 'shipped', 'delivered'];
  return `
  <div class="a-toolbar">
    <input id="admin-order-search" type="search" placeholder="Search name, order #, phone…" value="${escapeHtml(adminOrderSearch)}" aria-label="Search orders" style="min-width:220px;" />
    <select id="admin-order-filter" aria-label="Filter orders">
      ${['all', ...opts].map(s => `<option value="${s}"${s === f ? ' selected' : ''}>${s === 'all' ? 'All orders' : capitalize(s)}</option>`).join('')}
    </select>
    <button class="d-mini" data-export-orders>Export CSV</button>
  </div>
  ${!list.length ? '<p class="d-empty">No orders found.</p>' : list.map(o => {
    const itemCount = (o.items || []).reduce((s, it) => s + (it.qty || 1), 0);
    const repeats = orderCountByPhone(o.phone);
    const wa = waLink(o);
    return `
    <div class="a-order">
      <div class="a-order-head">
        <div>
          <button class="link-btn od-open" data-view-order="${escapeHtml(o.number)}" style="font-size:17px;font-weight:700;" title="View details">${escapeHtml(o.number)}</button>
          ${repeats > 1 ? `<span class="a-badge-repeat" title="${repeats} orders from this customer"><i class="fas fa-star"></i> Repeat ×${repeats}</span>` : ''}
          <span class="a-order-meta">${escapeHtml(o.date || '')} · ${itemCount} item${itemCount === 1 ? '' : 's'} · COD</span>
        </div>
        <div class="a-order-right">
          <span class="a-status ${o.status}">${capitalize(o.status || 'placed')}</span>
          <select data-status="${escapeHtml(o.number)}" aria-label="Update status">
            ${opts.map(s => `<option value="${s}"${s === o.status ? ' selected' : ''}>${capitalize(s)}</option>`).join('')}
          </select>
          ${wa ? `<a class="d-mini wa" href="${wa}" target="_blank" rel="noopener" title="Message on WhatsApp"><i class="fab fa-whatsapp"></i></a>` : ''}
          <button class="d-mini" data-print-invoice="${escapeHtml(o.number)}" title="Print invoice"><i class="fas fa-print"></i></button>
          <button class="d-mini danger" data-del-order="${escapeHtml(o.number)}">Delete</button>
        </div>
      </div>
      <div class="a-order-cust">
        <span class="a-cust-name">${escapeHtml(o.name || '-')}</span>
        <span class="a-order-meta">${escapeHtml([o.phone, o.email].filter(Boolean).join(' · ') || '')}</span>
        ${o.address ? `<span class="a-order-meta">${escapeHtml(o.address)}${o.city ? ', ' + escapeHtml(o.city) : ''}</span>` : ''}
      </div>
      <ul class="o-lines">
        ${(o.items || []).map(it => `<li><span>${escapeHtml(it.name)} <em>× ${it.qty || 1}</em></span><span>${money(it.price * (it.qty || 1))}</span></li>`).join('')}
      </ul>
      <div class="a-order-foot">
        ${o.promo ? `<span>Promo ${escapeHtml(o.promo)} (−${money(o.discount || 0)})</span>` : '<span></span>'}
        <strong>${money(o.total || 0)}</strong>
      </div>
    </div>`; }).join('')}`;
}

function productsTabHTML() {
  return `
  <div class="a-toolbar">
    <button class="btn-solid" data-add-product style="padding:13px 30px;">+ Add Product</button>
    <span class="a-order-meta">${PRODUCTS.length} product(s) live on the store</span>
  </div>
  <div class="a-toolbar" style="margin-top:10px;">
    <span class="a-order-meta">Bulk price update:</span>
    <select id="bulk-dir" aria-label="Increase or decrease">
      <option value="up">Increase</option>
      <option value="down">Decrease</option>
    </select>
    <input id="bulk-pct" type="number" min="1" max="90" placeholder="%" style="width:76px;" aria-label="Percent" />
    <button class="d-mini" data-bulk-price>Apply to all</button>
  </div>
  <div class="a-products">` + PRODUCTS.map(p => `
    <div class="a-product${p.visible === false ? ' dim' : ''}">
      <img src="${p.image}" alt="" loading="lazy" decoding="async" />
      <div class="a-product-info"><strong>${escapeHtml(p.name)}</strong><span>${capitalize(p.category)} · ${money(p.price)}</span></div>
      <div class="a-stock-ctl" title="Stock">
        <button class="d-mini" data-stock-dec="${p.id}" aria-label="Decrease stock">−</button>
        <span class="a-stock-num">${p.stock || 0}</span>
        <button class="d-mini" data-stock-inc="${p.id}" aria-label="Increase stock">+</button>
      </div>
      <label class="a-vis" title="Show / hide on store">
        <input type="checkbox" data-visible="${p.id}"${p.visible !== false ? ' checked' : ''} />
        <span>Visible</span>
      </label>
      <button class="d-mini" data-edit-product="${p.id}">Edit</button>
      <button class="d-mini danger" data-del-product="${p.id}">Delete</button>
    </div>`).join('') + `</div>` + productModalHTML();
}

function productModalHTML() {
  return `
  <div class="a-modal" id="product-modal" aria-hidden="true">
    <div class="a-modal-box" role="dialog" aria-modal="true" aria-label="Product editor">
      <h3 id="pm-title">Add Product</h3>
      <form id="product-form" novalidate>
        <input type="hidden" id="pf-id" />
        <div class="pf-grid">
          <div class="field"><label>Name</label><input id="pf-name" required /></div>
          <div class="field"><label>Price (Rs.)</label><input id="pf-price" type="number" min="1" step="0.01" required /></div>
          <div class="field"><label>Category</label><input id="pf-category" list="pf-catlist" required /></div>
          <div class="field"><label>Stock</label><input id="pf-stock" type="number" min="0" step="1" /></div>
          <div class="field"><label>Badge (optional)</label><input id="pf-badge" placeholder="New / Bestseller…" /></div>
          <div class="field"><label>Rating (0–5)</label><input id="pf-rating" type="number" min="0" max="5" step="0.1" /></div>
          <div class="field"><label>Visible on store</label><input id="pf-visible" type="checkbox" checked style="width:auto;height:20px;" /></div>
        </div>
        <div class="field"><label>Description</label><textarea id="pf-desc" rows="3"></textarea></div>
        <div class="field"><label>Main image</label>
          <div class="pf-imgrow">
            <input id="pf-image" placeholder="https://…" />
            <label class="pf-upload">Upload<input type="file" id="pf-upload" accept="image/*" hidden /></label>
          </div>
          <img id="pf-preview" alt="preview" />
        </div>
        <div class="field"><label>Gallery: one image URL per line</label><textarea id="pf-images" rows="3" placeholder="https://…"></textarea></div>
        <div class="pf-actions">
          <button type="submit" class="btn-solid" style="padding:14px 34px;">Save Product</button>
          <button type="button" class="ghost-dark" id="pm-cancel" style="width:auto;padding:14px 30px;">Cancel</button>
        </div>
      </form>
      <datalist id="pf-catlist">${[...new Set(PRODUCTS.map(p => p.category))].map(c => `<option value="${escapeHtml(c)}">`).join('')}</datalist>
    </div>
  </div>`;
}

function openProductModal(p) {
  document.getElementById('pm-title').textContent = p ? 'Edit Product' : 'Add Product';
  document.getElementById('pf-id').value = p ? p.id : '';
  document.getElementById('pf-name').value = p ? p.name : '';
  document.getElementById('pf-price').value = p ? p.price : '';
  document.getElementById('pf-category').value = p ? p.category : '';
  document.getElementById('pf-stock').value = p ? (p.stock || 0) : '';
  document.getElementById('pf-visible').checked = !p || p.visible !== false;
  document.getElementById('pf-badge').value = p ? (p.badge || '') : '';
  document.getElementById('pf-rating').value = p ? (p.rating || '') : '';
  document.getElementById('pf-desc').value = p ? (p.description || '') : '';
  document.getElementById('pf-image').value = p ? (p.image || '') : '';
  document.getElementById('pf-images').value = p && p.images ? p.images.slice(1).join('\n') : '';
  const prev = document.getElementById('pf-preview');
  if (p && p.image) { prev.src = p.image; prev.style.display = 'block'; } else { prev.style.display = 'none'; }
  const m = document.getElementById('product-modal');
  m.classList.add('open');
  m.setAttribute('aria-hidden', 'false');
}
function closeProductModal() {
  const m = document.getElementById('product-modal');
  if (m) { m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); }
}

// ---------- Customers ----------
function customersTabHTML() {
  const map = {};
  (adminOrdersCache || []).forEach(o => {
    const key = String(o.phone || '').replace(/\D/g, '') || String(o.email || '').toLowerCase();
    if (!key) return;
    if (!map[key]) map[key] = { name: o.name || '-', phone: o.phone || '-', email: o.email || '-', orders: 0, spent: 0, last: null, lastStr: '' };
    const c = map[key];
    c.orders++;
    c.spent += Number(o.total || 0);
    if (o.name && c.name === '-') c.name = o.name;
    const d = parseOrderDate(o.date);
    if (d && (!c.last || d > c.last)) { c.last = d; c.lastStr = o.date; }
  });
  const list = Object.values(map).sort((a, b) => b.spent - a.spent);
  return `
  <div class="a-toolbar"><span class="a-order-meta">${list.length} customer(s) · sorted by total spent</span>
  <button class="d-mini" data-export-customers>Export CSV</button></div>
  ${!list.length ? '<p class="d-empty">No customers yet.</p>' : `
  <div class="a-table-wrap"><table class="a-table">
    <tr><th>Customer</th><th>Phone</th><th>Orders</th><th>Total Spent</th><th>Last Order</th><th></th></tr>
    ${list.map(c => `
    <tr>
      <td><strong>${escapeHtml(c.name)}</strong><br><span class="a-order-meta">${escapeHtml(c.email)}</span></td>
      <td>${escapeHtml(c.phone)}</td>
      <td>${c.orders}</td>
      <td><strong>${money(c.spent)}</strong></td>
      <td>${escapeHtml(c.lastStr)}</td>
      <td>${c.orders > 1 ? '<span class="a-badge-repeat"><i class="fas fa-star"></i> Loyal</span>' : ''}</td>
    </tr>`).join('')}
  </table></div>`}`;
}

// ---------- Store settings ----------
function settingsTabHTML() {
  const cities = deliveryCities();
  const cityLines = Object.entries(cities).map(([c, f]) => `${c}: ${f}`).join('\n');
  const open = isStoreOpen();
  return `
  <div class="ov-panel" style="margin-bottom:22px;">
    <h4>Store status</h4>
    <label class="a-vis" style="font-size:15px;">
      <input type="checkbox" id="set-store-open"${open ? ' checked' : ''} />
      <span>Store open — ${open ? 'accepting orders' : 'NOT accepting orders'}</span>
    </label>
    <p class="a-order-meta" style="margin-top:10px;">When closed, shoppers see a notice and cannot place orders.</p>
  </div>
  <div class="ov-panel" style="margin-bottom:22px;">
    <h4>Store information</h4>
    <p class="a-order-meta" style="margin-bottom:16px;">Shown in the website footer and contact page.</p>
    <div class="pf-grid">
      <div class="field"><label>Phone</label><input id="set-store-phone" type="tel" value="${escapeHtml(SETTINGS.store_phone || '')}" /></div>
      <div class="field"><label>Email</label><input id="set-store-email" type="email" value="${escapeHtml(SETTINGS.store_email || '')}" /></div>
    </div>
    <div class="field" style="max-width:520px;"><label>Address</label><input id="set-store-address" type="text" value="${escapeHtml(SETTINGS.store_address || '')}" /></div>
  </div>
  <div class="ov-panel" style="margin-bottom:22px;">
    <h4>Delivery charges</h4>
    <div class="field" style="max-width:320px;"><label>Default delivery fee (Rs.)</label>
      <input id="set-delivery-fee" type="number" min="0" step="1" value="${escapeHtml(SETTINGS.delivery_fee || '0')}" />
    </div>
    <div class="field" style="max-width:420px;"><label>Per-city fees <span class="opt">(one per line: City: fee)</span></label>
      <textarea id="set-delivery-cities" rows="5" placeholder="Lahore: 200&#10;Karachi: 300">${escapeHtml(cityLines)}</textarea>
    </div>
    <p class="a-order-meta">Checkout shows a city dropdown; other cities use the default fee.</p>
    <div class="field" style="max-width:320px;"><label>Monthly sales goal (Rs.)</label>
      <input id="set-sales-goal" type="number" min="0" step="1000" value="${escapeHtml(SETTINGS.sales_goal || '50000')}" />
    </div>
    <button class="btn-solid" data-save-settings style="padding:13px 34px;">Save Settings</button>
  </div>`;
}

function promosTabHTML() {
  return `
  <div class="a-toolbar">
    <form id="promo-form" class="promo-add" novalidate>
      <input id="promo-code-in" placeholder="CODE" style="text-transform:uppercase" required />
      <input id="promo-pct-in" type="number" min="1" max="90" placeholder="%" required />
      <button class="btn-solid" style="padding:12px 26px;">Add Promo</button>
    </form>
  </div>
  ${!adminPromoCache.length ? '<p class="d-empty">No promo codes yet.</p>' : `
  <ul class="a-promo-list">` + adminPromoCache.map(pr => {
    const uses = (adminOrdersCache || []).filter(o => o.promo === pr.code);
    const rev = uses.reduce((s, o) => s + Number(o.total || 0), 0);
    return `
    <li class="${pr.active ? '' : 'off'}">
      <strong>${escapeHtml(pr.code)}</strong><span>${Math.round(pr.percent * 100)}% off</span>
      <span class="a-promo-stat"><i class="fas fa-cart-shopping"></i> ${uses.length} used · ${money(rev)}</span>
      <span class="a-status ${pr.active ? 'delivered' : 'placed'}">${pr.active ? 'Active' : 'Off'}</span>
      <button class="d-mini" data-promo-toggle="${escapeHtml(pr.code)}">${pr.active ? 'Disable' : 'Enable'}</button>
      <button class="d-mini danger" data-promo-del="${escapeHtml(pr.code)}">Delete</button>
    </li>`; }).join('') + `</ul>`}`;
}

function toLocalInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const p2 = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}T${p2(d.getHours())}:${p2(d.getMinutes())}`;
}

function contentTabHTML() {
  const s = SETTINGS;
  return `
  <form id="content-form" class="a-content" novalidate>
    <div class="field"><label>Announcement bar message</label><input id="cs-announcement" value="${escapeHtml(s.announcement || '')}" /></div>
    <div class="pf-grid">
      <div class="field"><label>Hero eyebrow</label><input id="cs-eyebrow" value="${escapeHtml(s.hero_eyebrow || '')}" /></div>
      <div class="field"><label>Hero line 1</label><input id="cs-l1" value="${escapeHtml(s.hero_line1 || '')}" /></div>
      <div class="field"><label>Hero line 2 (italic gold)</label><input id="cs-l2" value="${escapeHtml(s.hero_line2 || '')}" /></div>
      <div class="field"><label>Hero line 3</label><input id="cs-l3" value="${escapeHtml(s.hero_line3 || '')}" /></div>
    </div>
    <div class="pf-grid">
      <div class="field"><label>Sale section</label>
        <select id="cs-sale">
          <option value="1"${s.sale_enabled === '1' ? ' selected' : ''}>Visible</option>
          <option value="0"${s.sale_enabled !== '1' ? ' selected' : ''}>Hidden</option>
        </select>
      </div>
      <div class="field"><label>Sale ends at</label><input id="cs-saleend" type="datetime-local" value="${toLocalInput(s.sale_ends_at)}" /></div>
    </div>
    <p class="admin-hint" style="text-align:left;margin:0 0 24px;">Hero text updates the next time the home page renders. Sale end uses your local time.</p>
    <button type="submit" class="btn-solid" style="padding:14px 40px;">Save Content</button>
  </form>`;
}

function messagesTabHTML() {
  if (!adminMsgCache.length) return '<p class="d-empty">No messages yet.</p>';
  return `<div class="a-msgs">` + adminMsgCache.map(m => {
    const d = m.created_at ? new Date(m.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
    return `<div class="a-msg">
      <div class="a-msg-head">
        <div><strong>${escapeHtml(m.name || '-')}</strong><span class="a-order-meta">${escapeHtml(m.email || '')}${d ? ' · ' + d : ''}</span></div>
        <div style="display:flex;gap:8px;">
          ${m.email ? `<a class="d-mini" href="mailto:${escapeHtml(m.email)}?subject=${encodeURIComponent('Re: Your message to Luxe Boutique')}"><i class="fas fa-reply"></i> Reply</a>` : ''}
          <button class="d-mini danger" data-del-msg="${escapeHtml(String(m.id))}">Delete</button>
        </div>
      </div>
      <p class="a-msg-body">${escapeHtml(m.message || '')}</p>
    </div>`;
  }).join('') + `</div>`;
}

function newsletterTabHTML() {
  if (!adminNlCache.length) return '<p class="d-empty">No subscribers yet.</p>';
  return `<div class="a-toolbar"><div class="a-nl-count">${adminNlCache.length} subscriber(s)</div>
    <button class="d-mini" data-export-newsletter>Export CSV</button></div>
    <ul class="a-nl-list">` + adminNlCache.map(e => {
      const d = e.created_at ? new Date(e.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
      return `<li><span>${escapeHtml(e.email)}</span><span class="a-order-meta">${d}</span></li>`;
    }).join('') + `</ul>`;
}

function downloadCSV(filename, rows) {
  const csv = rows.map(r => r.map(c => `"${String(c == null ? '' : c).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 3000);
}

// ---------- Events ----------
function hashIsAdmin() { return /^\/?admin\/?$/.test((location.hash || '').replace(/^#/, '')); }
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('hashchange', () => { if (hashIsAdmin()) renderPage('admin'); });
document.body.addEventListener('click', (e) => {
  const navEl = e.target.closest('[data-page]');
  if (navEl) {
    e.preventDefault();
    const pg = navEl.getAttribute('data-page');
    if (pg === 'admin') { if (location.hash !== '#/admin') location.hash = '#/admin'; else renderPage('admin'); }
    else { if (hashIsAdmin()) history.replaceState(null, '', location.pathname + location.search); renderPage(pg); }
    return;
  }

  const cardAddBtn = e.target.closest('.card-add');
  if (cardAddBtn) { addToCart(cardAddBtn.getAttribute('data-id')); return; }

  const wishBtn = e.target.closest('[data-wish]');
  if (wishBtn) { e.preventDefault(); toggleWishlist(wishBtn.getAttribute('data-wish')); return; }

  const moveBag = e.target.closest('[data-move-bag]');
  if (moveBag) {
    const id = Number(moveBag.getAttribute('data-move-bag'));
    addToCart(id, 1, true); toggleWishlist(id); showToast('Moved to your bag');
    return;
  }

  const qvBtn = e.target.closest('[data-qv]');
  if (qvBtn) { e.preventDefault(); e.stopPropagation(); openQuickView(qvBtn.getAttribute('data-qv')); return; }

  const pdpFrame = e.target.closest('.pdp-media .frame');
  if (pdpFrame && isTouchDevice()) { openZoomLightbox(); return; }

  const prodEl = e.target.closest('[data-product]');
  if (prodEl) { e.preventDefault(); closeQuickView(); renderProductDetail(prodEl.getAttribute('data-product')); return; }

  const incBtn = e.target.closest('[data-inc]');
  if (incBtn) { changeQty(incBtn.getAttribute('data-inc'), 1); return; }

  const decBtn = e.target.closest('[data-dec]');
  if (decBtn) { changeQty(decBtn.getAttribute('data-dec'), -1); return; }

  const rmBtn = e.target.closest('[data-rm-id]');
  if (rmBtn) { removeLine(rmBtn.getAttribute('data-rm-id')); return; }

  if (e.target.closest('#checkout-cancel')) { renderPage('home'); return; }

  if (e.target.closest('#promo-apply')) {
    const input = document.getElementById('promo-code');
    applyPromo(input ? input.value : '').then(ok => {
      if (ok) { refreshCheckoutTotals(); updateCart(); showToast('Code applied: ' + Math.round((PROMOS[promoCode] || 0) * 100) + '% off'); }
      else showToast('That code is not valid');
    });
    return;
  }
  if (e.target.closest('#promo-remove')) {
    removePromo(); refreshCheckoutTotals(); updateCart(); showToast('Promo removed');
    return;
  }

  if (e.target.closest('#admin-logout')) {
    adminToken = null; stopOrderPolling();
    try { sessionStorage.removeItem('luxe_admin'); } catch (e) {}
    renderAdmin(); return;
  }

  const tabBtn = e.target.closest('[data-atab]');
  if (tabBtn) { adminTab = tabBtn.getAttribute('data-atab'); renderAdminTab(); closeAdminSide(); return; }
  const ovr = e.target.closest('[data-ov-range]');
  if (ovr) { overviewRange = ovr.getAttribute('data-ov-range'); renderAdminTab(); return; }
  if (e.target.closest('#admin-menu-btn')) {
    document.getElementById('admin-side').classList.add('open');
    document.getElementById('admin-scrim').classList.add('open');
    return;
  }
  if (e.target.closest('#admin-scrim')) { closeAdminSide(); return; }
  const srItem = e.target.closest('[data-sr]');
  if (srItem) { handleSearchSelect(srItem); return; }
  const viewOrder = e.target.closest('[data-view-order]');
  if (viewOrder) { openOrderDrawer(viewOrder.getAttribute('data-view-order')); return; }
  if (e.target.closest('#order-drawer-close') || e.target.closest('#order-drawer-scrim')) { closeOrderDrawer(); return; }
  if (!e.target.closest('.admin-search')) {
    const srb = document.getElementById('admin-search-results');
    if (srb) srb.classList.remove('open');
  }

  /* ---- CMS: products ---- */
  if (e.target.closest('[data-add-product]')) { openProductModal(null); return; }
  const stockBtn = e.target.closest('[data-stock-inc]') || e.target.closest('[data-stock-dec]');
  if (stockBtn) {
    const inc = !!e.target.closest('[data-stock-inc]');
    const id = Number((inc ? e.target.closest('[data-stock-inc]') : e.target.closest('[data-stock-dec]')).getAttribute(inc ? 'data-stock-inc' : 'data-stock-dec'));
    const p = PRODUCTS.find(x => x.id === id);
    if (p) {
      const nv = Math.max(0, (p.stock || 0) + (inc ? 1 : -1));
      DB.updateProduct(id, { stock: nv }, adminToken)
        .then(() => { p.stock = nv; renderAdminTab(); showToast(`${p.name}: stock ${nv}`); })
        .catch(() => showToast('Stock update failed'));
    }
    return;
  }
  if (e.target.closest('[data-bulk-price]')) {
    const pct = parseFloat(document.getElementById('bulk-pct').value);
    const dir = document.getElementById('bulk-dir').value;
    if (!pct || pct <= 0 || pct > 90) { showToast('Enter a percent between 1 and 90'); return; }
    const factor = dir === 'up' ? 1 + pct / 100 : 1 - pct / 100;
    if (!confirm(`${dir === 'up' ? 'Increase' : 'Decrease'} ALL product prices by ${pct}%?`)) return;
    showToast('Updating prices…');
    Promise.all(PRODUCTS.map(p => {
      const nv = Math.max(1, Math.round(p.price * factor * 100) / 100);
      return DB.updateProduct(p.id, { price: nv }, adminToken).then(() => { p.price = nv; });
    })).then(() => { renderAdminTab(); showToast('All prices updated'); })
      .catch(() => { renderAdminTab(); showToast('Some updates failed'); });
    return;
  }
  const editP = e.target.closest('[data-edit-product]');
  if (editP) {
    const p = PRODUCTS.find(x => x.id === Number(editP.getAttribute('data-edit-product')));
    if (p) openProductModal(p);
    return;
  }
  const delP = e.target.closest('[data-del-product]');
  if (delP) {
    const id = delP.getAttribute('data-del-product');
    const p = PRODUCTS.find(x => x.id === Number(id));
    if (!confirm(`Delete "${p ? p.name : id}" permanently?`)) return;
    DB.deleteProduct(id, adminToken)
      .then(() => DB.getProducts())
      .then(ps => { PRODUCTS = ps; showToast('Product deleted'); loadAdminData(); })
      .catch(() => showToast('Delete failed'));
    return;
  }
  if (e.target.closest('#pm-cancel') || e.target.id === 'product-modal') { closeProductModal(); return; }

  /* ---- CMS: promos ---- */
  const promoToggle = e.target.closest('[data-promo-toggle]');
  if (promoToggle) {
    const code = promoToggle.getAttribute('data-promo-toggle');
    const pr = adminPromoCache.find(x => x.code === code);
    if (!pr) return;
    DB.savePromo(code, pr.percent, !pr.active, adminToken)
      .then(() => DB.getPromos().catch(() => PROMOS))
      .then(m => { PROMOS = m; updateCart(); showToast(`Promo ${code} ${pr.active ? 'disabled' : 'enabled'}`); loadAdminData(); })
      .catch(() => showToast('Update failed'));
    return;
  }
  const promoDel = e.target.closest('[data-promo-del]');
  if (promoDel) {
    const code = promoDel.getAttribute('data-promo-del');
    if (!confirm(`Delete promo "${code}"?`)) return;
    DB.deletePromo(code, adminToken)
      .then(() => DB.getPromos().catch(() => PROMOS))
      .then(m => { PROMOS = m; if (promoCode === code) { removePromo(); refreshCheckoutTotals(); } updateCart(); showToast('Promo deleted'); loadAdminData(); })
      .catch(() => showToast('Delete failed'));
    return;
  }

  /* ---- CMS: orders ---- */
  const delO = e.target.closest('[data-del-order]');
  if (delO) {
    const num = delO.getAttribute('data-del-order');
    if (!confirm(`Delete order ${num} permanently?`)) return;
    DB.deleteOrder(num, adminToken)
      .then(() => { showToast('Order deleted'); loadAdminData(); })
      .catch(() => showToast('Delete failed'));
    return;
  }
  const delM = e.target.closest('[data-del-msg]');
  if (delM) {
    const id = delM.getAttribute('data-del-msg');
    if (!confirm('Delete this message permanently?')) return;
    DB.deleteMessage(id, adminToken)
      .then(() => { showToast('Message deleted'); loadAdminData(); })
      .catch(() => showToast('Delete failed'));
    return;
  }
  if (e.target.closest('[data-export-orders]')) {
    downloadCSV('luxe-orders.csv', [
      ['Number', 'Date', 'Name', 'Phone', 'Email', 'Address', 'City', 'Items', 'Subtotal', 'Discount', 'Delivery', 'Total', 'Status'],
      ...adminOrdersCache.map(o => [o.number, o.date, o.name, o.phone, o.email || '', o.address || '', o.city || '',
        (o.items || []).map(i => `${i.name} x${i.qty || 1}`).join('; '),
        o.subtotal, o.discount, o.delivery || 0, o.total, o.status])
    ]);
    return;
  }
  const printBtn = e.target.closest('[data-print-invoice]');
  if (printBtn) { printInvoice(printBtn.getAttribute('data-print-invoice')); return; }
  if (e.target.closest('[data-export-customers]')) {
    const map = {};
    (adminOrdersCache || []).forEach(o => {
      const key = String(o.phone || '').replace(/\D/g, '') || String(o.email || '').toLowerCase();
      if (!key) return;
      if (!map[key]) map[key] = { name: o.name || '', phone: o.phone || '', email: o.email || '', orders: 0, spent: 0 };
      map[key].orders++;
      map[key].spent += Number(o.total || 0);
    });
    downloadCSV('luxe-customers.csv', [
      ['Name', 'Phone', 'Email', 'Orders', 'Total Spent'],
      ...Object.values(map).map(c => [c.name, c.phone, c.email, c.orders, c.spent])
    ]);
    return;
  }
  if (e.target.closest('[data-save-settings]')) {
    const fee = document.getElementById('set-delivery-fee').value.trim();
    const lines = document.getElementById('set-delivery-cities').value.split('\n');
    const cities = {};
    lines.forEach(ln => {
      const m = ln.split(':');
      if (m.length >= 2) {
        const city = m[0].trim(), val = parseFloat(m[1]);
        if (city && !isNaN(val) && val >= 0) cities[city] = val;
      }
    });
    showToast('Saving settings…');
    Promise.all([
      DB.saveSetting('delivery_fee', String(parseFloat(fee) || 0), adminToken),
      DB.saveSetting('delivery_cities', JSON.stringify(cities), adminToken),
      DB.saveSetting('sales_goal', String(parseFloat(document.getElementById('set-sales-goal').value) || 0), adminToken),
      DB.saveSetting('store_phone', document.getElementById('set-store-phone').value.trim(), adminToken),
      DB.saveSetting('store_email', document.getElementById('set-store-email').value.trim(), adminToken),
      DB.saveSetting('store_address', document.getElementById('set-store-address').value.trim(), adminToken)
    ]).then(() => DB.getSettings().catch(() => null))
      .then(s => { if (s) SETTINGS = { ...SETTINGS, ...s }; applySettings(); renderAdminTab(); showToast('Settings saved'); })
      .catch(() => showToast('Save failed'));
    return;
  }
  if (e.target.closest('[data-export-newsletter]')) {
    downloadCSV('luxe-newsletter.csv', [
      ['Email', 'Date'],
      ...adminNlCache.map(x => [x.email, x.created_at || ''])
    ]);
    return;
  }
  if (e.target.closest('.qv-close') || e.target === quickview) { closeQuickView(); return; }
  if (e.target === scrim) { closeDrawers(); return; }
});

document.body.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeQuickView(); closeDrawers(); closeMenus(); closeProductModal(); closeZoomLightbox(); closeEmailModal(true); closeOrderDrawer(); }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-product]')) {
    e.preventDefault();
    renderProductDetail(e.target.getAttribute('data-product'));
  }
});

mobileMenuToggle.addEventListener('click', () => {
  mainNav.classList.toggle('active');
  mobileMenuToggle.classList.toggle('active');
});
cartToggle.addEventListener('click', () => { closeDrawers(); openDrawer(cart); });
if (cartClose) cartClose.addEventListener('click', closeDrawers);
wishlistToggle.addEventListener('click', () => { closeDrawers(); updateWishlist(); openDrawer(wishlistDrawer); });
if (wishlistClose) wishlistClose.addEventListener('click', closeDrawers);
document.getElementById('qv-add').addEventListener('click', () => { if (qvId) { addToCart(qvId); closeQuickView(); } });
document.getElementById('zl-close').addEventListener('click', closeZoomLightbox);
document.getElementById('zoom-lightbox').addEventListener('click', e => {
  if (e.target.id === 'zoom-lightbox' || e.target.id === 'zl-scroll') closeZoomLightbox();
});
document.getElementById('zl-img').addEventListener('click', e => {
  const now = Date.now();
  if (now - zlLastTap < 350) { e.target.classList.toggle('zl-zoomed'); zlLastTap = 0; }
  else zlLastTap = now;
});
// Confirmation-email modal buttons (admin)
document.getElementById('em-send').addEventListener('click', () => {
  const o = pendingEmailOrder;
  if (!o) return;
  const tplSel = document.getElementById('em-tpl').value;
  const tplId = tplSel === 'auto' ? nextEmailTemplate() : tplSel;
  const note = document.getElementById('em-note').value.trim();
  document.getElementById('email-modal').classList.remove('open');
  pendingEmailOrder = null;
  doStatusUpdate(o.number, 'confirmed');
  showToast('Sending confirmation email…');
  sendOrderConfirmationEmail(o, tplId, note).then(sent => {
    showToast(sent ? 'Confirmation email sent' : 'Email failed — check EmailJS setup');
  });
});
document.getElementById('em-skip').addEventListener('click', () => {
  const o = pendingEmailOrder;
  document.getElementById('email-modal').classList.remove('open');
  pendingEmailOrder = null;
  if (o) doStatusUpdate(o.number, 'confirmed');
});
document.getElementById('em-cancel').addEventListener('click', () => closeEmailModal(true));
document.getElementById('email-modal').addEventListener('click', e => {
  if (e.target.id === 'email-modal') closeEmailModal(true);
});
checkoutBtn.addEventListener('click', () => {
  if (!cartContents.length) { showToast('Your bag is empty'); return; }
  renderPage('checkout');
});

// Header state on scroll
window.addEventListener('scroll', () => {
  if (topwrap) topwrap.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Filters
document.addEventListener('change', (e) => {
  if (e.target.id === 'filter-category' || e.target.id === 'sort-products') {
    if (e.target.id === 'filter-category') currentFilter = e.target.value;
    else currentSort = e.target.value;
    const y = window.scrollY; // stay where the shopper is
    renderPage('products');
    window.scrollTo(0, y);
  }
  if (e.target.matches('[data-status]')) {
    const num = e.target.getAttribute('data-status');
    const newStatus = e.target.value;
    const o = adminOrdersCache.find(x => x.number === num);
    if (newStatus === 'confirmed' && o && o.email && emailjsReady) {
      openEmailModal(num, o);
      return;
    }
    doStatusUpdate(num, newStatus, e.target);
    return;
  }
  if (e.target.id === 'co-city') {
    checkoutCity = e.target.value === '__other' ? '' : e.target.value;
    refreshCheckoutTotals();
    return;
  }
  if (e.target.id === 'admin-order-filter') {
    adminOrderFilter = e.target.value;
    renderAdminTab();
  }
  if (e.target.matches('[data-visible]')) {
    const id = Number(e.target.getAttribute('data-visible'));
    const vis = e.target.checked;
    const p = PRODUCTS.find(x => x.id === id);
    DB.updateProduct(id, { visible: vis }, adminToken)
      .then(() => { if (p) p.visible = vis; renderAdminTab(); showToast(vis ? 'Product visible on store' : 'Product hidden from store'); })
      .catch(() => { renderAdminTab(); showToast('Update failed'); });
    return;
  }
  if (e.target.id === 'set-store-open') {
    const val = e.target.checked ? '1' : '0';
    DB.saveSetting('store_open', val, adminToken)
      .then(() => DB.getSettings().catch(() => null))
      .then(s => { if (s) SETTINGS = { ...SETTINGS, ...s }; applySettings(); renderAdminTab(); showToast(e.target.checked ? 'Store is OPEN' : 'Store is CLOSED'); })
      .catch(() => showToast('Save failed'));
    return;
  }
  if (e.target.id === 'pf-upload') {
    const file = e.target.files[0];
    if (!file) return;
    showToast('Uploading image…');
    DB.uploadImage(file, adminToken)
      .then(url => {
        document.getElementById('pf-image').value = url;
        const prev = document.getElementById('pf-preview');
        prev.src = url; prev.style.display = 'block';
        showToast('Image ready');
      })
      .catch(err => showToast(err.message || 'Upload failed'));
  }
});
document.addEventListener('input', (e) => {
  if (e.target.id === 'search-products') {
    currentSearch = e.target.value;
    const grid = document.getElementById('products-grid');
    if (grid) { // update only the grid: no scroll jump, no focus loss
      killGridTriggers();
      grid.innerHTML = productGridHTML(getFilteredProducts());
      bindReveals(grid);
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }
  }
  if (e.target.id === 'admin-order-search') {
    adminOrderSearch = e.target.value;
    const pos = e.target.selectionStart;
    renderAdminTab();
    const inp = document.getElementById('admin-order-search');
    if (inp) { inp.focus(); try { inp.setSelectionRange(pos, pos); } catch (err) {} }
  }
  if (e.target.id === 'admin-global-search') {
    renderAdminSearch(e.target.value);
  }
});

// Forms
document.body.addEventListener('submit', (e) => {
  if (e.target.id === 'contact-form') {
    e.preventDefault();
    const n = document.getElementById('contact-name').value.trim();
    const em = document.getElementById('contact-email').value.trim();
    const m = document.getElementById('contact-message').value.trim();
    if (!n || !validEmail(em) || !m) { showToast('Please complete all fields with a valid email'); return; }
    DB.createMessage({ name: n, email: em, message: m })
      .then(() => { e.target.reset(); showToast('Message sent: we reply within 24 hours'); })
      .catch(() => showToast('Could not send message: please try again'));
    return;
  }
  if (e.target.id === 'nl-form') {
    e.preventDefault();
    const input = document.getElementById('nl-email');
    const email = input.value.trim();
    if (!validEmail(email)) { showToast('Please enter a valid email'); input.focus(); return; }
    DB.createNewsletter(email)
      .then(() => { input.value = ''; showToast('Welcome to the inner circle: code WELCOME10'); })
      .catch(() => { input.value = ''; showToast('Welcome to the inner circle: code WELCOME10'); });
  }
  if (e.target.id === 'checkout-form') {
    e.preventDefault();
    if (!cartContents.length) { showToast('Your bag is empty'); return; }
    const name = document.getElementById('co-name').value.trim();
    const phone = document.getElementById('co-phone').value.trim();
    const email = document.getElementById('co-email').value.trim();
    const city = document.getElementById('co-city').value;
    const address = document.getElementById('co-address').value.trim();
    const notes = document.getElementById('co-notes').value.trim();
    if (!name || !validPhone(phone) || !address) { showToast('Please add name, valid phone & address'); return; }
    if (!city) { showToast('Please select your city'); return; }
    if (email && !validEmail(email)) { showToast('Please enter a valid email or leave it blank'); return; }
    const sub = cartSubtotal(), disc = cartDiscount(), del = cartDelivery(), total = cartTotal();
    const order = {
      number: makeOrderNumber(),
      date: new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }),
      name, phone, email, city: city === '__other' ? 'Other' : city, address, notes,
      items: cartContents.map(l => ({ id: l.id, name: l.name, price: l.price, qty: l.qty })),
      subtotal: Number(sub.toFixed(2)),
      discount: Number(disc.toFixed(2)),
      delivery: Number(del.toFixed(2)),
      promo: promoCode || null,
      total: Number(total.toFixed(2)),
      status: 'placed', payment: 'COD'
    };
    DB.createOrder(order).then(() => {
      cartContents = []; saveCart(); updateCart(); closeDrawers();
      renderOrderSuccess(order);
    }).catch(() => showToast('Order failed: check connection and try again'));
  }
  if (e.target.id === 'track-form') {
    e.preventDefault();
    const num = document.getElementById('track-number').value.trim();
    const box = document.getElementById('track-result');
    if (!num) { showToast('Enter your order number'); return; }
    box.innerHTML = '<p class="d-empty" style="padding:30px 10px;">Looking up your order…</p>';
    DB.getOrder(num).then(order => {
      box.innerHTML = order ? orderTimelineHTML(order)
        : '<p class="d-empty" style="padding:30px 10px;">No order found with that number.</p>';
    }).catch(() => {
      box.innerHTML = '<p class="d-empty" style="padding:30px 10px;">Lookup failed: please try again.</p>';
    });
  }
  if (e.target.id === 'product-form') {
    e.preventDefault();
    const id = document.getElementById('pf-id').value;
    const existing = id ? PRODUCTS.find(x => x.id === Number(id)) : null;
    const gallery = document.getElementById('pf-images').value.split('\n').map(s => s.trim()).filter(Boolean);
    const main = document.getElementById('pf-image').value.trim();
    const data = {
      name: document.getElementById('pf-name').value.trim(),
      price: parseFloat(document.getElementById('pf-price').value),
      category: document.getElementById('pf-category').value.trim().toLowerCase(),
      stock: parseInt(document.getElementById('pf-stock').value, 10) || 0,
      visible: document.getElementById('pf-visible').checked,
      badge: document.getElementById('pf-badge').value.trim(),
      rating: Math.min(5, Math.max(0, parseFloat(document.getElementById('pf-rating').value) || 0)),
      reviews: existing ? (existing.reviews || 0) : 0,
      description: document.getElementById('pf-desc').value.trim(),
      image: main,
      images: gallery.length ? [main, ...gallery.filter(g => g !== main)].slice(0, 6) : [main]
    };
    if (!data.name || !(data.price > 0) || !data.category || !data.image) { showToast('Name, price, category & image are required'); return; }
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Saving…';
    const done = () => DB.getProducts().then(ps => {
      PRODUCTS = ps; closeProductModal(); showToast('Product saved'); loadAdminData();
    });
    const fail = (err) => { btn.disabled = false; btn.textContent = 'Save Product'; showToast((err && err.message) || 'Save failed'); };
    if (id) DB.updateProduct(id, data, adminToken).then(done).catch(fail);
    else DB.createProduct(data, adminToken).then(done).catch(fail);
  }
  if (e.target.id === 'promo-form') {
    e.preventDefault();
    const code = document.getElementById('promo-code-in').value.trim().toUpperCase();
    const pct = parseFloat(document.getElementById('promo-pct-in').value);
    if (!code || !(pct > 0) || pct > 90) { showToast('Enter a code and 1–90%'); return; }
    DB.savePromo(code, pct / 100, true, adminToken)
      .then(() => DB.getPromos().catch(() => PROMOS))
      .then(m => { PROMOS = m; updateCart(); showToast(`Promo ${code} added`); loadAdminData(); })
      .catch(() => showToast('Save failed'));
  }
  if (e.target.id === 'content-form') {
    e.preventDefault();
    const saleEndRaw = document.getElementById('cs-saleend').value;
    const vals = {
      announcement: document.getElementById('cs-announcement').value.trim(),
      hero_eyebrow: document.getElementById('cs-eyebrow').value.trim(),
      hero_line1: document.getElementById('cs-l1').value.trim(),
      hero_line2: document.getElementById('cs-l2').value.trim(),
      hero_line3: document.getElementById('cs-l3').value.trim(),
      sale_enabled: document.getElementById('cs-sale').value,
      sale_ends_at: saleEndRaw ? new Date(saleEndRaw).toISOString() : ''
    };
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Saving…';
    Promise.all(Object.keys(vals).map(k => DB.saveSetting(k, vals[k], adminToken)))
      .then(() => {
        Object.keys(vals).forEach(k => { SETTINGS[k] = vals[k]; });
        applySettings();
        btn.disabled = false; btn.textContent = 'Save Content';
        showToast('Content updated: changes are live');
      })
      .catch(() => { btn.disabled = false; btn.textContent = 'Save Content'; showToast('Save failed'); });
  }
  if (e.target.id === 'admin-login-form') {
    e.preventDefault();
    const errEl = document.getElementById('admin-err');
    errEl.textContent = '';
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Signing in…';
    const done = (token) => {
      adminToken = token; adminTab = 'overview';
      try { sessionStorage.setItem('luxe_admin', JSON.stringify({ token, ts: Date.now() })); } catch (e) {}
      renderAdmin();
    };
    const fail = (m) => { errEl.textContent = m; btn.disabled = false; btn.textContent = 'Sign In'; };
    if (USE_SUPABASE) {
      const email = document.getElementById('admin-email').value.trim();
      const pw = document.getElementById('admin-pass').value;
      if (!validEmail(email) || !pw) { fail('Enter your admin email and password'); return; }
      DB.adminLogin(email, pw).then(done).catch(err => fail(err.message || 'Sign in failed'));
    } else {
      const pw = document.getElementById('admin-pass').value;
      DB.adminLogin(pw).then(done).catch(() => fail('Invalid password (hint: luxe-admin)'));
    }
  }
});

document.addEventListener('click', (e) => {
  if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) closeMenus();
});

// ---------- Init ----------
(async function init() {
  SETTINGS = defaultSettings();
  initEmailJS();
  try {
    const [products, promos, settings] = await Promise.all([
      DB.getProducts(),
      DB.getPromos().catch(() => null),
      DB.getSettings().catch(() => null)
    ]);
    PRODUCTS = products;
    if (promos) PROMOS = promos;
    if (settings) SETTINGS = { ...SETTINGS, ...settings };
  } catch (e) {
    console.warn('Database load failed, using local seed:', e);
    PRODUCTS = await LocalAdapter.getProducts();
  }
  if (!PRODUCTS.length) {
    console.warn('No products returned: falling back to local seed');
    PRODUCTS = await LocalAdapter.getProducts();
  }
  applySettings();
  loadPersisted();
  updateCart();
  updateWishlist();
  renderPage('home');
  if (hashIsAdmin()) renderPage('admin');
  const y = document.getElementById('copyright-year');
  if (y) y.textContent = new Date().getFullYear();
  runPreloader(() => heroIntro());
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
