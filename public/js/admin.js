document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        
        const name = document.getElementById('productName').value;
        const image = document.getElementById('productImage').value;
        const price = parseFloat(document.getElementById('productPrice').value);
        const quantity = document.getElementById('productQuantity').value;
        const productMessage = document.getElementById('productMessage');



        try {

            const token = localStorage.getItem('token');


            const response = await fetch('/products/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                },
                body: JSON.stringify({ name, image, price, quantity })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                productMessage.style.color = 'green';
                productMessage.textContent = 'Registro exitoso';
                window.location.href = '/admin';  // Redirigir al perfil
            } else {
                productMessage.style.color = 'red';
                productMessage.textContent = data.message;
            }
        } catch (error) {
            productMessage.style.color = 'red';
            productMessage.textContent = 'Error en el registro';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');

    async function fetchProducts() {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                alert('You must be logged in as an admin to view this page.');
                window.location.href = '/login';
                return;
            }

            const response = await fetch('/products/allProducts', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const products = await response.json();
            productList.innerHTML = ''; // Limpiar lista de productos existente

            // Renderizar los productos para administrador
            Object.values(products).forEach(product => {
                const card = document.createElement('div');
                card.className = 'col-md-4 mb-4';
                card.innerHTML = `
                    <div class="card h-100">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">
                                Price: $${product.price.toFixed(2)}<br>
                                Available: ${product.quantity} units
                            </p>
                        </div>
                    </div>
                `;
                productList.appendChild(card);
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            productList.innerHTML = '<p class="text-center">Error loading products</p>';
        }
    }

    fetchProducts();
});
