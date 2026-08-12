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

function updateCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('cart-total').innerText = total.toLocaleString();
  
  const totalArticles = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cart-count').innerText = totalArticles;
  const container = document.getElementById('cart-items');
  if(cart.length === 0) {
    container.innerHTML = "<p>Votre panier est vide</p>";
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item" >
        <img src="${item.img}">
        <div>
          <h4>${item.name}</h4>
          <p>${item.price.toLocaleString()} FCFA</p>
          <button onclick="changeQty('${item.id}', -1)">-</button>
          <span> ${item.qty} </span>
          <button onclick="changeQty('${item.id}', 1)">+</button>
          <p><b>Sous-total: ${(item.price * item.qty).toLocaleString()} FCFA</b></p>
          <button onclick="removeItem('${item.id}')">Supprimer</button>
        </div>
      </div>
    `).join('');
  }
}

function changeQty(id, delta) {
  const item = cart.find(p => p.id === id);
  item.qty += delta;
  if(item.qty <= 0) removeItem(id);
  else updateCart();
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

function filterProducts() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const sort = document.getElementById('sortFilter').value;
  
  let products = Array.from(document.querySelectorAll('.product'));
  const container = document.querySelector('.products-container');
  
  products.forEach(p => {
    const name = p.dataset.name.toLowerCase();
    const matchSearch = name.includes(search);
    const matchCategory = category === 'all' || p.dataset.category === category;
    p.style.display = (matchSearch && matchCategory) ? 'block' : 'none';
  });
  
  let visibleProducts = products.filter(p => p.style.display === 'block');
  if(sort === 'price-asc') {
    visibleProducts.sort((a,b) => parseInt(a.dataset.price) - parseInt(b.dataset.price));
  }
  if(sort === 'price-desc') {
    visibleProducts.sort((a,b) => parseInt(b.dataset.price) - parseInt(a.dataset.price));
  }
  
  visibleProducts.forEach(p => container.appendChild(p));
}

updateCart(); 
