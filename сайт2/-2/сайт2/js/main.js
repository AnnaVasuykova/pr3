import { goods } from './data.js';

function loadGoods() {
    const catalog = document.querySelector('.catalog');
    if (!catalog) return;

    console.log('Загружаем товары:', goods.length);
    
    catalog.innerHTML = goods.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
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
}

function viewProduct(id) {
    window.location.href = `product.html?id=${id}`;
}

window.viewProduct = viewProduct;

document.addEventListener('DOMContentLoaded', loadGoods);