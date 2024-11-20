document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const loginMessage = document.getElementById('loginMessage');

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                loginMessage.style.color = 'green';
                loginMessage.textContent = 'Inicio de sesión exitoso';
                window.location.href = '/profile';  // Redirigir al perfil
            } else {
                loginMessage.style.color = 'red';
                loginMessage.textContent = data.message;
            }
        } catch (error) {
            loginMessage.style.color = 'red';
            loginMessage.textContent = 'Error en el inicio de sesión';
        }
    });
});