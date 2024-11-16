document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    });
});

// Función para cargar los productos desde el backend
async function loadProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '<div class="col-12 text-center">Cargando productos...</div>';

    try {
        const response = await fetch('/api/products', {
            method: 'GET',
            headers: {
                Authorization: localStorage.getItem('token') || ''
            }
        });

        if (!response.ok) throw new Error('Error al cargar productos');

        const products = await response.json();

        productList.innerHTML = products
            .map(
                product => `
                <div class="col-md-4">
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text"><strong>Precio:</strong> $${product.price}</p>
                            <button class="btn btn-primary" onclick="addToCart('${product.id}')">Agregar al Carrito</button>
                        </div>
                    </div>
                </div>
            `
            )
            .join('');
    } catch (error) {
        console.error('Error al cargar productos:', error);
        productList.innerHTML = '<div class="col-12 text-center">Error al cargar productos</div>';
    }
}

// Función para agregar un producto al carrito
async function addToCart(productId) {
    try {
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('token') || ''
            },
            body: JSON.stringify({ productId, quantity: 1 })
        });

        if (!response.ok) throw new Error('Error al agregar producto al carrito');

        alert('Producto agregado al carrito');
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        alert('Error al agregar producto al carrito');
    }
}
