// Array de produtos
const produtos = [
    { nome: 'Creatina Agens 300g', preco: 89.90, estoque: 15, categoria: 'suplementos', emoji: '💪' },
    { nome: 'Pré-Treino Agens 200g', preco: 79.90, estoque: 8, categoria: 'suplementos', emoji: '⚡' },
    { nome: 'Whey Protein 900g', preco: 149.90, estoque: 12, categoria: 'suplementos', emoji: '🥛' },
    { nome: 'Camiseta Dry Fit', preco: 59.90, estoque: 20, categoria: 'roupas', emoji: '👕' },
    { nome: 'Shorts de Treino', preco: 69.90, estoque: 10, categoria: 'roupas', emoji: '🩳' },
    { nome: 'Top Feminino', preco: 49.90, estoque: 7, categoria: 'roupas', emoji: '👚' },
    { nome: 'Strap de Treino', preco: 29.90, estoque: 25, categoria: 'acessorios', emoji: '🧤' },
    { nome: 'Coqueteleira 700ml', preco: 39.90, estoque: 18, categoria: 'acessorios', emoji: '🥤' },
    { nome: 'Boné Agens', preco: 44.90, estoque: 14, categoria: 'acessorios', emoji: '🧢' },
    { nome: 'Toalha Microfibra', preco: 34.90, estoque: 6, categoria: 'acessorios', emoji: '🧽' }
];

// Carrinho
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Função para renderizar produtos
function renderProdutos(filtro = 'todos') {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    const filtrados = filtro === 'todos' ? produtos : produtos.filter(p => p.categoria === filtro);
    filtrados.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'product-card';
        let stockText = '✅ disponível';
        if (produto.estoque <= 5) stockText = '⚠️ últimas unidades';
        if (produto.estoque === 0) stockText = '❌ esgotado';
        card.innerHTML = `
                    <div class="product-emoji">${produto.emoji}</div>
                    <div class="product-name">${produto.nome}</div>
                    <div class="product-price">R$ ${produto.preco.toFixed(2).replace('.', ',')}</div>
                    <div class="product-stock">${stockText}</div>
                    <button class="add-to-cart" onclick="adicionarAoCarrinho('${produto.nome}')">ADICIONAR AO CARRINHO</button>
                `;
        grid.appendChild(card);
    });
}

// Função para filtrar produtos
function filterProducts(categoria) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderProdutos(categoria);
}

// Função para adicionar ao carrinho
function adicionarAoCarrinho(nome) {
    const produto = produtos.find(p => p.nome === nome);
    if (produto.estoque > 0) {
        const item = carrinho.find(i => i.nome === nome);
        if (item) {
            item.quantidade++;
        } else {
            carrinho.push({ ...produto, quantidade: 1 });
        }
        produto.estoque--;
        salvarCarrinho();
        atualizarCarrinho();
        showToast();
    }
}

// Função para salvar carrinho no localStorage
function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Função para atualizar carrinho
function atualizarCarrinho() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    cartItems.innerHTML = '';
    let total = 0;
    let count = 0;
    carrinho.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
                    <span>${item.nome} (x${item.quantidade})</span>
                    <span>R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
                `;
        cartItems.appendChild(itemDiv);
        total += item.preco * item.quantidade;
        count += item.quantidade;
    });
    cartTotal.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
    cartCount.textContent = count;
}

// Função para toggle carrinho
function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('open');
}

// Função para enviar WhatsApp
function sendWhatsApp() {
    if (carrinho.length === 0) return;
    let mensagem = 'Olá, gostaria de pedir os seguintes produtos:\n\n';
    carrinho.forEach(item => {
        mensagem += `${item.nome} - Quantidade: ${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}\n`;
    });
    const total = carrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
    mensagem += `\nTotal: R$ ${total.toFixed(2).replace('.', ',')}`;
    const url = `https://wa.me/5511961752771?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Função para mostrar toast
function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Função para scroll suave
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Inicialização
renderProdutos();
atualizarCarrinho();