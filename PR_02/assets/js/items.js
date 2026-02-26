// ══════════════════════════════════════════════════════
//  ITEMS PAGE — carga, filtrado, ordenación y render
// ══════════════════════════════════════════════════════

let allProducts = [];

// ── Elementos ──────────────────────────────────────────
const grid        = document.getElementById('productsGrid');
const emptyState  = document.getElementById('emptyState');
const resultCount = document.getElementById('resultCount');

const filterBrand    = document.getElementById('filterBrand');
const filterCategory = document.getElementById('filterCategory');
const filterColor    = document.getElementById('filterColor');
const filterSort     = document.getElementById('filterSort');
const resetBtn       = document.getElementById('resetFilters');

// ── Fetch ───────────────────────────────────────────────
fetch('/PR_02/assets/data/products.json')
    .then(res => res.json())
    .then(data => {
        allProducts = data;
        renderProducts();
    })
    .catch(() => {
        grid.innerHTML = '<p class="text-red-400 col-span-4 text-center">Error al cargar los productos.</p>';
    });

// ── Listeners filtros ───────────────────────────────────
[filterBrand, filterCategory, filterColor, filterSort].forEach(el =>
    el.addEventListener('change', renderProducts));

resetBtn.addEventListener('click', () => {
    filterBrand.value    = '';
    filterCategory.value = '';
    filterColor.value    = '';
    filterSort.value     = '';
    renderProducts();
});

// ── Render ──────────────────────────────────────────────
function renderProducts() {
    let products = [...allProducts];

    // Filtros
    if (filterBrand.value)    products = products.filter(p => p.brand    === filterBrand.value);
    if (filterCategory.value) products = products.filter(p => p.category === filterCategory.value);
    if (filterColor.value)    products = products.filter(p => p.colors.includes(filterColor.value));

    // Orden
    if (filterSort.value === 'asc')  products.sort((a, b) => a.price - b.price);
    if (filterSort.value === 'desc') products.sort((a, b) => b.price - a.price);

    // Resultado
    grid.innerHTML = '';
    resultCount.textContent = `${products.length} producto${products.length !== 1 ? 's' : ''}`;

    if (!products.length) {
        emptyState.classList.remove('hidden');
        return;
    }
    emptyState.classList.add('hidden');

    products.forEach(p => grid.appendChild(createCard(p)));
}

// ── Card ────────────────────────────────────────────────
function createCard(product) {
    const card = document.createElement('a');
    card.href = `/PR_02/pages/product.html?id=${product.id}`;
    card.className = [
        'group flex flex-col bg-[#1d1f28] border border-white/8 rounded-2xl overflow-hidden',
        'hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition duration-300'
    ].join(' ');

    // Badge categoría
    const categoryColors = {
        Keyboard: 'bg-blue-500/15 text-blue-400',
        Mouse:    'bg-purple-500/15 text-purple-400',
        Headset:  'bg-green-500/15 text-green-400',
        Wheel:    'bg-orange-500/15 text-orange-400',
    };
    const badgeClass = categoryColors[product.category] || 'bg-white/10 text-gray-400';

    // Puntos de color
    const colorDots = product.colors.map(c => {
        const bg = c === 'Black' ? 'bg-gray-800 border border-white/20' : 'bg-white border border-gray-300';
        return `<span class="w-3 h-3 rounded-full ${bg} inline-block"></span>`;
    }).join('');

    card.innerHTML = `
        <!-- Imagen -->
        <div class="bg-[#13151f] flex items-center justify-center h-48 overflow-hidden px-6 pt-6 pb-2">
            <img src="${product.images[0]}" alt="${product.name}"
                class="h-full w-full object-contain group-hover:scale-105 transition duration-300">
        </div>

        <!-- Info -->
        <div class="flex flex-col gap-2 p-4 flex-1">
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