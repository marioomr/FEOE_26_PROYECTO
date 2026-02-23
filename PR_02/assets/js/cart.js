// 1️⃣ Seleccionamos el div donde aparecerán los productos
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

// 2️⃣ Función para renderizar carrito
function renderCart() {
    cartItems.innerHTML = ''; // Limpiamos el div
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    cart.forEach(product => {
        const productTotal = (product.price * product.quantity).toFixed(2);
        total += parseFloat(productTotal);

        // Creamos un contenedor para cada producto
        const productDiv = document.createElement('div');
        productDiv.className = 'flex flex-row items-center justify-between bg-gray-800 gap-2 p-4 rounded-lg text-white';

        productDiv.innerHTML = `
            <img src="${product.image}" class="w-24 h-24 object-cover rounded-lg mb-2" alt="${product.name}">
            <p class="font-semibold">${product.name}</p>
            <p class="text-sm text-gray-400">Color: ${product.color}</p>
            <p class="text-sm text-gray-400">Qty: ${product.quantity}</p>
            <p class="font-bold text-blue-500">${productTotal}€</p>
            <button class="delete-btn text-red-500 hover:text-red-700 mt-2" data-id="${product.id}" data-color="${product.color}">🗑️</button>
        `;

        cartItems.appendChild(productDiv);
    });

    cartTotal.textContent = total.toFixed(2) + '€';

    // Eventos de eliminar
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const color = btn.dataset.color;

            cart = cart.filter(item => !(item.id === id && item.color === color));
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        });
    });
}

// 3️⃣ Ejecutamos al cargar la página
renderCart();