// ── URL param ───────────────────────────────────────────
const params    = new URLSearchParams(window.location.search);
const productId = params.get('id');

// ── DOM refs ────────────────────────────────────────────
const mainImage        = document.getElementById('mainImage');
const thumbnailsWrap   = document.getElementById('thumbnails');
const selectedColorText= document.getElementById('selectedColor');
const colorContainer   = document.getElementById('colorContainer');
const increaseBtn      = document.getElementById('increase');
const decreaseBtn      = document.getElementById('decrease');
const quantityInput    = document.getElementById('quantity');
const addToCartBtn     = document.getElementById('addToCart');
const productBrandEl   = document.getElementById('productBrand');
const productCatEl     = document.getElementById('productCategory');
const productNameEl    = document.getElementById('productName');
const productPriceEl   = document.getElementById('productPrice');
const productDescEl    = document.getElementById('productDesc');
const breadcrumbName   = document.getElementById('breadcrumbName');

const cartButton    = document.getElementById('cartButton');
const miniCart      = document.getElementById('miniCart');
const miniCartItems = document.getElementById('miniCartItems');
const miniCartTotal = document.getElementById('miniCartTotal');

// ── Header ──────────────────────────────────────────────
document.getElementById('menuButton')?.addEventListener('click', () =>
    document.getElementById('mobileMenu')?.classList.toggle('hidden'));

if (cartButton && miniCart) {
    cartButton.addEventListener('click', e => {
        e.stopPropagation();
        miniCart.classList.toggle('hidden');
        updateMiniCart();
    });
    document.addEventListener('click', e => {
        if (!miniCart.contains(e.target) && !cartButton.contains(e.target))
            miniCart.classList.add('hidden');
    });
}

// ── Mini cart ───────────────────────────────────────────
function updateMiniCart() {
    if (!miniCartItems || !miniCartTotal) return;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    miniCartItems.innerHTML = '';
    let total = 0;

    if (!cart.length) {
        miniCartItems.innerHTML = '<p class="text-gray-500 text-xs text-center py-4">El carrito está vacío</p>';
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

// ── Load product ────────────────────────────────────────
const categoryColors = {
    Keyboard: 'bg-blue-500/15 text-blue-400',
    Mouse:    'bg-purple-500/15 text-purple-400',
    Headset:  'bg-green-500/15 text-green-400',
    Wheel:    'bg-orange-500/15 text-orange-400',
};

fetch('/PR_02/assets/data/products.json')
    .then(res => res.json())
    .then(products => {
        const product = products.find(p => p.id === productId);
        if (!product) throw new Error('Producto no encontrado');

        // Text fields
        if (breadcrumbName)   breadcrumbName.textContent  = product.name;
        if (productBrandEl)   productBrandEl.textContent  = product.brand;
        if (productNameEl)    productNameEl.textContent   = product.name;
        if (productPriceEl)   productPriceEl.textContent  = product.price.toFixed(2) + '€';
        if (productDescEl)    productDescEl.textContent   = product.description;

        // Category badge
        if (productCatEl) {
            productCatEl.textContent = product.category;
            const cls = categoryColors[product.category] || 'bg-white/10 text-gray-400';
            productCatEl.className = `text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`;
        }

        // Main image
        mainImage.src = product.images[0];

        // Thumbnails
        thumbnailsWrap.innerHTML = '';
        product.images.forEach((src, i) => {
            const thumb = document.createElement('img');
            thumb.src = src;
            thumb.alt = `Vista ${i + 1}`;
            thumb.className = [
                'cursor-pointer rounded-xl border-2 transition duration-200',
                'object-cover w-full h-24 bg-[#1d1f28]',
                i === 0 ? 'border-blue-500' : 'border-white/10 hover:border-blue-500/50'
            ].join(' ');
            thumb.addEventListener('click', () => {
                mainImage.src = src;
                thumbnailsWrap.querySelectorAll('img').forEach(t => {
                    t.classList.remove('border-blue-500');
                    t.classList.add('border-white/10');
                });
                thumb.classList.add('border-blue-500');
                thumb.classList.remove('border-white/10');
            });
            thumbnailsWrap.appendChild(thumb);
        });

        // Colors
        colorContainer.innerHTML = '';
        selectedColorText.textContent = 'Seleccionado: ' + product.colors[0];

        product.colors.forEach((color, i) => {
            const btn = document.createElement('button');
            const bg  = color === 'Black'
                ? 'bg-gray-900 border-gray-600'
                : 'bg-white border-gray-300';
            btn.className = `color-btn w-9 h-9 rounded-full border-2 ${bg} transition ring-2 ring-transparent hover:ring-blue-500/50`;
            if (i === 0) btn.classList.add('ring-blue-500');
            btn.dataset.color = color;
            btn.title = color;
            btn.addEventListener('click', () => {
                colorContainer.querySelectorAll('.color-btn').forEach(b => {
                    b.classList.remove('ring-blue-500');
                    b.classList.add('ring-transparent');
                });
                btn.classList.add('ring-blue-500');
                btn.classList.remove('ring-transparent');
                selectedColorText.textContent = 'Seleccionado: ' + color;
            });
            colorContainer.appendChild(btn);
        });
    })
    .catch(err => {
        console.error(err);
        alert('Error cargando el producto: ' + err.message);
    });

// ── Quantity ────────────────────────────────────────────
increaseBtn?.addEventListener('click', () =>
    quantityInput.value = parseInt(quantityInput.value) + 1);

decreaseBtn?.addEventListener('click', () => {
    if (parseInt(quantityInput.value) > 1)
        quantityInput.value = parseInt(quantityInput.value) - 1;
});

// ── Add to cart ─────────────────────────────────────────
addToCartBtn?.addEventListener('click', () => {
    const selectedColor = colorContainer.querySelector('.color-btn.ring-blue-500')?.dataset.color || 'Default';
    const quantity      = parseInt(quantityInput.value);
    const price         = parseFloat(productPriceEl.textContent);

    const productToAdd = {
        id:       productId,
        name:     productNameEl.textContent,
        price,
        image:    mainImage.src,
        color:    selectedColor,
        quantity
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const idx = cart.findIndex(p => p.id === productToAdd.id && p.color === productToAdd.color);
    if (idx >= 0) cart[idx].quantity += quantity;
    else cart.push(productToAdd);

    localStorage.setItem('cart', JSON.stringify(cart));
    updateMiniCart();
    if (miniCart) miniCart.classList.remove('hidden');
});

// ── Init ────────────────────────────────────────────────
updateMiniCart();