  // Toggle mobile menu
  const menuButton = document.getElementById('menuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  menuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Toggle mini-cart
  const cartButton = document.getElementById('cartButton');
  const miniCart = document.getElementById('miniCart');
  cartButton.addEventListener('click', () => {
    miniCart.classList.toggle('hidden');
  });

  // Click outside to close mini-cart
  document.addEventListener('click', (e) => {
    if (!miniCart.contains(e.target) && !cartButton.contains(e.target)) {
      miniCart.classList.add('hidden');
    }
  });