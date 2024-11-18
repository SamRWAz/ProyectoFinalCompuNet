
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/views/index.html'; // Redirige al inicio de sesión
}
