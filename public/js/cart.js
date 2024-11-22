document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-container');
    const totalContainer = document.createElement('div'); // Contenedor para el total y botón
    totalContainer.className = 'mt-4 text-center';
    cartContainer.after(totalContainer);

    // Validar Token
    function validateToken() {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in.');
            window.location.href = '/login';
            return null;
        }
        return token;
    }

    async function fetchCart() {
        const token = validateToken();
        if (!token) return;

        try {
            const response = await fetch('/cart', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
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
        totalContainer.innerHTML = '';

        if (!items || items.length === 0) {
            cartContainer.innerHTML = '<p class="text-center">Your cart is empty.</p>';
            return;
        }

        // Header del Carrito
        const header = document.createElement('div');
        header.className = 'custom-header row align-items-center text-white mb-3';
        header.innerHTML = `
            <div class="col-md-4 text-center">Name</div>
            <div class="col-md-2 text-center">Price</div>
            <div class="col-md-2 text-center">Quantity</div>
            <div class="col-md-4 text-center">Total</div>
        `;
        cartContainer.appendChild(header);

        let total = 0;

        // Renderizar los productos
        items.forEach(item => {
            total += item.price * item.quantity;

            const productCard = document.createElement('div');
            productCard.className = 'custom-card row align-items-center mb-3';

            productCard.innerHTML = `
                <div class="col-md-4 text-center">
                    <h5 class="custom-product-name">${item.name}</h5>
                </div>
                <div class="col-md-2 text-center">
                    <p class="custom-product-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="col-md-2 text-center">
                    <p class="custom-product-quantity">${item.quantity}</p>
                </div>
                <div class="col-md-4 text-center">
                    <p class="custom-product-total">$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            `;
            cartContainer.appendChild(productCard);
        });

        // Mostrar Total y Botón de Pago
        totalContainer.innerHTML = `
            <h3>Total: $${total.toFixed(2)}</h3>
            <button class="btn btn-success mt-3" id="pay-button">Pay</button>
        `;

        document.getElementById('pay-button').addEventListener('click', () => payCart(items, total));
    }

    async function removeProduct(productId) {
        const token = validateToken();
        if (!token) return;

        try {
            const response = await fetch(`/cart/remove/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to remove product from cart');
            }

            const result = await response.json();
            alert(result.message);

            // Refrescar el carrito después de eliminar
            fetchCart();
        } catch (error) {
            console.error('Error removing product:', error);
            alert('Error removing product. Please try again.');
        }
    }

    async function payCart(items, total) {
        const token = validateToken();
        if (!token) return;

        try {
            const response = await fetch('/bills/pay', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    products: items,
                    totalAmount: total,
                    date: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to process payment');
            }

            alert('Payment successful!');
            window.location.href = '/customer'; // Redirigir después del pago
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Error processing payment. Please try again.');
        }
    }

    fetchCart();
});
