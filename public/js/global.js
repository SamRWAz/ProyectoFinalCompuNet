function logout() {
    localStorage.removeItem('token');
    window.location.href = '/'; // Redirige al inicio de sesión
}