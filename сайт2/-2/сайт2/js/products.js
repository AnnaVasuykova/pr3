import { goods } from './data.js';

console.log('=== PRODUCT.JS ЗАГРУЖЕН ===');

export function loadProduct() {
    console.log('loadProduct function called');
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    console.log('Product ID from URL:', productId);
    
    if (!productId) {
        showError('Товар не найден');
        return;
    }
    
    const product = goods.find(p => p.id == productId);
    console.log('Found product:', product);
    
    if (!product) {
        showError('Товар не найден');
        return;
    }
    
    fillProductData(product);
    initEventHandlers(product);
}

function fillProductData(product) {
    console.log('Filling product data for:', product.name);
    
    // Получаем элементы
    const productImage = document.getElementById('productImage');
    const productName = document.getElementById('productName');
    const productPrice = document.getElementById('productPrice');
    const productDescription = document.getElementById('productDescription');
    
    console.log('Elements found:', {
        image: productImage,
        name: productName,
        price: productPrice,
        description: productDescription
    });
    
    // Заполняем данные
    if (productImage) {
        productImage.src = product.image;
        productImage.alt = product.name;
        console.log('Image src set to:', product.image);
    }
    
    if (productName) {
        productName.textContent = product.name;
        console.log('Name set to:', product.name);
    }
    
    if (productPrice) {
        productPrice.textContent = product.price + ' ₽';
        console.log('Price set to:', product.price);
    }
    
    if (productDescription) {
        productDescription.textContent = product.description;
        console.log('Description set');
    }
}

function initEventHandlers(product) {
    const buyButton = document.getElementById('buyButton');
    const wishlistButton = document.getElementById('wishlistButton');
    
    if (buyButton) {
        buyButton.addEventListener('click', () => {
            alert(`Товар "${product.name}" добавлен в корзину!`);
        });
    }
    
    if (wishlistButton) {
        wishlistButton.addEventListener('click', () => {
            wishlistButton.classList.toggle('active');
            wishlistButton.style.background = wishlistButton.classList.contains('active') ? '#fec7d7' : '#f8f9fa';
        });
    }
}

function showError(message) {
    const productPage = document.querySelector('.product-page');
    if (productPage) {
        productPage.innerHTML = `
            <div class="error-message">
                <h2>${message}</h2>
                <a href="index.html">Вернуться в каталог</a>
            </div>
        `;
    }
}

// Запускаем когда страница загрузится
document.addEventListener('DOMContentLoaded', loadProduct);