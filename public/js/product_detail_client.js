document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();
    setupAddToCart();
});

// Función para cargar detalles del producto
async function loadProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const productDetails = document.getElementById('product-details');
    const stockInfo = document.getElementById('stock-info');

    if (!productId) {
        productDetails.innerHTML = '<div class="col-12 text-center">ID del producto no especificado</div>';
        return;
    }

    try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) throw new Error('Error al cargar detalles del producto.');

        const product = await response.json();

        productDetails.innerHTML = `
            <div class="col-md-6">
                <img src="https://via.placeholder.com/200x200" class="img-fluid" alt="${product.name}">
            </div>
            <div class="col-md-6">
                <h1>${product.name}</h1>
                <p>${product.description}</p>
                <p><strong>Precio:</strong> $${product.price}</p>
            </div>
        `;
        stockInfo.textContent = `Disponibles: ${product.quantity}`;
    } catch (error) {
        console.error('Error al cargar detalles del producto:', error);
        productDetails.innerHTML = '<div class="col-12 text-center">Error al cargar detalles del producto.</div>';
    }
}

// Configurar botón "Agregar al Carrito"
function setupAddToCart() {
    document.getElementById('add-to-cart').addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Debes iniciar sesión para agregar productos al carrito.');
            window.location.href = '/views/login.html';
            return;
        }
    
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');
        const quantity = parseInt(document.getElementById('quantity').value);
    
        if (quantity <= 0) {
            alert('La cantidad debe ser mayor a 0.');
            return;
        }
    
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ productId, quantity })
            });
    
            if (!response.ok) throw new Error('Error al agregar producto al carrito');
            console.log(`Producto ${productId} agregado al carrito con cantidad ${quantity}`);
            alert('Producto agregado al carrito exitosamente.');
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            alert('Error al agregar producto al carrito.');
        }
    });    
}
