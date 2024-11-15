document.addEventListener('DOMContentLoaded', () => {
    loadProducts(); // Cargar productos al cargar la página
});

// Función para cargar productos desde la API
async function loadProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '<tr><td colspan="5">Cargando productos...</td></tr>';

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
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.description}</td>
                    <td>$${product.price}</td>
                    <td>${product.stock}</td>
                </tr>
            `
            )
            .join('');
    } catch (error) {
        console.error('Error al cargar productos:', error);
        productList.innerHTML = '<tr><td colspan="5">Error al cargar productos</td></tr>';
    }
}

// Manejar el envío del formulario para crear un producto
document.getElementById('create-product-form').addEventListener('submit', async event => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value);
    const stock = parseInt(document.getElementById('stock').value);

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('token') || ''
            },
            body: JSON.stringify({ name, description, price, stock })
        });

        if (response.ok) {
            alert('Producto creado exitosamente');
            loadProducts(); // Recargar productos
            document.getElementById('create-product-form').reset(); // Limpiar formulario
        } else {
            const error = await response.json();
            alert('Error al crear producto: ' + (error.message || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error al crear producto:', error);
        alert('Error al crear producto');
    }
});
