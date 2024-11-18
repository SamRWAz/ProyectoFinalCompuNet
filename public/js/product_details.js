document.addEventListener('DOMContentLoaded', async () => {
    // Cargar detalles del producto al cargar la página
    await loadProductDetails();
});

// Función para manejar la lógica de agregar al carrito
async function handleAddToCart(productId) {
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
        const quantityInput = document.getElementById(`quantity-${productId}`);
        const quantity = parseInt(quantityInput.value);

        if (isNaN(quantity) || quantity < 1) {
            alert('Por favor, ingrese una cantidad válida.');
            return;
        }

        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId, quantity }),
        });

        if (!response.ok) {
            if (response.status === 403 || response.status === 401) {
                alert('Debes registrarte o iniciar sesión como cliente para agregar productos al carrito.');
                window.location.href = '/views/login.html';
            } else {
                throw new Error('Error al agregar producto al carrito.');
            }
            return;
        }

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
        const token = localStorage.getItem('token');
        const isLoggedIn = !!token;

        productDetails.innerHTML = `
            <div class="col-md-6">
                <img src="${product.image}" class="img-fluid rounded" alt="${product.name}">
            </div>
            <div class="col-md-6">
                <h1>${product.name}</h1>
                <p>${product.description}</p>
                <p><strong>Precio:</strong> $${product.price}</p>
                <p><strong>Disponibles:</strong> ${product.stock}</p>
                <div class="mt-3">
                    <label for="quantity-${product.id}" class="form-label">Cantidad:</label>
                    <input 
                        type="number" 
                        id="quantity-${product.id}" 
                        class="form-control mb-3 w-50" 
                        placeholder="Cantidad" 
                        min="1" 
                        max="${product.stock}" 
                        value="1" 
                        ${isLoggedIn ? '' : 'disabled'}>
                </div>
                <button 
                    class="btn btn-success w-50" 
                    onclick="handleAddToCart('${product.id}')" 
                    ${isLoggedIn ? '' : 'disabled'}>Agregar al Carrito</button>
                ${!isLoggedIn ? '<p class="text-danger mt-2">Inicia sesión para agregar productos al carrito.</p>' : ''}
            </div>
        `;
    } catch (error) {
        console.error('Error al cargar detalles del producto:', error);
        productDetails.innerHTML = '<div class="col-12 text-center">Error al cargar detalles del producto</div>';
    }
}
