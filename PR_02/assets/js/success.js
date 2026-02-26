// ── Header ──────────────────────────────────────────────
document.getElementById('menuButton')?.addEventListener('click', () =>
    document.getElementById('mobileMenu')?.classList.toggle('hidden'));

const cartButton = document.getElementById('cartButton');
const miniCart   = document.getElementById('miniCart');

if (cartButton && miniCart) {
    cartButton.addEventListener('click', e => {
        e.stopPropagation();
        miniCart.classList.toggle('hidden');
        renderMiniCart();
    });
    document.addEventListener('click', e => {
        if (!miniCart.contains(e.target) && !cartButton.contains(e.target))
            miniCart.classList.add('hidden');
    });
}

function renderMiniCart() {
    const wrap  = document.getElementById('miniCartItems');
    const total = document.getElementById('miniCartTotal');
    if (!wrap || !total) return;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
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

// ── Order number ────────────────────────────────────────
function generateOrderNumber() {
    return '#' + Math.floor(100000 + Math.random() * 900000);
}
const el = document.getElementById('orderNumber');
if (el) el.textContent = generateOrderNumber();

// ── Render order summary ────────────────────────────────
function renderOrderSummary() {
    const cart         = JSON.parse(localStorage.getItem('cart')) || [];
    const shippingCost = parseFloat(localStorage.getItem('shippingCost') || 0);
    const shippingLabel= localStorage.getItem('shippingLabel') || 'Standard (Free)';

    const orderWrap  = document.getElementById('order');
    const totalsWrap = document.getElementById('orderTotals');
    if (!orderWrap || !totalsWrap) return;

    let subtotal = 0;

    // Items
    orderWrap.innerHTML = '';
    cart.forEach(item => {
        const line = parseFloat(item.price) * item.quantity;
        subtotal += line;
        const d = document.createElement('div');
        d.className = 'flex items-center gap-3';
        d.innerHTML = `
            <img src="${item.image}" class="w-12 h-12 object-cover rounded-xl flex-shrink-0 bg-[#1d1f28]">
            <div class="flex-1 min-w-0">
                <p class="text-white text-sm font-semibold truncate">${item.name}</p>
                <p class="text-gray-500 text-xs">Color: ${item.color} · Cant: ${item.quantity}</p>
            </div>
            <span class="text-white text-sm font-bold flex-shrink-0">${line.toFixed(2)}€</span>`;
        orderWrap.appendChild(d);
    });

    // Totals
    const total = subtotal + shippingCost;
    const shipText = shippingCost === 0 ? 'Free' : shippingCost.toFixed(2) + '€';

    totalsWrap.innerHTML = `
        <div class="flex justify-between">
            <span>Subtotal</span>
            <span class="text-white font-medium">${subtotal.toFixed(2)}€</span>
        </div>
        <div class="flex justify-between">
            <span>Envío</span>
            <div class="text-right">
                <span class="text-white font-medium block">${shipText}</span>
                <span class="text-gray-600 text-xs">${shippingLabel}</span>
            </div>
        </div>
        <div class="flex justify-between">
            <span>Taxes</span>
            <span class="text-white font-medium">0€</span>
        </div>
        <div class="flex justify-between border-t border-white/8 pt-3 text-base font-bold text-white">
            <span>Total</span>
            <span>${total.toFixed(2)}€</span>
        </div>`;
}

renderOrderSummary();
renderMiniCart();

// ── Clear cart after rendering ──────────────────────────
localStorage.removeItem('cart');
localStorage.removeItem('shippingCost');
localStorage.removeItem('shippingLabel');