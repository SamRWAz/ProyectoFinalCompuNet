document.getElementById('login-admin-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role: 'admin' }), // Incluye el rol explícitamente
        });

        const data = await response.json();

        if (response.ok && data.role === 'admin') {
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            window.location.href = '/views/home_admin.html'; // Redirige al panel admin
        } else {
            alert('Credenciales inválidas o no tienes permisos de administrador.');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error en el servidor.');
    }
});
