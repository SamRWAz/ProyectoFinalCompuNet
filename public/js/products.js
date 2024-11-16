document.addEventListener('DOMContentLoaded', async () => {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '<div class="col-12 text-center">Cargando productos...</div>';

    try {
        const response = await fetch('/api/products');

        if (!response.ok) {
            throw new Error('Error al cargar productos');
        }

        const products = await response.json();

        productList.innerHTML = products.map(product => `
            <div class="col-md-4">
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text"><strong>Precio:</strong> $${product.price}</p>
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

// Función para manejar clic en "Ver Detalles"
function viewProductDetails(productId) {
    alert(`Redirigir a la página de detalles del producto: ${productId}`);
}
