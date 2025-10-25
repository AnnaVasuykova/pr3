import { getUsers, addUser } from './api.js';

export async function loginUser(login, password) {
    try {
        const users = await getUsers();
        
        
        if (users.length === 0) {
            const demoUsers = [
                {
                    id: 1,
                    login: 'admin',
                    password: '123456',
                    name: 'Администратор',
                    role: 'admin',
                    email: 'admin@toys.com'
                },
                {
                    id: 2,
                    login: 'user',
                    password: 'password',
                    name: 'Пользователь',
                    role: 'user',
                    email: 'user@mail.com'
                }
            ];
            
            
            for (const user of demoUsers) {
                await addUser(user);
            }
            
            
            const updatedUsers = await getUsers();
            const user = updatedUsers.find(u => u.login === login && u.password === password);
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                return { success: true, user };
            }
        } else {
            
            const user = users.find(u => u.login === login && u.password === password);
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                return { success: true, user };
            }
        }
        
        return { success: false, error: 'Неверный логин или пароль' };
    } catch (error) {
        console.error('Ошибка входа:', error);
        return { success: false, error: 'Ошибка системы' };
    }
}

export async function registerUser(login, password, name, email) {
    try {
        const newUser = await addUser({ login, password, name, email });
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return { success: true, user: newUser };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

export function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = 'registr.html';
}

export function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

export function updateUserHeader() {
    const user = getCurrentUser();
    const userInfoElement = document.getElementById('userInfo');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminBtn = document.getElementById('adminBtn');
    const authBtn = document.getElementById('authBtn');
    
    if (userInfoElement) {
        userInfoElement.textContent = user ? `Привет, ${user.name}!` : '';
    }
    
    if (logoutBtn) {
        logoutBtn.style.display = user ? 'block' : 'none';
    }
    
    if (authBtn) {
        authBtn.style.display = user ? 'none' : 'block';
    }
    
    if (adminBtn) {
        adminBtn.style.display = isAdmin() ? 'block' : 'none';
    }
}