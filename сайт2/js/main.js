import { getGoods } from './api.js';
import { updateUserHeader, logoutUser } from './auth.js';

async function loadGoods() {
    const catalog = document.querySelector('.catalog');
    if (!catalog) return;

    console.log('Начинаем загрузку товаров...');
    
    try {
        const goods = await getGoods();
        console.log('Получены товары:', goods);
        
        if (!goods || goods.length === 0) {
            catalog.innerHTML = '<p class="no-goods">Товары не найдены в data/goods.json</p>';
            return;
        }
        
        catalog.innerHTML = goods.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image"
                     onerror="this.src='https://via.placeholder.com/300x200/fec7d7/0e172c?text=Нет+изображения'">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">${product.price} ₽</div>
                    <button class="details-button" onclick="viewProduct(${product.id})">
                        Подробнее
                    </button>
                </div>
            </div>
        `).join('');
        
        console.log('✅ Каталог успешно отображен');
        
    } catch (error) {
        console.error('❌ Ошибка:', error);
        catalog.innerHTML = '<p class="error">Ошибка загрузки товаров из data/goods.json</p>';
    }
}

function viewProduct(id) {
    window.location.href = `product.html?id=${id}`;
}

function setupEventHandlers() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
    }
}

window.viewProduct = viewProduct;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализируем главную страницу...');
    loadGoods();
    updateUserHeader();
    setupEventHandlers();
});