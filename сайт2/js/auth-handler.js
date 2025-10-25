import { loginUser, registerUser } from './auth.js';

let isLoginMode = true;

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('authForm');
    const toggleBtn = document.getElementById('toggleForm');
    const nameField = document.getElementById('nameField');
    const emailField = document.getElementById('emailField');
    const submitBtn = form.querySelector('.submit-button');
    
    toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        
        if (isLoginMode) {
            submitBtn.textContent = 'Войти';
            toggleBtn.textContent = 'Создать аккаунт';
            nameField.style.display = 'none';
            emailField.style.display = 'none';
        } else {
            submitBtn.textContent = 'Зарегистрироваться';
            toggleBtn.textContent = 'Уже есть аккаунт';
            nameField.style.display = 'block';
            emailField.style.display = 'block';
        }
    });
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        
        let result;
        if (isLoginMode) {
            result = await loginUser(login, password);
        } else {
            result = await registerUser(login, password, name, email);
        }
        
        if (result.success) {
            alert(isLoginMode ? 'Вход успешен!' : 'Регистрация успешна!');
            window.location.href = 'index.html';
        } else {
            alert(result.error);
        }
    });
});