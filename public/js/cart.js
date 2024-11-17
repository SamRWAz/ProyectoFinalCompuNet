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

        if (cart.length === 0) {
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
            `;
        }
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
        cartElement.innerHTML = '<p class="text-center">Error al cargar el carrito.</p>';
    }
}
