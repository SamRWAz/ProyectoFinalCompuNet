document.addEventListener('DOMContentLoaded', () => {
    const loginToggle = document.getElementById('loginToggle');
    const registerToggle = document.getElementById('registerToggle');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const formContainer = document.querySelector('.form-container');
    const profileSection = document.getElementById('profileSection');
    const profileInfo = document.getElementById('profileInfo');
    const logoutBtn = document.getElementById('logoutBtn');

    // Cambiar entre formularios de login y registro
    loginToggle.addEventListener('click', () => {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        loginToggle.classList.add('active');
        registerToggle.classList.remove('active');
    });

    registerToggle.addEventListener('click', () => {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        registerToggle.classList.add('active');
        loginToggle.classList.remove('active');
    });

    // Manejar registro
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
                // Guardar token en localStorage
                localStorage.setItem('token', data.token);
                registerMessage.style.color = 'green';
                registerMessage.textContent = 'Registro exitoso';
                showProfile(data.user);
            } else {
                registerMessage.style.color = 'red';
                registerMessage.textContent = data.message;
            }
        } catch (error) {
            registerMessage.style.color = 'red';
            registerMessage.textContent = 'Error en el registro';
        }
    });

    // Manejar login
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
                // Guardar token en localStorage
                localStorage.setItem('token', data.token);
                loginMessage.style.color = 'green';
                loginMessage.textContent = 'Inicio de sesión exitoso';
                showProfile(data.user);
            } else {
                loginMessage.style.color = 'red';
                loginMessage.textContent = data.message;
            }
        } catch (error) {
            loginMessage.style.color = 'red';
            loginMessage.textContent = 'Error en el inicio de sesión';
        }
    });

    // Mostrar perfil
    function showProfile(user) {
        formContainer.style.display = 'none';
        profileSection.style.display = 'block';
        profileInfo.innerHTML = `
            <p><strong>Nombre:</strong> ${user.name}</p>
            <p><strong>Correo:</strong> ${user.email}</p>
            <p><strong>Rol:</strong> ${user.role}</p>
        `;
    }

    // Manejar cierre de sesión
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        profileSection.style.display = 'none';
        formContainer.style.display = 'block';
    });

    // Verificar token al cargar la página
    const token = localStorage.getItem('token');
    if (token) {
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
            showProfile(user);
        })
        .catch(() => {
            localStorage.removeItem('token');
        });
    }
});