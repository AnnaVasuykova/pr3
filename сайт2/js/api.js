import { uploadImageToSupabase } from './supabase-rest.js'

function getNextGoodId(goods) {
    if (goods.length === 0) return 1;
    const maxId = Math.max(...goods.map(p => p.id));
    return maxId + 1;
}


function getNextUserId(users) {
    if (users.length === 0) return 1;
    const maxId = Math.max(...users.map(u => u.id));
    return maxId + 1;
}


export async function getGoods() {
    try {
        const localData = localStorage.getItem('goods');
        if (localData) {
            const data = JSON.parse(localData);
            return data.goods || [];
        }
        return [];
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        return [];
    }
}


async function saveGoods(goods) {
    try {
        localStorage.setItem('goods', JSON.stringify({ goods }));
        return true;
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        return false;
    }
}


export async function getUsers() {
    try {
        const localData = localStorage.getItem('users');
        if (localData) {
            return JSON.parse(localData).users || [];
        }
        return [];
    } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
        return [];
    }
}


async function saveUsers(users) {
    try {
        localStorage.setItem('users', JSON.stringify({ users }));
        return true;
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        return false;
    }
}


export async function addGood(product, imageFile = null) {
    try {
        console.log('➕ Добавляем товар...', product);
        
        let imageUrl = product.image;
        
        
        if (imageFile) {
            try {
                console.log('🖼️ Загружаем изображение в Supabase...');
                imageUrl = await uploadImageToSupabase(imageFile);
                console.log('✅ Изображение загружено:', imageUrl);
            } catch (error) {
                console.error('❌ Ошибка загрузки изображения:', error);
                imageUrl = URL.createObjectURL(imageFile);
            }
        }
        
        const goods = await getGoods();
        const newProduct = {
            ...product,
            id: getNextGoodId(goods), 
            image: imageUrl
        };
        
        goods.push(newProduct);
        await saveGoods(goods);
        
        console.log('✅ Товар добавлен в localStorage:', newProduct);
        return newProduct;
        
    } catch (error) {
        console.error('❌ Ошибка добавления товара:', error);
        throw error;
    }
}


export async function updateGood(id, updatedProduct, imageFile = null) {
    try {
        console.log('🔄 Обновляем товар...', id);
        
        const goods = await getGoods();
        const index = goods.findIndex(p => p.id == id);
        
        if (index === -1) {
            throw new Error('Товар не найден');
        }
        
        let imageUrl = updatedProduct.image;
        
        if (imageFile) {
            try {
                imageUrl = await uploadImageToSupabase(imageFile);
            } catch (error) {
                console.error('Ошибка загрузки изображения:', error);
                imageUrl = URL.createObjectURL(imageFile);
            }
        }
        
        goods[index] = { 
            ...goods[index], 
            ...updatedProduct,
            image: imageUrl 
        };
        
        await saveGoods(goods);
        return goods[index];
        
    } catch (error) {
        console.error('❌ Ошибка обновления товара:', error);
        throw error;
    }
}


export async function deleteGood(id) oods[index], 
        ...updatedProduct,
        image: imageUrl 
    }
    
    await saveGoods(goods)
    return goods[index]
}

export async function deleteGood(id) {
    const goods = await getGoods()
    const filteredGoods = goods.filter(p => p.id != id)
    
    if (filteredGoods.length === goods.length) {
        throw new Error('Товар не найден')
    }
    
    await saveGoods(filteredGoods)
    return true
}

// CRUD для пользователей
export async function addUser(user) {
    const users = await getUsers()
    
    // Проверяем, нет ли пользователя с таким логином
    if (users.find(u => u.login === user.login)) {
        throw new Error('Пользователь с таким логином уже существует')
    }
    
    const newUser = {
        ...user,
        id: Date.now(),
        role: user.role || 'user'
    }
    
    users.push(newUser)
    await saveUsers(users)
    return newUser
}

export async function updateUser(id, updatedUser) {
    const users = await getUsers()
    const index = users.findIndex(u => u.id == id)
    
    if (index === -1) {
        throw new Error('Пользователь не найден')
    }
    
    users[index] = { ...users[index], ...updatedUser }
    await saveUsers(users)
    return users[index]
}

export async function deleteUser(id) {
    const users = await getUsers()
    const user = users.find(u => u.id == id)
    
    if (!user) {
        throw new Error('Пользователь не найден')
    }
    
    if (user.role === 'admin') {
        throw new Error('Нельзя удалить администратора')
    }
    
    const filteredUsers =