document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Guarda el token y el rol en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);

            // Redirige según el rol del usuario
            if (data.role === 'client') {
                window.location.href = '/views/home_client.html'; // Redirige al home del cliente
            } else if (data.role === 'admin') {
                window.location.href = '/views/home_admin.html'; // Redirige al home del admin
            }
        } else {
            alert('Credenciales inválidas');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error en el servidor');
    }
});


// Lógica para el formulario de registro
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
            alert('Registro exitoso');
            window.location.href = '/views/login.html';
        } else {
            alert('Error al registrarse');
        }
    } catch (error) {
        console.error('Error al registrarse:', error);
        alert('Error en el servidor');
    }
});
