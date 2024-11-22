document.addEventListener('DOMContentLoaded', () => {
    const billsContainer = document.getElementById('bills-container');

    async function fetchBills() {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to view your payment history');
            window.location.href = '/login';
            return;
        }

        try {
            const response = await fetch('/bills/history', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch payment history');
            }

            const { bills } = await response.json();
            renderBills(bills);
        } catch (error) {
            console.error('Error fetching payment history:', error);
            billsContainer.innerHTML = '<p class="text-center">Error loading payment history</p>';
        }
    }

    function renderBills(bills) {
        billsContainer.innerHTML = '';

        if (!bills || bills.length === 0) {
            billsContainer.innerHTML = '<p class="text-center">No payment history available.</p>';
            return;
        }

        bills.forEach(bill => {
            const billCard = document.createElement('div');
            billCard.className = 'col-md-4 mb-4';
            billCard.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Bill ID: ${bill.id || 'N/A'}</h5>
                        <p class="card-text">
                            Date: ${new Date(bill.date).toLocaleString()}<br>
                            Total Amount: $${bill.totalAmount.toFixed(2)}<br>
                            Products: 
                            <ul>
                                ${bill.products
                                    .map(
                                        product => `
                                        <li>${product.name} - $${product.price.toFixed(2)} x ${product.quantity}</li>
                                    `
                                    )
                                    .join('')}
                            </ul>
                        </p>
                    </div>
                </div>
            `;
            billsContainer.appendChild(billCard);
        });
    }

    fetchBills();
});