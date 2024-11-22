document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-container');

    async function fetchCart() {
        const token = localStorage.getItem('token');
        console.log('Token retrieved from localStorage:', token); 
        
        if (!token) {
            alert('You must be logged in to access your cart');
            window.location.href = '/login';
            return;
        }

        try {
            const response = await fetch('/cart', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart');
            }

            const cart = await response.json();
            console.log('Cart data received:', cart); // Verifica qué datos llegan
            renderCart(cart.items);

        } catch (error) {
            console.error('Error fetching cart:', error);
            cartContainer.innerHTML = '<p class="text-center">Error loading cart</p>';
        }
    }

    function renderCart(items) {
        cartContainer.innerHTML = '';

        if (!items || items.length === 0) {
            cartContainer.innerHTML = '<p class="text-center">Your cart is empty.</p>';
            return;
        }

        const header = document.createElement('div');
        header.className = 'custom-header row align-items-center text-white mb-3';
        header.innerHTML = `
            <div class="col-md-4 text-center">Name</div>
            <div class="col-md-2 text-center">Price</div>
            <div class="col-md-2 text-center">Quantity</div>
            <div class="col-md-4 text-center">Total</div>
        `;
        cartContainer.appendChild(header);

        // Renderizar las tarjetas de los productos
        items.forEach(item => {
            const productCard = document.createElement('div');
            productCard.className = 'custom-card row align-items-center mb-3';

            productCard.innerHTML = `
                <div class="col-md-4 text-center">
                    <!-- Nombre del producto -->
                    <h5 class="custom-product-name">${item.name}</h5>
                </div>
                <div class="col-md-2 text-center">
                    <!-- Precio del producto -->
                    <p class="custom-product-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="col-md-2 text-center">
                    <!-- Cantidad del producto -->
                    <p class="custom-product-quantity">${item.quantity}</p>
                </div>
                <div class="col-md-4 text-center">
                    <!-- Total calculado -->
                    <p class="custom-product-total">$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            `;
            cartContainer.appendChild(productCard);
        });


    }

    fetchCart();
});
