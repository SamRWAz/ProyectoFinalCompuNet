document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const role = document.getElementById('registerRole').value;
        const registerMessage = document.getElementById('registerMessage');

        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, role })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                registerMessage.style.color = 'green';
                registerMessage.textContent = 'Registro exitoso';
                window.location.href = '/profile';  // Redirigir al perfil
            } else {
                registerMessage.style.color = 'red';
                registerMessage.textContent = data.message;
            }
        } catch (error) {
            registerMessage.style.color = 'red';
            registerMessage.textContent = 'Error en el registro';
        }
    });
});