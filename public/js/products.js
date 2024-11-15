document.addEventListener('DOMContentLoaded', async () => {
    const productList = document.getElementById('product-list');
    try {
        const response = await fetch('/api/products');
        const products = await response.json();

        productList.innerHTML = products.map(product => `
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
        `).join('');
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
});

function addToCart(productId) {
    alert(`Producto ${productId} agregado al carrito`);
}
