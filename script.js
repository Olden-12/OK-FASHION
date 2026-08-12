let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(btn) {
  const div = btn.closest('.product');
  const id = div.dataset.id;
  const name = div.dataset.name;
  const price = parseInt(div.dataset.price);
  const img = div.querySelector('img').src;

  const item = cart.find(p => p.id === id);
  if(item) item.qty++;
  else cart.push({id, name, price, img, qty: 1});
  
  updateCart();
}

function changeQty(id, delta) {
  const item = cart.find(p => p.id === id);
  item.qty += delta;
  if(item.qty <= 0) removeItem(id);
  else updateCart();
}
function updateCart() {
  localStorage.setItem('cart', JSON.stringify(cart));

  const totalArticles = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cart-count');

  if(totalArticles > 0) {
    badge.innerText = totalArticles;
    badge.style.display = 'block'; 
  } else {
    badge.style.display = 'none'; 
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('cart-total').innerText = total.toLocaleString();

  const container = document.getElementById('cart-items');
  if(cart.length === 0) {
    container.innerHTML = "<p style='text-align:center'>Votre panier est vide</p>";
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.img}" width="60">
        <div>
          <h4>${item.name}</h4>
          <p>${item.price.toLocaleString()} FCFA</p>
          <button onclick="changeQty('${item.id}', -1)">-</button>
          <span> ${item.qty} </span>
          <button onclick="changeQty('${item.id}', 1)">+</button>
          <button onclick="removeItem('${item.id}')">Supprimer</button>
        </div>
      </div>
    `).join('');
  }
}
function removeItem(id) {
  cart = cart.filter(p => p.id !== id);
  updateCart();
}

function toggleCart() {
  document.getElementById('cart-sidebar').classList.toggle('active');
  document.getElementById('overlay').classList.toggle('active');
}

function checkout() {
  alert('Total à payer: ' + document.getElementById('cart-total').innerText + ' FCFA');
}
updateCart(); 
