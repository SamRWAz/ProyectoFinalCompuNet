document.addEventListener('DOMContentLoaded', () => {
    loadProducts(); // Cargar productos al cargar la página
});

// Función para cargar los productos desde la API
async function loadProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '<div class="col-12 text-center">Cargando productos...</div>';

    try {
        const response = await fetch('/api/products', { method: 'GET' });

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
                            <a href="/views/product_details.html?id=${product.id}" class="btn btn-primary">Ver Detalles</a>
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
