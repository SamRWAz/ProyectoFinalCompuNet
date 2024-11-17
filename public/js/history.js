document.addEventListener('DOMContentLoaded', loadPurchaseHistory);

async function loadPurchaseHistory() {
    const historyElement = document.getElementById('history');
    const token = localStorage.getItem('token');

    if (!token) {
        historyElement.innerHTML = '<p class="text-center">Debes iniciar sesión para ver tu historial de compras.</p>';
        return;
    }

    try {
        const response = await fetch('/api/cart/history', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Error al cargar el historial.');

        const history = await response.json();

        if (history.length === 0) {
            historyElement.innerHTML = '<p class="text-center">No tienes compras anteriores.</p>';
        } else {
            historyElement.innerHTML = history.map(invoice => `
                <div class="invoice mb-4">
                    <h5>Factura - ${new Date(invoice.date).toLocaleString()}</h5>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.items.map(item => `
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
                                <th>$${invoice.total.toFixed(2)}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error al cargar el historial:', error);
        historyElement.innerHTML = '<p class="text-center">Error al cargar el historial de compras.</p>';
    }
}
