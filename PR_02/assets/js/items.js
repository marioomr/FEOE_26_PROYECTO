const contenedor = document.getElementById("productsGrid");

fetch("/PR_02/assets/data/products.json")
  .then(res => res.json())
  .then(products => {
    const idsDestacados = ["4ac90730-29ab-436b-92b0-54e54a8869a0", "f81e16f6-9f53-408d-b792-b2a3228b4108", "d2df5222-00fd-49e5-9817-f7252935649c", "c7a27ad1-cef6-414a-9439-24b49068c770"];
    const prodsFiltered = products.filter(p => idsDestacados.includes(p.id));

    prodsFiltered.forEach(producto => crearCard(producto));
  });

function crearCard(producto) {
  const card = document.createElement("div");
  card.className = `
    flex flex-col items-center
    product-card
    rounded-xl border-2 border-blue-500
    px-8 py-4
    hover:bg-indigo-900
    transition duration-300
  `;

  card.innerHTML = `
    <a href="pages/items.html?id=${producto.id}">
      <img src="${producto.images[0]}" class="w-40 h-40 object-contain mb-2">
      <h3 class="text-white font-semibold">${producto.name}</h3>
      <p class="text-blue-500 font-bold">${producto.price}€</p>
    </a>
  `;

  contenedor.appendChild(card);
}