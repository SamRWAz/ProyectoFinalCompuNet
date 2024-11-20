document.addEventListener('DOMContentLoaded', () => {
    const profileInfo = document.getElementById('profileInfo');
    const logoutBtn = document.getElementById('logoutBtn');

    // Verificar token y cargar perfil
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    fetch('/auth/profile', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Token inválido');
    })
    .then(user => {
        profileInfo.innerHTML = `
            <p><strong>Nombre:</strong> ${user.name}</p>
            <p><strong>Correo:</strong> ${user.email}</p>
            <p><strong>Rol:</strong> ${user.role}</p>
        `;
    })
    .catch(() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    });

    // Manejar cierre de sesión
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    });
});