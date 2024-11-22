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

        items.forEach(item => {
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
                    </div>
                </div>
            `;
            cartContainer.appendChild(productCard);
        });
    }

    fetchCart();
});
