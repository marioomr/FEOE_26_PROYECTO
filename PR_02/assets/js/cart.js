// 1️⃣ Seleccionamos los elementos
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

// 2️⃣ Función para renderizar el carrito
function renderCart() {
    cartItems.innerHTML = ''; // Limpiamos el div

    // Obtenemos el carrito desde localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    cart.forEach(product => {
        const productTotal = (product.price * product.quantity).toFixed(2);
        total += parseFloat(productTotal);

        // Creamos el contenedor de cada producto
        const productDiv = document.createElement('div');
        productDiv.className = `
            flex flex-col md:flex-row items-center w-full justify-between 
            bg-gray-800 gap-2 p-4 rounded-lg text-white flex-wrap
        `;

        // HTML del producto
        productDiv.innerHTML = `
            <img src="${product.image}" class="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg" alt="${product.name}">
            <div class="flex flex-col flex-1 min-w-0 ml-2">
                <p class="font-semibold truncate">${product.name}</p>
                <p class="text-sm text-gray-400 truncate">Color: ${product.color}</p>
                <p class="text-sm text-gray-400">Qty: ${product.quantity}</p>
            </div>
            <p class="font-bold text-blue-500 whitespace-nowrap">${productTotal}€</p>
            <button class="delete-btn text-red-500 hover:text-red-700 mt-2 md:mt-0" data-id="${product.id}" data-color="${product.color}">🗑️</button>
        `;

        cartItems.appendChild(productDiv);
    });

    // Actualizamos el total
    cartTotal.textContent = total.toFixed(2) + '€';

    // 3️⃣ Eventos de eliminar
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const color = btn.dataset.color;

            // Filtramos el carrito
            cart = cart.filter(item => !(item.id === id && item.color === color));
            localStorage.setItem('cart', JSON.stringify(cart));

            // Volvemos a renderizar
            renderCart();
        });
    });
}

// 4️⃣ Ejecutamos al cargar la página
renderCart();