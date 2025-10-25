import { getGoods, getUsers, addGood, updateGood, deleteGood, deleteUser, updateUser } from './api.js'
import { isAdmin, logoutUser, getCurrentUser } from './auth.js'

let currentEditingId = null
let currentImageFile = null

async function loadAdminPanel() {
    if (!isAdmin()) {
        alert('Доступ запрещен! Требуются права администратора.')
        window.location.href = 'index.html'
        return
    }

    await loadUsers()
    await loadGoods()
    setupEventHandlers()
    setupImageUpload()
}

function setupImageUpload() {
    const selectImageBtn = document.getElementById('selectImageBtn')
    const imageFileInput = document.getElementById('imageFile')
    const fileInfo = document.getElementById('fileInfo')
    const imagePreview = document.getElementById('imagePreview')

    selectImageBtn.addEventListener('click', () => {
        imageFileInput.click()
    })

    imageFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0]
        if (file) {
            currentImageFile = file
            fileInfo.textContent = file.name
            
            const reader = new FileReader()
            reader.onload = (e) => {
                imagePreview.src = e.target.result
                imagePreview.style.display = 'block'
            }
            reader.readAsDataURL(file)
        } else {
            currentImageFile = null
            fileInfo.textContent = 'Файл не выбран'
            imagePreview.style.display = 'none'
        }
    })
}

async function loadUsers() {
    try {
        const users = await getUsers();
        const tbody = document.getElementById('usersTable');
        
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.login}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button class="btn-warning" onclick="editUserHandler(${user.id})">Редакт.</button>
                    ${user.role !== 'admin' ? 
                        `<button class="btn-danger" onclick="deleteUserHandler(${user.id})">Удалить</button>` : 
                        '<span class="text-muted">Админ</span>'
                    }
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
        showMessage('Ошибка загрузки пользователей', 'error');
    }
}

async function loadGoods() {
    try {
        const goods = await getGoods();
        const tbody = document.getElementById('goodsTable');
        
        tbody.innerHTML = goods.map(product => `
            <tr>
                <td>${product.id}</td>
                <td>
                    ${product.image ? 
                        `<img src="${product.image}" alt="${product.name}" class="admin-product-image">` : 
                        'Нет изображения'
                    }
                </td>
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>${product.price} ₽</td>
                <td>${product.category}</td>
                <td>
                    <button class="btn-warning" onclick="editProduct(${product.id})">Редакт.</button>
                    <button class="btn-danger" onclick="deleteProduct(${product.id})">Удалить</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        showMessage('Ошибка загрузки товаров', 'error');
    }
}

function setupEventHandlers() {
    const productForm = document.getElementById('productForm');
    const cancelEditBtn = document.getElementById('cancelEdit');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }
    
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', cancelEdit);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
    }
}

async function handleProductSubmit(e) {
    e.preventDefault();
    console.log('🔧 handleProductSubmit вызван');
    
    const formData = new FormData(e.target);
    const product = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseInt(formData.get('price')),
        category: formData.get('category'),
        image: ''
    };
    
    console.log('📦 Данные товара:', product);
    console.log('🆔 ID редактирования:', currentEditingId);
    console.log('🖼️ Выбранный файл:', currentImageFile);
    
    try {
        let result;
        
        if (currentEditingId) {
            console.log('🔄 Вызов updateGood...');
            result = await updateGood(currentEditingId, product, currentImageFile);
            console.log('✅ updateGood завершен:', result);
            showMessage('Товар успешно обновлен!', 'success');
        } else {
            console.log('➕ Вызов addGood...');
            result = await addGood(product, currentImageFile);
            console.log('✅ addGood завершен:', result);
            showMessage('Товар успешно добавлен!', 'success');
        }
        
        resetForm();
        await loadGoods();
    } catch (error) {
        console.error('❌ Ошибка сохранения товара:', error);
        showMessage('Ошибка сохранения товара: ' + error.message, 'error');
    }
}

async function editProduct(id) {
    try {
        const goods = await getGoods();
        const product = goods.find(p => p.id == id);
        
        if (product) {
            currentEditingId = id;
            document.getElementById('formTitle').textContent = 'Редактировать товар';
            document.getElementById('submitBtn').textContent = 'Обновить';
            document.getElementById('cancelEdit').style.display = 'inline-block';
            
            document.getElementById('name').value = product.name;
            document.getElementById('description').value = product.description;
            document.getElementById('price').value = product.price;
            document.getElementById('category').value = product.category;
            
            currentImageFile = null;
            document.getElementById('fileInfo').textContent = 'Файл не выбран';
            document.getElementById('imageFile').value = '';
            
            const imagePreview = document.getElementById('imagePreview');
            if (product.image) {
                imagePreview.src = product.image;
                imagePreview.style.display = 'block';
                imagePreview.alt = `Текущее изображение: ${product.name}`;
            } else {
                imagePreview.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Ошибка редактирования товара:', error);
        showMessage('Ошибка редактирования товара', 'error');
    }
}

async function editUser(id) {
    try {
        const users = await getUsers();
        const user = users.find(u => u.id == id);
        
        if (user) {
            const newName = prompt('Введите новое имя пользователя:', user.name);
            const newEmail = prompt('Введите новый email:', user.email);
            const newRole = prompt('Введите новую роль (user/admin):', user.role);
            
            if (newName !== null && newEmail !== null && newRole !== null) {
                const updatedUser = {
                    name: newName,
                    email: newEmail,
                    role: newRole
                };
                
                await updateUser(id, updatedUser);
                await loadUsers();
                showMessage('Пользователь успешно обновлен!', 'success');
            }
        }
    } catch (error) {
        console.error('Ошибка редактирования пользователя:', error);
        showMessage('Ошибка редактирования пользователя', 'error');
    }
}

async function editUserHandler(id) {
    await editUser(id);
}

function cancelEdit() {
    resetForm();
}

function resetForm() {
    currentEditingId = null;
    currentImageFile = null;
    document.getElementById('productForm').reset();
    document.getElementById('formTitle').textContent = 'Добавить товар';
    document.getElementById('submitBtn').textContent = 'Добавить';
    document.getElementById('cancelEdit').style.display = 'none';
    document.getElementById('fileInfo').textContent = 'Файл не выбран';
    document.getElementById('imagePreview').style.display = 'none';
}

async function deleteProduct(id) {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
        try {
            await deleteGood(id);
            await loadGoods();
            showMessage('Товар успешно удален!', 'success');
        } catch (error) {
            console.error('Ошибка удаления товара:', error);
            showMessage('Ошибка удаления товара', 'error');
        }
    }
}

async function deleteUserHandler(id) {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
        try {
            await deleteUser(id);
            await loadUsers();
            showMessage('Пользователь успешно удален!', 'success');
        } catch (error) {
            console.error('Ошибка удаления пользователя:', error);
            showMessage('Ошибка удаления пользователя', 'error');
        }
    }
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}


window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.editUserHandler = editUserHandler;
window.deleteUserHandler = deleteUserHandler;


document.addEventListener('DOMContentLoaded', loadAdminPanel);