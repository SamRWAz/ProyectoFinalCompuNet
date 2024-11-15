document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();

    document.getElementById('add-to-cart').addEventListener('click', () => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (!token || role !== 'client') {
            alert('Debes registrarte o iniciar sesión como cliente para agregar productos al carrito.');
            window.location.href = '/views/login.html';
        } else {
            alert('Producto agregado al carrito.');
            // Lógica para agregar el producto al carrito
        }
    });
});

// Función para cargar los detalles del producto
async function loadProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const productDetails = document.getElementById('product-details');

    try {
        const response = await fetch(`/api/products/${productId}`, { method: 'GET' });

        if (!response.ok) throw new Error('Error al cargar detalles del producto');

        const product = await response.json();

        productDetails.innerHTML = `
            <div class="col-md-6">
                <img src="https://via.placeholder.com/500x500" class="img-fluid" alt="${product.name}">
            </div>
            <div class="col-md-6">
                <h1>${product.name}</h1>
                <p>${product.description}</p>
                <p><strong>Precio:</strong> $${product.price}</p>
                <p><strong>Stock:</strong> ${product.stock}</p>
            </div>
        `;
    } catch (error) {
        console.error('Error al cargar detalles del producto:', error);
        productDetails.innerHTML = '<div class="col-12 text-center">Error al cargar detalles del producto</div>';
    }
}
