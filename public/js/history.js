document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Debes iniciar sesión para ver tu historial.');
        window.location.href = '/views/login.html';
        return;
    }

    try {
        const response = await fetch('/api/payment/history', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error al cargar el historial:', error);
            throw new Error(error.message || 'No se pudo cargar el historial.');
        }

        const history = await response.json();
        displayHistory(history);
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al cargar el historial.');
    }
});

function displayHistory(history) {
    const historyElement = document.getElementById('history');

    if (!history || history.length === 0) {
        historyElement.innerHTML = '<p>No hay compras realizadas.</p>';
        return;
    }

    historyElement.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Productos</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${history.map(order => `
                    <tr>
                        <td>${new Date(order.date).toLocaleString()}</td>
                        <td>
                            ${order.items.map(item => `
                                ${item.quantity}x ${item.productName} ($${item.price.toFixed(2)})
                            `).join('<br>')}
                        </td>
                        <td>$${order.total.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}
