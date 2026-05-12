// Array de produtos
const produtos = [
    { id: 1, nome: 'Creatina Agens 300g', categoria: 'suplementos', preco: 89.90, estoque: 15, descricao: 'Creatina monohidratada pura para ganho de força e massa muscular.', emoji: '💪' },
    { id: 2, nome: 'Pré-Treino Agens 200g', categoria: 'suplementos', preco: 79.90, estoque: 8, descricao: 'Fórmula energética para maximizar seu desempenho nos treinos.', emoji: '⚡' },
    { id: 3, nome: 'Whey Protein 900g', categoria: 'suplementos', preco: 149.90, estoque: 12, descricao: 'Proteína de alta qualidade para recuperação muscular.', emoji: '🥛' },
    { id: 4, nome: 'Camiseta Dry Fit Agens', categoria: 'roupas', preco: 59.90, estoque: 20, descricao: 'Camiseta tecnológica que absorve o suor rapidamente.', emoji: '👕' },
    { id: 5, nome: 'Shorts de Treino', categoria: 'roupas', preco: 69.90, estoque: 10, descricao: 'Shorts confortáveis e resistentes para treinos intensos.', emoji: '🩳' },
    { id: 6, nome: 'Top Feminino', categoria: 'roupas', preco: 49.90, estoque: 7, descricao: 'Top esportivo feminino com suporte ideal.', emoji: '👙' },
    { id: 7, nome: 'Strap de Treino', categoria: 'acessorios', preco: 29.90, estoque: 25, descricao: 'Suporte para punhos durante exercícios de musculação.', emoji: '🤝' },
    { id: 8, nome: 'Coqueteleira Agens 700ml', categoria: 'acessorios', preco: 39.90, estoque: 18, descricao: 'Coqueteleira prática para preparar seus shakes.', emoji: '🥤' },
    { id: 9, nome: 'Boné Agens Fitness', categoria: 'acessorios', preco: 44.90, estoque: 14, descricao: 'Boné estiloso com logo da academia.', emoji: '🧢' },
    { id: 10, nome: 'Toalha Microfibra', categoria: 'acessorios', preco: 34.90, estoque: 6, descricao: 'Toalha ultra absorvente e compacta.', emoji: '🧽' },
    { id: 11, nome: 'Squeeze Agens 1L', categoria: 'acessorios', preco: 32.90, estoque: 9, descricao: 'Garrafa térmica para manter suas bebidas geladas.', emoji: '🍼' }
];

// Estado do carrinho
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Função para renderizar produtos
function renderProdutos(filtro = 'todos') {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    const produtosFiltrados = filtro === 'todos' ? produtos : produtos.filter(p => p.categoria === filtro);

    produtosFiltrados.forEach((produto, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 0.1}s`;

        const estoqueClass = produto.estoque === 0 ? 'stock-out' : produto.estoque <= 5 ? 'stock-low' : 'stock-available';
        const estoqueText = produto.estoque === 0 ? '❌ Esgotado' : produto.estoque <= 5 ? `⚠️ Últimas ${produto.estoque} unidades!` : `✅ ${produto.estoque} unidades disponíveis`;

        card.innerHTML = `
                    <div class="product-emoji">${produto.emoji}</div>
                    <div class="product-content">
                        <span class="product-category">${produto.categoria.toUpperCase()}</span>
                        <h3 class="product-name">${produto.nome}</h3>
                        <p class="product-description">${produto.descricao}</p>
                        <div class="product-price">R$ ${produto.preco.toFixed(2).replace('.', ',')}</div>
                        <div class="product-stock ${estoqueClass}">${estoqueText}</div>
                        <button class="add-to-cart" onclick="adicionarAoCarrinho(${produto.id})" ${produto.estoque === 0 ? 'disabled' : ''}>
                            ADICIONAR AO CARRINHO
                        </button>
                    </div>
                `;

        grid.appendChild(card);
    });
}

// Função para filtrar produtos
function filterProducts(categoria) {
    // Atualizar botões ativos
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    renderProdutos(categoria);
}

// Função para adicionar ao carrinho
function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto || produto.estoque === 0) return;

    const itemExistente = carrinho.find(item => item.id === id);
    if (itemExistente) {
        if (itemExistente.quantidade >= produto.estoque) {
            alert('Não há estoque suficiente!');
            return;
        }
        itemExistente.quantidade++;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }

    salvarCarrinho();
    atualizarCarrinho();
    mostrarToast();
}

// Função para remover do carrinho
function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    salvarCarrinho();
    atualizarCarrinho();
}

// Função para atualizar quantidade
function atualizarQuantidade(id, novaQuantidade) {
    const item = carrinho.find(item => item.id === id);
    const produto = produtos.find(p => p.id === id);

    if (novaQuantidade <= 0) {
        removerDoCarrinho(id);
        return;
    }

    if (novaQuantidade > produto.estoque) {
        alert('Quantidade excede o estoque disponível!');
        return;
    }

    item.quantidade = novaQuantidade;
    salvarCarrinho();
    atualizarCarrinho();
}

// Função para salvar carrinho no localStorage
function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Função para atualizar interface do carrinho
function atualizarCarrinho() {
    const badge = document.getElementById('cart-badge');
    const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    badge.textContent = totalItens;

    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    if (carrinho.length === 0) {
        cartItems.innerHTML = '<p>Seu carrinho está vazio.</p>';
    } else {
        carrinho.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                        <div class="cart-item-info">
                            <h4>${item.nome}</h4>
                            <p>R$ ${item.preco.toFixed(2).replace('.', ',')} cada</p>
                        </div>
                        <div class="cart-item-controls">
                            <input type="number" class="quantity" value="${item.quantidade}" min="1" max="${item.estoque}" onchange="atualizarQuantidade(${item.id}, parseInt(this.value))">
                            <button class="remove-item" onclick="removerDoCarrinho(${item.id})">×</button>
                        </div>
                    `;
            cartItems.appendChild(itemDiv);
        });
    }

    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    document.getElementById('cart-total').textContent = total.toFixed(2).replace('.', ',');
}

// Função para limpar carrinho
function clearCart() {
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();
}

// Função para finalizar pedido via WhatsApp
function checkout() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    let mensagem = 'Olá! Gostaria de fazer um pedido:\n\n';
    carrinho.forEach(item => {
        mensagem += `${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}\n`;
    });
    mensagem += `\nTotal: R$ ${carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0).toFixed(2).replace('.', ',')}`;

    const url = `https://wa.me/5511961752771?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Função para mostrar toast
function mostrarToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Função para toggle do menu mobile
function toggleMenu() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('show');
}

// Função para toggle do carrinho
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.toggle('open');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderProdutos();
    atualizarCarrinho();
});