document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-container');
    const totalContainer = document.createElement('div'); // Contenedor para el total y botón
    totalContainer.className = 'mt-4 text-center';
    cartContainer.after(totalContainer);

    async function fetchCart() {
        const token = localStorage.getItem('token');
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
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart');
            }

            const cart = await response.json();
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
    
        let total = 0;
        items.forEach(item => {
            total += item.price * item.quantity;
    
            const productCard = document.createElement('div');
            productCard.className = 'col-md-4 mb-4';
            productCard.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">
                            Price: $${item.price.toFixed(2)}<br>
                            Quantity: ${item.quantity}<br>
                            Total: $${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button class="btn btn-danger btn-sm delete-product" data-id="${item.productId}">
                            <i class="bi bi-trash3-fill"></i>
                        </button>
                    </div>
                </div>
            `;
            cartContainer.appendChild(productCard);
        });
    
        totalContainer.innerHTML = `
            <h3>Total: $${total.toFixed(2)}</h3>
            <button class="btn btn-success mt-3" id="pay-button">Pay</button>
        `;
    
        document.querySelectorAll('.delete-product').forEach(button => {
            button.addEventListener('click', async (event) => {
                const productId = event.target.dataset.id;
                await removeProduct(productId);
            });
        });
    
        document.getElementById('pay-button').addEventListener('click', () => payCart(items, total));
    }
    
    async function removeProduct(productId) {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to remove products from your cart');
            window.location.href = '/login';
            return;
        }
    
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
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to pay for your cart');
            window.location.href = '/login';
            return;
        }

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

