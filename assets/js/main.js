const state = {
  products: [],
  lang: localStorage.getItem('lang') || 'ar',
  cart: JSON.parse(localStorage.getItem('cart') || '{}')
};

async function loadProducts(){
  const res = await fetch('/data/products.json');
  state.products = await res.json();
  renderProducts(state.products);
  renderCartCount();
  applyLang();
}

function formatPrice(dzd){ return new Intl.NumberFormat('ar-DZ').format(dzd) + ' دج'; }

function renderProducts(list){
  const grid = document.getElementById('productsGrid');
  if(!grid) return;
  grid.innerHTML = '';
  list.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product card';
    div.innerHTML = `
      <img src="/${p.image}" alt="${p.name_ar}"/>
      <div><strong>${state.lang==='ar'?p.name_ar:p.name_fr}</strong></div>
      <div class="muted">${p.brand} • ${p.code}</div>
      <div class="price">${formatPrice(p.price_dzd)}</div>
      <div style="display:flex;gap:8px;margin-top:auto">
        <button class="qbtn" onclick="addToCart('${p.id}')">أضف للسلة</button>
        <a class="btn" href="/product.html?id=${p.id}">تفاصيل</a>
      </div>
    `;
    grid.appendChild(div);
  });
}

function addToCart(id){
  const p = state.products.find(x=>x.id===id);
  if(!p) return alert('خطأ');
  const qty = (state.cart[id]||0)+1;
  state.cart[id]=qty;
  localStorage.setItem('cart', JSON.stringify(state.cart));
  renderCartCount();
  toast('أضيف إلى السلة');
}

function renderCartCount(){
  const count = Object.values(state.cart).reduce((a,b)=>a+b,0);
  const el = document.getElementById('cartCount');
  if(el) el.textContent = count;
}

function toast(msg){
  const t = document.createElement('div');
  t.textContent = msg; t.style.position='fixed'; t.style.right='20px'; t.style.bottom='20px';
  t.style.background='#0ea5a3'; t.style.padding='12px 18px'; t.style.borderRadius='10px'; t.style.color='#00111a';
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),2000);
}

function filterByCategory(cat){
  const filtered = cat==='all' ? state.products : state.products.filter(p=>p.category===cat);
  renderProducts(filtered);
}

function searchProducts(term){
  term = term.trim().toLowerCase();
  if(!term){ renderProducts(state.products); return; }
  const res = state.products.filter(p=> (p.name_ar+p.name_fr+p.code+p.brand).toLowerCase().includes(term));
  renderProducts(res);
}

function applyLang(){
  document.documentElement.lang = state.lang==='ar'?'ar':'fr';
  // swap text on page minimal
  document.querySelectorAll('[data-i18n-ar]').forEach(el=> el.textContent = state.lang==='ar'?el.getAttribute('data-i18n-ar'):el.getAttribute('data-i18n-fr') );
  localStorage.setItem('lang', state.lang);
}

function toggleLang(){ state.lang = state.lang==='ar'?'fr':'ar'; applyLang(); }

// product details page loader
async function loadProductPage(){
  if(!location.pathname.endsWith('product.html')) return;
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if(!id) return;
  if(state.products.length===0) await loadProducts();
  const p = state.products.find(x=>x.id===id);
  if(!p) return;
  document.getElementById('pName').textContent = state.lang==='ar'?p.name_ar:p.name_fr;
  document.getElementById('pImage').src = '/' + p.image;
  document.getElementById('pDesc').textContent = state.lang==='ar'?p.description_ar:p.description_fr;
  document.getElementById('pPrice').textContent = formatPrice(p.price_dzd);
  document.getElementById('orderBtn').onclick = ()=> window.open(`https://wa.me/213XXXXXXXXX?text=${encodeURIComponent('أريد طلب المنتج: '+p.name_ar+' | الكود: '+p.code)}`,'_blank');
}

window.addEventListener('DOMContentLoaded', async ()=>{
  await loadProducts();
  loadProductPage();
  // attach inputs
  const searchInput = document.getElementById('searchInput');
  if(searchInput) searchInput.addEventListener('input', e=> searchProducts(e.target.value));
  // category links
  document.querySelectorAll('[data-cat]').forEach(el=> el.addEventListener('click', ()=> filterByCategory(el.getAttribute('data-cat'))));
});
