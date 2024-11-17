document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const productDetails = document.getElementById('product-details');

    if (!productId) {
        productDetails.innerHTML = '<div class="text-center">ID del producto no especificado.</div>';
        return;
    }

    try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) throw new Error('Error al cargar detalles del producto.');

        const product = await response.json();

        productDetails.innerHTML = `
            <div class="col-md-6">
                <img src="${product.image}" class="img-fluid" alt="${product.name}">
            </div>
            <div class="col-md-6">
                <h1>${product.name}</h1>
                <p>${product.description}</p>
                <p><strong>Precio:</strong> $${product.price}</p>
                <p><strong>Disponibles:</strong> ${product.stock}</p>
                <div class="mt-3">
                    <label for="quantity" class="form-label">Cantidad:</label>
                    <input type="number" id="quantity" class="form-control" value="1" min="1" max="${product.stock}">
                </div>
                <button id="add-to-cart" class="btn btn-success mt-3">Agregar al Carrito</button>
            </div>
        `;

        setupAddToCart(productId);
    } catch (error) {
        console.error('Error al cargar detalles del producto:', error);
        productDetails.innerHTML = '<div class="text-center">Error al cargar detalles del producto.</div>';
    }
});

// Configurar botón "Agregar al Carrito"
function setupAddToCart(productId) {
    document.getElementById('add-to-cart').addEventListener('click', async () => {
        const quantity = parseInt(document.getElementById('quantity').value);
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Debes iniciar sesión para agregar productos al carrito.');
            window.location.href = '/views/login.html';
            return;
        }

        if (quantity <= 0) {
            alert('La cantidad debe ser mayor a 0.');
            return;
        }

        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId, quantity }),
            });

            if (!response.ok) throw new Error('Error al agregar producto al carrito.');

            alert('Producto agregado al carrito exitosamente.');
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            alert('Hubo un problema al agregar el producto al carrito.');
        }
    });
}
