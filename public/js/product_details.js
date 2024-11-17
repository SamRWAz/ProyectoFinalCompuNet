document.addEventListener('DOMContentLoaded', () => {
    // Cargar detalles del producto al cargar la página
    loadProductDetails();

    // Evento para agregar productos al carrito
    document.getElementById('add-to-cart').addEventListener('click', async () => {
        await handleAddToCart();
    });
});

// Función para manejar la lógica de agregar al carrito
async function handleAddToCart() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // Validar que el usuario esté autenticado como cliente
    if (!token) {
        alert('Debes registrarte o iniciar sesión como cliente para agregar productos al carrito.');
        window.location.href = '/views/login.html';
        return;
    }

    if (role !== 'client') {
        alert('Solo los clientes pueden agregar productos al carrito.');
        return;
    }

    try {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');

        if (!productId) {
            alert('Producto no especificado.');
            return;
        }

        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Token para autenticación
            },
            body: JSON.stringify({ productId }),
        });

        if (response.status === 403 || response.status === 401) {
            alert('Debes registrarte o iniciar sesión como cliente para agregar productos al carrito.');
            window.location.href = '/views/login.html';
            return;
        }

        if (!response.ok) throw new Error('Error al agregar producto al carrito.');

        alert('Producto agregado al carrito exitosamente.');
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        alert('Hubo un problema al agregar el producto al carrito.');
    }
}

// Función para cargar los detalles del producto
async function loadProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const productDetails = document.getElementById('product-details');

    if (!productId) {
        productDetails.innerHTML = '<div class="col-12 text-center">ID del producto no especificado</div>';
        return;
    }

    try {
        const response = await fetch(`/api/products/${productId}`, { method: 'GET' });

        if (!response.ok) throw new Error('Error al cargar detalles del producto');

        const product = await response.json();

        productDetails.innerHTML = `
            <div class="col-md-6">
                <img src="${product.image}" class="img-fluid" alt="${product.name}">
            </div>
            <div class="col-md-6">
                <h1>${product.name}</h1>
                <p>${product.description}</p>
                <p><strong>Precio:</strong> $${product.price}</p>
                <p><strong>Stock:</strong> ${product.quantity}</p>
            </div>
        `;
    } catch (error) {
        console.error('Error al cargar detalles del producto:', error);
        productDetails.innerHTML = '<div class="col-12 text-center">Error al cargar detalles del producto</div>';
    }
}
