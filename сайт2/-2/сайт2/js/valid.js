import { loginUser, registerUser } from './auth.js';

let isLoginMode = true;
const form = document.getElementById('authForm');
const toggleBtn = document.getElementById('toggleForm');
const nameField = document.getElementById('nameField');
const submitBtn = form.querySelector('.submit-button');

toggleBtn.addEventListener('click', function(e) {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    
    if (isLoginMode) {
        submitBtn.textContent = 'Войти';
        toggleBtn.textContent = 'Создать аккаунт';
        nameField.style.display = 'none';
    } else {
        submitBtn.textContent = 'Зарегистрироваться';
        toggleBtn.textContent = 'Уже есть аккаунт';
        nameField.style.display = 'block';
    }
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    
    let result;
    if (isLoginMode) {
        result = loginUser(login, password);
    } else {
        result = registerUser(login, password, name);
    }
    
    if (result.success) {
        alert(isLoginMode ? 'Вход успешен!' : 'Регистрация успешна!');
        window.location.href = 'index.html';
    } else {
        alert(result.error);
    }
});