document.addEventListener('DOMContentLoaded', loadCart);

async function loadCart() {
    const cartElement = document.getElementById('cart');
    const token = localStorage.getItem('token');

    if (!token) {
        cartElement.innerHTML = '<p class="text-center">Debes iniciar sesión para ver tu carrito.</p>';
        return;
    }

    try {
        console.log('Obteniendo datos del carrito...');
        const response = await fetch('/api/cart', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error('Error al obtener el carrito del servidor.');
            throw new Error('Error al cargar el carrito.');
        }

        const cart = await response.json();
        console.log('Carrito recibido del servidor:', cart);

        if (!cart || cart.length === 0) {
            console.warn('El carrito está vacío.');
            cartElement.innerHTML = '<p class="text-center">Tu carrito está vacío.</p>';
        } else {
            renderCart(cart, cartElement);
        }
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
        cartElement.innerHTML = '<p class="text-center">Error al cargar el carrito.</p>';
    }
}

function renderCart(cart, cartElement) {
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

    // Configurar el botón de finalizar compra
    const finalizePurchaseButton = document.getElementById('finalize-purchase');

    if (finalizePurchaseButton) {
        finalizePurchaseButton.addEventListener('click', finalizePurchase);
    }
}

async function finalizePurchase() {
    console.log('Se hizo clic en el botón "Finalizar Compra".');

    const token = localStorage.getItem('token');

    if (!token) {
        alert('Debes iniciar sesión para finalizar la compra.');
        console.error('Token no encontrado. Redirigiendo al inicio de sesión.');
        window.location.href = '/views/login.html';
        return;
    }

    try {
        console.log('Sincronizando carrito para pago...');
        const response = await fetch('/api/cart/checkout', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error al sincronizar el carrito:', error);
            throw new Error(error.message);
        }

        const { cart } = await response.json();
        console.log('Carrito sincronizado:', cart);

        // Guardar carrito en localStorage para usar en la página de pago
        localStorage.setItem('cart', JSON.stringify(cart));

        alert('Redirigiendo a la página de pago...');
        window.location.href = '/views/payment.html';
    } catch (error) {
        console.error('Error al finalizar la compra:', error);
        alert('Hubo un problema al finalizar la compra.');
    }
}
