document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');

    async function fetchProducts() {
        try {
            const response = await fetch('/products/allProducts');
            const products = await response.json();

            // Clear any existing products
            productList.innerHTML = '';

            // Iterate through products and create cards
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
                            <button class="btn btn-primary add-to-cart" 
                                    data-id="${product.id}" 
                                    data-name="${product.name}" 
                                    data-price="${product.price}" 
                                    data-quantity="${product.quantity}">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                `;
                productList.appendChild(card);
            });

            // Add event listeners for "Add to Cart" buttons
            const addToCartButtons = document.querySelectorAll('.add-to-cart');
            addToCartButtons.forEach(button => {
                button.addEventListener('click', async (event) => {
                    const productId = event.target.dataset.id;
                    const quantity = 1; // Cantidad por defecto
                
                    try {
                        const response = await fetch('/cart/add', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            },
                            body: JSON.stringify({ productId, quantity })
                        });
                
                        const result = await response.json();
                
                        if (response.ok) {
                            alert('Product added to cart successfully!');
                            console.log(result);
                        } else {
                            console.error('Error response:', result);
                            alert(`Error: ${result.message}`);
                        }
                    } catch (error) {
                        console.error('Error adding to cart:', error);
                    }
                });
                
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            productList.innerHTML = '<p class="text-center">Error loading products</p>';
        }
    }
    

    // Fetch products when page loads
    fetchProducts();
});

document.addEventListener('DOMContentLoaded', () => {
    const cartLink = document.getElementById('cart-link');

    cartLink.addEventListener('click', () => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('You must be logged in to view your cart');
            window.location.href = '/login'; // Redirigir al inicio de sesión si no hay token
            return;
        }

        // Redirigir a la página del carrito
        window.location.href = '/cart';
    });
});

