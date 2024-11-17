document.addEventListener('DOMContentLoaded', () => {
    loadCartDetails();

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
            alert('Por favor, complete todos los campos del formulario.');
            return;
        }

        const token = localStorage.getItem('token');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (!token || cart.length === 0) {
            alert('No hay productos en el carrito.');
            return;
        }

        try {
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ paymentDetails, cart }),
            });

            if (!response.ok) throw new Error('Error al procesar el pago.');

            const { message, invoice } = await response.json();

            alert(message);

            // Guardar factura en localStorage y vaciar carrito
            localStorage.setItem('invoice', JSON.stringify(invoice));
            localStorage.removeItem('cart');

            // Mostrar factura
            displayInvoice(invoice);
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            alert('Hubo un problema al realizar el pago.');
        }
    });
});

function loadCartDetails() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('No hay productos en el carrito.');
        return;
    }

    const invoiceDetails = document.getElementById('invoice-details');
    invoiceDetails.innerHTML = `
        <h2>Resumen del Carrito</h2>
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

function displayInvoice(invoice) {
    const invoiceDisplay = document.getElementById('invoice-display');
    invoiceDisplay.style.display = 'block';

    const invoiceContent = document.getElementById('invoice-content');
    invoiceContent.innerHTML = `
        <p><strong>Fecha:</strong> ${new Date(invoice.date).toLocaleString()}</p>
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
                        <td>$${item.subtotal.toFixed(2)}</td>
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

    const downloadButton = document.getElementById('download-pdf');
    downloadButton.addEventListener('click', () => downloadPDF(invoice));
}

function downloadPDF(invoice) {
    const pdfContent = `
        <h2>Factura</h2>
        <p><strong>Fecha:</strong> ${invoice.date}</p>
        <table border="1" cellspacing="0" cellpadding="5">
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
                        <td>$${item.subtotal.toFixed(2)}</td>
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

    const pdfWindow = window.open('', '_blank');
    pdfWindow.document.write(pdfContent);
    pdfWindow.document.close();
    pdfWindow.print();
}
