document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupCreateProductForm();
});

// Función para cargar productos
async function loadProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '<p class="text-center">Cargando productos...</p>';

    try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Error al cargar productos.');

        const products = await response.json();
        productList.innerHTML = products.map(product => `
            <a href="#" class="list-group-item list-group-item-action">
                <strong>${product.name}</strong><br>
                Precio: $${product.price} | Stock: ${product.stock}
            </a>
        `).join('');
    } catch (error) {
        console.error('Error al cargar productos:', error);
        productList.innerHTML = '<p class="text-danger">Error al cargar productos.</p>';
    }
}

// Configurar formulario para crear productos
function setupCreateProductForm() {
    const form = document.getElementById('create-product-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;
        const stock = document.getElementById('stock').value;

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description, price, stock }),
            });

            if (!response.ok) throw new Error('Error al crear producto.');
            alert('Producto creado exitosamente.');
            form.reset();
            loadProducts(); // Recargar lista de productos
        } catch (error) {
            console.error('Error al crear producto:', error);
            alert('Error al crear producto.');
        }
    });
}
