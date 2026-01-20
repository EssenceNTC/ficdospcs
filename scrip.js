/**
 * FIC dos Pc's - Script Principal
 * Responsável por toda interatividade do site
 */

// ===== DOM Elements =====
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.nav-link');
const viewButtons = document.querySelectorAll('.view-button');
const contactForm = document.getElementById('contactForm');
const productModal = document.getElementById('productModal');
const modalClose = document.querySelector('.modal-close');
const modalBody = document.querySelector('.modal-body');
const currentYearSpan = document.getElementById('currentYear');

// ===== Data de Produtos =====
const productsData = {
    motherboard: {
        title: "Placas Mãe",
        products: [
            { name: "ASUS ROG Maximus Z790", price: "R$ 2.899,90", specs: "Intel Z790, DDR5, PCIe 5.0" },
            { name: "Gigabyte B760M", price: "R$ 1.199,90", specs: "Intel B760, DDR4, Micro-ATX" },
            { name: "MSI MAG B550 TOMAHAWK", price: "R$ 999,90", specs: "AMD B550, DDR4, ATX" }
        ]
    },
    processor: {
        title: "Processadores",
        products: [
            { name: "Intel Core i9-13900K", price: "R$ 3.599,90", specs: "24 núcleos, 5.8GHz, LGA1700" },
            { name: "AMD Ryzen 7 7800X3D", price: "R$ 2.799,90", specs: "8 núcleos, 5.0GHz, AM5" },
            { name: "Intel Core i5-13400F", price: "R$ 1.299,90", specs: "10 núcleos, 4.6GHz, LGA1700" }
        ]
    },
    ram: {
        title: "Memória RAM",
        products: [
            { name: "Corsair Vengeance RGB 32GB", price: "R$ 699,90", specs: "DDR5 6000MHz, CL36" },
            { name: "Kingston Fury Beast 16GB", price: "R$ 349,90", specs: "DDR4 3200MHz, CL16" },
            { name: "G.Skill Trident Z5 64GB", price: "R$ 1.899,90", specs: "DDR5 6400MHz, CL32" }
        ]
    },
    gpu: {
        title: "Placas de Vídeo",
        products: [
            { name: "NVIDIA RTX 4090", price: "R$ 12.999,90", specs: "24GB GDDR6X, DLSS 3" },
            { name: "AMD RX 7900 XTX", price: "R$ 8.999,90", specs: "24GB GDDR6, Ray Tracing" },
            { name: "NVIDIA RTX 4070 Ti", price: "R$ 5.499,90", specs: "12GB GDDR6X, DLSS 3" }
        ]
    },
    peripherals: {
        title: "Periféricos",
        products: [
            { name: "Logitech G Pro X", price: "R$ 799,90", specs: "Teclado mecânico, switches GX" },
            { name: "Razer DeathAdder V3", price: "R$ 449,90", specs: "Mouse ergonômico, 30K DPI" },
            { name: "HyperX Cloud II", price: "R$ 599,90", specs: "Headset 7.1, cancelamento de ruído" }
        ]
    }
};

// ===== Initialize Functions =====
function init() {
    setupEventListeners();
    setCurrentYear();
    highlightActiveNav();
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Menu toggle para mobile
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    // Navegação suave
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    // Botões "Ver Produtos"
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productType = button.dataset.product;
            openProductModal(productType);
        });
    });

    // Formulário de contato
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Fechar modal
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Fechar modal ao clicar fora
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeModal();
        }
    });

    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && productModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Atualizar menu ativo no scroll
    window.addEventListener('scroll', highlightActiveNav);
}

// ===== Functions =====
function toggleMenu() {
    mainNav.classList.toggle('active');
    menuToggle.innerHTML = mainNav.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
}

function handleNavClick(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        // Fechar menu mobile se aberto
        if (mainNav.classList.contains('active')) {
            toggleMenu();
        }
        
        // Scroll suave
        window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
        });
        
        // Atualizar menu ativo
        updateActiveNav(this);
    }
}

function updateActiveNav(clickedLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    clickedLink.classList.add('active');
}

function highlightActiveNav() {
    let currentSection = '';
    const sections = document.querySelectorAll('section[id], #products');
    const scrollPosition = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        if (href === currentSection) {
            link.classList.add('active');
        }
    });
}

function openProductModal(productType) {
    const product = productsData[productType];
    if (!product) return;

    let modalHTML = `
        <h3>${product.title}</h3>
        <div class="modal-products">
    `;

    product.products.forEach(prod => {
        modalHTML += `
            <div class="modal-product">
                <h4>${prod.name}</h4>
                <p class="product-specs">${prod.specs}</p>
                <div class="product-price">${prod.price}</div>
                <button class="buy-button" data-product="${prod.name}">
                    <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
                </button>
            </div>
        `;
    });

    modalHTML += `
        </div>
        <div class="modal-actions">
            <button class="modal-button primary" onclick="simulateCheckout('${productType}')">
                <i class="fas fa-shopping-bag"></i> Finalizar Compra
            </button>
            <button class="modal-button secondary" onclick="closeModal()">
                <i class="fas fa-times"></i> Fechar
            </button>
        </div>
    `;

    modalBody.innerHTML = modalHTML;
    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Adicionar eventos aos botões de compra
    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.dataset.product;
            addToCart(productName);
        });
    });
}

function closeModal() {
    productModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function addToCart(productName) {
    showNotification(`${productName} adicionado ao carrinho!`, 'success');
    
    // Simular atualização do carrinho
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        let count = parseInt(cartCount.textContent) || 0;
        cartCount.textContent = count + 1;
        cartCount.classList.add('pulse');
        setTimeout(() => cartCount.classList.remove('pulse'), 300);
    }
}

function simulateCheckout(productType) {
    showNotification(`Compra de ${productsData[productType].title} simulada com sucesso!`, 'success');
    closeModal();
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    // Validação básica
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    if (!name || !email || !message) {
        showNotification('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    // Simular envio
    showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
    this.reset();
}

function showNotification(message, type = 'info') {
    // Remover notificação anterior se existir
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function setCurrentYear() {
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', init);

// ===== Global Functions (para uso nos botões do modal) =====
window.simulateCheckout = simulateCheckout;
window.closeModal = closeModal;