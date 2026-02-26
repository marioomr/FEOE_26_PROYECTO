// ── Header: hamburger ──────────────────────────────────
document.getElementById('menuButton').addEventListener('click', () =>
    document.getElementById('mobileMenu').classList.toggle('hidden'));

// ── Header: mini cart ──────────────────────────────────
const cartButton   = document.getElementById('cartButton');
const miniCart     = document.getElementById('miniCart');
const miniCartItems = document.getElementById('miniCartItems');
const miniCartTotal = document.getElementById('miniCartTotal');

cartButton.addEventListener('click', (e) => {
    e.stopPropagation();
    miniCart.classList.toggle('hidden');
    updateMiniCart();
});

document.addEventListener('click', (e) => {
    if (!miniCart.contains(e.target) && !cartButton.contains(e.target))
        miniCart.classList.add('hidden');
});

function updateMiniCart() {
    if (!miniCartItems || !miniCartTotal) return;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    miniCartItems.innerHTML = '';
    let total = 0;

    if (!cart.length) {
        miniCartItems.innerHTML = '<p class="text-gray-400 text-xs text-center py-4">El carrito está vacío</p>';
        miniCartTotal.textContent = '0€';
        return;
    }

    cart.forEach(item => {
        const line = parseFloat(item.price) * item.quantity;
        total += line;
        const d = document.createElement('div');
        d.className = 'flex items-center gap-3';
        d.innerHTML = `
            <img src="${item.image}" class="w-10 h-10 object-cover rounded-lg flex-shrink-0">
            <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-white truncate">${item.name}</p>
                <p class="text-xs text-gray-400">${item.color} · x${item.quantity}</p>
            </div>
            <span class="text-xs font-bold text-blue-400 flex-shrink-0">${line.toFixed(2)}€</span>`;
        miniCartItems.appendChild(d);
    });

    miniCartTotal.textContent = total.toFixed(2) + '€';
}

updateMiniCart();

// ── Featured products ──────────────────────────────────
const IDS_DESTACADOS = [
    "4ac90730-29ab-436b-92b0-54e54a8869a0", // PRO X TKL keyboard
    "f81e16f6-9f53-408d-b792-b2a3228b4108", // PRO X SL2 mouse
    "d2df5222-00fd-49e5-9817-f7252935649c"  // PRO X WL headset
];

const contenedor = document.getElementById('productos');

fetch('/PR_02/assets/data/products.json')
    .then(res => res.json())
    .then(products => {
        const destacados = IDS_DESTACADOS
            .map(id => products.find(p => p.id === id))
            .filter(Boolean);
        destacados.forEach(p => contenedor.appendChild(crearCard(p)));
    });

const categoryColors = {
    Keyboard: 'bg-blue-500/15 text-blue-400',
    Mouse:    'bg-purple-500/15 text-purple-400',
    Headset:  'bg-green-500/15 text-green-400',
    Wheel:    'bg-orange-500/15 text-orange-400',
};

function crearCard(product) {
    const card = document.createElement('a');
    card.href = `pages/product.html?id=${product.id}`;
    card.className = [
        'group flex flex-col bg-[#1d1f28] border border-white/8 rounded-2xl overflow-hidden',
        'hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition duration-300'
    ].join(' ');

    const badgeClass = categoryColors[product.category] || 'bg-white/10 text-gray-400';

    const colorDots = product.colors.map(c => {
        const bg = c === 'Black'
            ? 'bg-gray-800 border border-white/20'
            : 'bg-white border border-gray-300';
        return `<span class="w-3 h-3 rounded-full ${bg} inline-block"></span>`;
    }).join('');

    card.innerHTML = `
        <div class="bg-[#13151f] flex items-center justify-center h-52 overflow-hidden px-6 pt-6 pb-2">
            <img src="${product.images[0]}" alt="${product.name}"
                class="h-full w-full object-contain group-hover:scale-105 transition duration-300">
        </div>
        <div class="flex flex-col gap-2 p-5 flex-1">
            <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-gray-400">${product.brand}</span>
                <span class="text-xs font-semibold px-2 py-0.5 rounded-full ${badgeClass}">${product.category}</span>
            </div>
            <p class="text-white font-semibold text-sm leading-snug">${product.name}</p>
            <p class="text-gray-400 text-xs leading-snug line-clamp-2">${product.description}</p>
            <div class="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                <span class="text-blue-400 font-bold text-base">${product.price.toFixed(2)}€</span>
                <div class="flex items-center gap-1.5">${colorDots}</div>
            </div>
        </div>`;

    return card;
}