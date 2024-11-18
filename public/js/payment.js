document.addEventListener('DOMContentLoaded', () => {
    console.log('Página de pago cargada.');

    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const paymentDetails = {
            cardHolder: document.getElementById('card-holder').value.trim(),
            cardNumber: document.getElementById('card-number').value.trim(),
            expirationDate: document.getElementById('expiration-date').value.trim(),
            cvv: document.getElementById('cvv').value.trim(),
            billingAddress: document.getElementById('billing-address').value.trim(),
        };

        if (Object.values(paymentDetails).some(value => !value)) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const cart = JSON.parse(localStorage.getItem('cart'));

            if (!token || !cart) {
                alert('No se encontraron datos de compra.');
                window.location.href = '/views/home_client.html';
                return;
            }

            console.log('Enviando datos al servidor de pago...', { paymentDetails, cart });

            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ paymentDetails, cart }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Error del servidor:', error);
                throw new Error(error.message);
            }

            const { invoice } = await response.json();
            console.log('Factura generada:', invoice);

            alert('Pago procesado con éxito.');
            displayInvoice(invoice);

            // Limpiar carrito después del pago
            localStorage.removeItem('cart');

            // Reiniciar los campos del formulario de pago
            paymentForm.reset();

        } catch (error) {
            console.error('Error al procesar el pago:', error);
            alert('Hubo un problema al procesar el pago.');
        }
    });
});

function displayInvoice(invoice) {
    const invoiceContent = document.getElementById('invoice-content');

    // Extraer la fecha y hora
    const invoiceDate = new Date(invoice.date);
    const formattedDate = invoiceDate.toLocaleDateString();
    const formattedTime = invoiceDate.toLocaleTimeString();

    const invoiceHTML = `
        <p><strong>Nombre:</strong> ${invoice.userName || 'Cliente'}</p>
        <p><strong>Fecha:</strong> ${formattedDate}</p>
        <p><strong>Hora:</strong> ${formattedTime}</p>
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
    `;

    invoiceContent.innerHTML = invoiceHTML;

    // Configurar el botón de descarga
    document.getElementById('download-pdf').addEventListener('click', () => generatePDF(invoiceHTML));
}

function generatePDF(invoiceHTML) {
    const pdfWindow = window.open('', '_blank');
    pdfWindow.document.write(`
        <html>
        <head>
            <title>Factura</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css">
        </head>
        <body>
            <div class="container mt-5">
                <h1 class="text-center">Factura</h1>
                ${invoiceHTML}
            </div>
        </body>
        </html>
    `);
    pdfWindow.document.close();
    pdfWindow.focus();
    pdfWindow.print(); // Abre la ventana de impresión
}
