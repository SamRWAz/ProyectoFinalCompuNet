document.addEventListener('DOMContentLoaded', loadCart);

async function loadCart() {
    const cartElement = document.getElementById('cart');
    const token = localStorage.getItem('token');

    if (!token) {
        cartElement.innerHTML = '<p class="text-center">Debes iniciar sesión para ver tu carrito.</p>';
        return;
    }

    try {
        const response = await fetch('/api/cart', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Error al cargar el carrito.');

        const cart = await response.json();

        if (!cart || cart.length === 0) {
            cartElement.innerHTML = '<p class="text-center">Tu carrito está vacío.</p>';
        } else {
            cartElement.innerHTML = `
                <table class="table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cart.map(item => `
                            <tr>
                                <td>${item.productName}</td>
                                <td>${item.quantity}</td>
                                <td>$${item.price.toFixed(2)}</td>
                                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colspan="3">Total</th>
                            <th>$${cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</th>
                        </tr>
                    </tfoot>
                </table>
            <button id="finalize-purchase" class="btn btn-success mt-3">Finalizar Compra</button>
            `;

            // Agregar evento al botón de finalizar compra
            document.getElementById('finalize-purchase').addEventListener('click', finalizePurchase);
        }
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
        cartElement.innerHTML = '<p class="text-center">Error al cargar el carrito.</p>';
    }
}

async function finalizePurchase() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Debes iniciar sesión para finalizar la compra.');
        window.location.href = '/views/login.html';
        return;
    }

    try {
        const response = await fetch('/api/cart/checkout', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error('Error al finalizar la compra.');

        const { cart } = await response.json();
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Compra finalizada con éxito. Redirigiendo a la página de pago...');
        window.location.href = '/views/payment.html';
    } catch (error) {
        console.error('Error al finalizar la compra:', error);
        alert('Hubo un problema al finalizar la compra.');
    }
}
