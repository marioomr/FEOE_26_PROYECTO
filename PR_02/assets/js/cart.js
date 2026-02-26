// ══════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════
function getCart()        { return JSON.parse(localStorage.getItem('cart')) || []; }
function saveCart(c)      { localStorage.setItem('cart', JSON.stringify(c)); }
function getShipping()    { return parseFloat(localStorage.getItem('shippingCost') || 0); }
function getShipLabel()   { return localStorage.getItem('shippingLabel') || 'Standard (Free)'; }
function calcSubtotal()   { return getCart().reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0); }

function set(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

// ══════════════════════════════════════════════════════
//  HEADER — mini cart + hamburger (todas las páginas)
// ══════════════════════════════════════════════════════
const _cartBtn  = document.getElementById('cartButton');
const _miniCart = document.getElementById('miniCart');

document.getElementById('menuButton')?.addEventListener('click', () =>
    document.getElementById('mobileMenu')?.classList.toggle('hidden'));

if (_cartBtn && _miniCart) {
    _cartBtn.addEventListener('click', e => {
        e.stopPropagation();
        _miniCart.classList.toggle('hidden');
        renderMiniCart();
    });
    document.addEventListener('click', e => {
        if (!_miniCart.contains(e.target) && !_cartBtn.contains(e.target))
            _miniCart.classList.add('hidden');
    });
}

function renderMiniCart() {
    const wrap  = document.getElementById('miniCartItems');
    const total = document.getElementById('miniCartTotal');
    if (!wrap || !total) return;

    const cart = getCart();
    wrap.innerHTML = '';
    let sum = 0;

    if (!cart.length) {
        wrap.innerHTML = '<p class="text-gray-500 text-xs text-center py-4">El carrito está vacío</p>';
        total.textContent = '0€';
        return;
    }

    cart.forEach(item => {
        const line = parseFloat(item.price) * item.quantity;
        sum += line;
        const d = document.createElement('div');
        d.className = 'flex items-center gap-3';
        d.innerHTML = `
            <img src="${item.image}" class="w-10 h-10 object-cover rounded-lg flex-shrink-0">
            <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-white truncate">${item.name}</p>
                <p class="text-xs text-gray-400">${item.color} · x${item.quantity}</p>
            </div>
            <span class="text-xs font-bold text-blue-400 flex-shrink-0">${line.toFixed(2)}€</span>`;
        wrap.appendChild(d);
    });

    total.textContent = sum.toFixed(2) + '€';
}

// ══════════════════════════════════════════════════════
//  ORDER SUMMARY PANEL  (derecha en las 3 páginas)
// ══════════════════════════════════════════════════════
function updateSummary() {
    const subtotal  = calcSubtotal();
    const shipping  = getShipping();
    const total     = subtotal + shipping;
    const shipText  = shipping === 0 ? 'Free' : shipping.toFixed(2) + '€';

    // IDs presentes en cart.html y shipping.html
    set('summarySubtotal', subtotal.toFixed(2) + '€');
    set('summaryTaxes',    '0€');
    set('summaryShipping', shipText);          // cart + shipping
    set('summaryTotal',    total.toFixed(2) + '€');

    // IDs presentes solo en payment.html
    set('summaryShippingCost',  shipText);
    set('summaryShippingLabel', getShipLabel());
}

// Mini lista de productos dentro del panel (shipping + payment)
function renderSummaryItems() {
    const wrap = document.getElementById('summaryItems');
    if (!wrap) return;
    wrap.innerHTML = '';
    getCart().forEach(item => {
        const line = parseFloat(item.price) * item.quantity;
        const d = document.createElement('div');
        d.className = 'flex items-center gap-3';
        d.innerHTML = `
            <img src="${item.image}" class="w-9 h-9 object-cover rounded-lg flex-shrink-0">
            <span class="flex-1 text-gray-300 text-sm truncate">${item.name}
                <span class="text-gray-500">x${item.quantity}</span>
            </span>
            <span class="text-white text-sm font-medium flex-shrink-0">${line.toFixed(2)}€</span>`;
        wrap.appendChild(d);
    });
}

// ══════════════════════════════════════════════════════
//  CART PAGE
// ══════════════════════════════════════════════════════
function renderCart() {
    const wrap = document.getElementById('cartItems');
    if (!wrap) return;

    wrap.innerHTML = '';
    const cart = getCart();
    const emptyMsg = document.getElementById('emptyMsg');

    if (!cart.length) {
        emptyMsg?.classList.remove('hidden');
        updateSummary();
        return;
    }
    emptyMsg?.classList.add('hidden');

    cart.forEach((item, idx) => {
        const line = parseFloat(item.price) * item.quantity;
        const row = document.createElement('div');
        row.className = 'flex items-center gap-4 py-4 border-b border-white/5 last:border-0';
        row.innerHTML = `
            <img src="${item.image}" class="w-20 h-20 object-cover rounded-xl flex-shrink-0">
            <div class="flex-1 min-w-0">
                <p class="text-white font-semibold text-sm truncate">${item.name}</p>
                <p class="text-gray-400 text-xs mt-0.5">Color: ${item.color}</p>
                <p class="text-blue-400 font-bold text-sm mt-1">${parseFloat(item.price).toFixed(2)}€</p>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
                <button data-idx="${idx}"
                    class="decrease-btn w-7 h-7 rounded-lg bg-white/10 hover:bg-blue-500/30 text-white font-bold transition flex items-center justify-center">−</button>
                <span class="text-white text-sm w-5 text-center select-none">${item.quantity}</span>
                <button data-idx="${idx}"
                    class="increase-btn w-7 h-7 rounded-lg bg-white/10 hover:bg-blue-500/30 text-white font-bold transition flex items-center justify-center">+</button>
            </div>
            <div class="text-right flex-shrink-0 min-w-[56px]">
                <p class="text-white font-bold text-sm">${line.toFixed(2)}€</p>
                <button data-id="${item.id}" data-color="${item.color}"
                    class="delete-btn text-gray-500 hover:text-red-400 transition text-sm mt-1">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>`;
        wrap.appendChild(row);
    });

    // Events
    wrap.querySelectorAll('.increase-btn').forEach(btn =>
        btn.addEventListener('click', () => {
            const c = getCart();
            c[+btn.dataset.idx].quantity++;
            saveCart(c); renderCart(); renderMiniCart();
        }));

    wrap.querySelectorAll('.decrease-btn').forEach(btn =>
        btn.addEventListener('click', () => {
            const c = getCart();
            const i = +btn.dataset.idx;
            if (c[i].quantity > 1) c[i].quantity--;
            else c.splice(i, 1);
            saveCart(c); renderCart(); renderMiniCart();
        }));

    wrap.querySelectorAll('.delete-btn').forEach(btn =>
        btn.addEventListener('click', () => {
            let c = getCart().filter(x => !(x.id === btn.dataset.id && x.color === btn.dataset.color));
            saveCart(c); renderCart(); renderMiniCart();
        }));

    updateSummary();
}

// ══════════════════════════════════════════════════════
//  SHIPPING PAGE
// ══════════════════════════════════════════════════════
function initShipping() {
    const radios = document.querySelectorAll('input[name="shipping"]');
    if (!radios.length) return;

    // Restaura selección previa
    const saved = localStorage.getItem('shippingCost');
    if (saved === '9.99') {
        const exp = document.getElementById('shippingExpress');
        if (exp) exp.checked = true;
    }

    function onchange() {
        const val   = parseFloat(document.querySelector('input[name="shipping"]:checked')?.value || 0);
        const label = val === 0 ? 'Standard (Free)' : 'Express (9.99€)';
        localStorage.setItem('shippingCost',  val);
        localStorage.setItem('shippingLabel', label);

        // Estilo activo en las opciones
        document.querySelectorAll('.shipping-option').forEach(opt => {
            const radio = opt.querySelector('input[type="radio"]');
            if (radio?.checked) {
                opt.classList.add('border-blue-500', 'bg-blue-500/5');
                opt.classList.remove('border-white/10');
            } else {
                opt.classList.remove('border-blue-500', 'bg-blue-500/5');
                opt.classList.add('border-white/10');
            }
        });

        renderSummaryItems();
        updateSummary();
    }

    radios.forEach(r => r.addEventListener('change', onchange));
    onchange(); // render inicial
}

// ══════════════════════════════════════════════════════
//  PAYMENT PAGE
// ══════════════════════════════════════════════════════
function initPayment() {
    const cardRadio = document.getElementById('cardRadio');
    if (!cardRadio) return;

    const cardFields = document.getElementById('cardFields');

    function showCard(show) {
        if (!cardFields) return;
        if (show) {
            cardFields.classList.remove('hidden');
            cardFields.classList.add('flex');
        } else {
            cardFields.classList.add('hidden');
            cardFields.classList.remove('flex');
        }
    }

    // Estilo activo en opciones de pago
    function updatePaymentStyles() {
        document.querySelectorAll('.payment-option').forEach(opt => {
            const radio = opt.querySelector('input[type="radio"]');
            if (radio?.checked) {
                opt.classList.add('border-blue-500', 'bg-blue-500/5');
                opt.classList.remove('border-white/10');
            } else {
                opt.classList.remove('border-blue-500', 'bg-blue-500/5');
                opt.classList.add('border-white/10');
            }
        });
        showCard(cardRadio.checked);
    }

    document.querySelectorAll('input[name="payment"]').forEach(r =>
        r.addEventListener('change', updatePaymentStyles));

    renderSummaryItems();
    updateSummary();
    updatePaymentStyles();
}

// ══════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════
renderMiniCart();
renderCart();
initShipping();
initPayment();