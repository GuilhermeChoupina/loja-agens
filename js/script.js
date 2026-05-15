// NAV scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Intersection Observer for scroll reveals
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .product-row').forEach(el => {
    revealObserver.observe(el);
});

// Counter animation for stats
function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
        start += step;
        if (start >= target) {
            el.textContent = target.toLocaleString('pt-BR') + '+';
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(start).toLocaleString('pt-BR');
        }
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('[data-target]');
            counters.forEach(c => animateCounter(c, +c.dataset.target));
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelector('.stats') && statsObserver.observe(document.querySelector('.stats'));

// Product row stagger delay
document.querySelectorAll('.product-row').forEach((row, i) => {
    row.style.transitionDelay = (i * 0.08) + 's';
});

// Filter products
function filterProducts(cat, btn) {
    if (btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
    const rows = document.querySelectorAll('.product-row');
    rows.forEach((row, i) => {
        const show = cat === 'todos' || row.dataset.cat === cat;
        row.style.display = show ? 'grid' : 'none';
        if (show) {
            row.classList.remove('visible');
            row.style.transitionDelay = (i * 0.07) + 's';
            setTimeout(() => row.classList.add('visible'), 30);
        }
    });
}

// Cart
let cart = [];

function addToCart(name, price, emoji) {
    cart.push({ name, price, emoji });
    updateCart();
    showToast(`${emoji} ${name} adicionado!`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    const badge = document.getElementById('cartBadge');
    const itemsEl = document.getElementById('cartItems');
    const footerEl = document.getElementById('cartFooter');
    const totalEl = document.getElementById('cartTotal');

    badge.style.display = cart.length > 0 ? 'flex' : 'none';
    badge.textContent = cart.length;

    if (cart.length === 0) {
        itemsEl.innerHTML = `<div class="cart-empty"><span>🛒</span>Seu carrinho está vazio.<br>Adicione produtos para começar!</div>`;
        footerEl.style.display = 'none';
    } else {
        itemsEl.innerHTML = cart.map((item, i) => `
        <div class="cart-item">
          <div class="cart-item-emoji">${item.emoji}</div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">R$ ${item.price}</div>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart(${i})">✕</button>
        </div>
      `).join('');
        const total = cart.reduce((s, i) => s + i.price, 0);
        totalEl.textContent = 'R$ ' + total.toLocaleString('pt-BR');
        footerEl.style.display = 'block';
    }
}

function openCart() {
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('cartOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('open');
    document.body.style.overflow = '';
}

document.getElementById('cartBtn').addEventListener('click', openCart);

function sendToWhatsApp() {
    if (cart.length === 0) return;
    const total = cart.reduce((s, i) => s + i.price, 0);
    let msg = '🛒 *Pedido AgensStore*\n\n';
    cart.forEach(item => {
        msg += `${item.emoji} ${item.name} — R$ ${item.price}\n`;
    });
    msg += `\n💰 *Total: R$ ${total.toLocaleString('pt-BR')}*\n\nGostaria de finalizar meu pedido!`;
    const url = `https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}

// Toast
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Cat card clicks update filter
document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('click', () => {
        document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' });
    });
});