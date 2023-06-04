const registerForm = document.getElementById('registerForm');

registerForm.onsubmit = e => {
    e.preventDefault();
    if (registerForm.classList.contains('step-1')) {
        registerForm.classList.remove('step-1');
        registerForm.classList.add('step-2');
    }
};