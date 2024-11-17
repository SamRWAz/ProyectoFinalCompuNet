document.addEventListener('DOMContentLoaded', async () => {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '<div class="col-12 text-center">Cargando productos...</div>';

    try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Error al cargar productos');

        const products = await response.json();
        productList.innerHTML = products.map(product => `
            <div class="col-md-4">
                <div class="card mb-4">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p><strong>Precio:</strong> $${product.price}</p>
                        <p><strong>Stock:</strong> ${product.stock}</p>
                        <input type="number" id="quantity-${product.id}" class="form-control mb-2" placeholder="Cantidad" min="1" max="${product.stock}" value="1">
                        <button class="btn btn-success" onclick="addToCart('${product.id}')">Agregar al Carrito</button>
                        <button class="btn btn-primary" onclick="viewProductDetails('${product.id}')">Ver Detalles</button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error al cargar productos:', error);
        productList.innerHTML = '<div class="col-12 text-center">Error al cargar productos</div>';
    }
});

// Función para agregar al carrito
async function addToCart(productId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Debes iniciar sesión para agregar productos al carrito.');
        return;
    }

    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityInput.value, 10);

    if (!quantity || quantity <= 0) {
        alert('Por favor, ingrese una cantidad válida.');
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

        const { cart } = await response.json();
        alert('Producto agregado al carrito.');
        console.log('Carrito actualizado:', cart);
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        alert('Hubo un problema al agregar el producto al carrito.');
    }
}

// Función para redirigir al detalle del producto
function viewProductDetails(productId) {
    // Redirigir a la página de detalles del producto con el ID en la URL
    window.location.href = `/views/product_details.html?id=${productId}`;
}
