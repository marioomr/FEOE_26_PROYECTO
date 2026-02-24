const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

const mainImage = document.getElementById('mainImage');
const thumbnailsContainer = document.querySelector('.grid');
const selectedColorText = document.getElementById('selectedColor');
const colorContainer = document.getElementById('colorContainer');

const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const quantityInput = document.getElementById('quantity');
const addToCartBtn = document.getElementById('addToCart');

const productNameEl = document.querySelector('h1');
const productPriceEl = document.querySelector('.text-blue-500');
const productDescEl = document.querySelector('p.text-gray-300');

const cartButton = document.getElementById('cartButton');
const miniCart = document.getElementById('miniCart');
const miniCartItems = document.getElementById('miniCartItems');
const miniCartTotal = document.getElementById('miniCartTotal');

if (cartButton && miniCart) {
    cartButton.addEventListener('click', () => {
        miniCart.classList.toggle('hidden');
    });
}

function updateMiniCart() {
    if (!miniCartItems || !miniCartTotal) return;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    miniCartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex justify-between items-center mb-3';
        const itemInfo = document.createElement('div');
        itemInfo.className = 'flex items-center gap-2';
        const img = document.createElement('img');
        img.src = item.image;
        img.className = 'w-12 h-12 object-cover rounded';
        const text = document.createElement('div');
        text.innerHTML = `
            <p class="text-sm font-semibold">${item.name}</p>
            <p class="text-xs text-gray-400">Color: ${item.color} | Qty: ${item.quantity}</p>
        `;
        itemInfo.appendChild(img);
        itemInfo.appendChild(text);
        const price = document.createElement('span');
        const itemTotal = item.price * item.quantity;
        price.textContent = itemTotal.toFixed(2) + '€';
        price.className = 'text-sm font-bold text-blue-500';
        total += itemTotal;
        itemDiv.appendChild(itemInfo);
        itemDiv.appendChild(price);
        miniCartItems.appendChild(itemDiv);
    });
    miniCartTotal.textContent = total.toFixed(2) + '€';
}

fetch('/PR_02/assets/data/products.json')
    .then(res => res.json())
    .then(products => {
        const product = products.find(p => p.id === productId);
        if (!product) throw new Error("Producto no encontrado");

        productNameEl.textContent = product.name;
        productPriceEl.textContent = product.price + '€';
        productDescEl.textContent = product.description;
        mainImage.src = product.images[0];

        // Miniaturas
        thumbnailsContainer.innerHTML = '';
        product.images.forEach((imgSrc, i) => {
            const thumb = document.createElement('img');
            thumb.src = imgSrc;
            thumb.className = 'cursor-pointer rounded-lg border-2 border-transparent hover:border-blue-500 transition';
            thumb.alt = `miniatura${i + 1}`;
            thumb.addEventListener('click', () => mainImage.src = imgSrc);
            thumbnailsContainer.appendChild(thumb);
        });

        // Colores
        colorContainer.innerHTML = '';
        selectedColorText.textContent = "Selected: " + product.colors[0];
        product.colors.forEach(color => {
            const btn = document.createElement('button');
            btn.className = 'color-btn w-10 h-10 rounded-full border-4 border-transparent hover:border-gray-400 transition';
            btn.style.backgroundColor = color.toLowerCase();
            btn.dataset.color = color;
            if (color === product.colors[0]) btn.classList.add('border-blue-500');
            btn.addEventListener('click', () => {
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('border-blue-500'));
                btn.classList.add('border-blue-500');
                selectedColorText.textContent = "Selected: " + color;
            });
            colorContainer.appendChild(btn);
        });
    })
    .catch(err => {
        console.error(err);
        alert("Error cargando el producto: " + err.message);
    });

if (increaseBtn && decreaseBtn && quantityInput) {
    increaseBtn.addEventListener('click', () => quantityInput.value = parseInt(quantityInput.value) + 1);
    decreaseBtn.addEventListener('click', () => {
        if (quantityInput.value > 1) quantityInput.value = parseInt(quantityInput.value) - 1;
    });
}

if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
        const selectedColor = document.querySelector('.color-btn.border-blue-500')?.dataset.color || 'Default';
        const quantity = parseInt(quantityInput.value);
        const productToAdd = {
            id: productId,
            name: productNameEl.textContent,
            price: parseFloat(productPriceEl.textContent),
            image: mainImage.src,
            color: selectedColor,
            quantity
        };
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingIndex = cart.findIndex(p => p.id === productToAdd.id && p.color === productToAdd.color);
        if (existingIndex >= 0) cart[existingIndex].quantity += quantity;
        else cart.push(productToAdd);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateMiniCart();
        if (miniCart) miniCart.classList.remove('hidden');
    });
}

updateMiniCart();