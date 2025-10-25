import { getGoods } from './api.js';
import { updateUserHeader } from './auth.js';

async function loadProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    console.log('Product ID:', productId);
    
    if (productId) {
        const goods = await getGoods();
        const product = goods.find(p => p.id == productId);
        console.log('Found product:', product);
        
        if (product) {
            const productImage = document.getElementById('productImage');
            
           
            if (productImage && product.image) {
                productImage.src = product.image;
                productImage.alt = product.name;
                console.log('Image src set to:', product.image);
                
                
                productImage.onerror = function() {
                    console.error('Ошибка загрузки изображения:', product.image);
                    this.src = 'https://via.placeholder.com/500x400/ff6b6b/white?text=Ошибка+загрузки';
                    this.alt = 'Изображение не загружено';
                };
            }
            
            document.getElementById('productName').textContent = product.name;
            document.getElementById('productPrice').textContent = product.price + ' ₽';
            document.getElementById('productDescription').textContent = product.description;
            
            
            document.getElementById('buyButton').addEventListener('click', () => {
                alert(`Товар "${product.name}" добавлен в корзину!`);
            });
            
            document.getElementById('wishlistButton').addEventListener('click', function() {
                this.classList.toggle('active');
                this.style.background = this.classList.contains('active') ? '#fec7d7' : '#f8f9fa';
            });
        } else {
            showError('Товар не найден');
        }
    } else {
        showError('ID товара не указан');
    }
}

function showError(message) {
    document.querySelector('.product-page').innerHTML = `
        <div class="error-message">
            <h2>${message}</h2>
            <a href="index.html">Вернуться в каталог</a>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', function() {
    loadProduct();
    updateUserHeader();
});