document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        
        const name = document.getElementById('productName').value;
        const image = document.getElementById('productImage').value;
        const price = parseFloat(document.getElementById('productPrice').value);
        const quantity = document.getElementById('productQuantity').value;
        const productMessage = document.getElementById('productMessage');



        try {

            const token = localStorage.getItem('token');


            const response = await fetch('/products/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                },
                body: JSON.stringify({ name, image, price, quantity })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                productMessage.style.color = 'green';
                productMessage.textContent = 'Registro exitoso';
                window.location.href = '/admin';  // Redirigir al perfil
            } else {
                productMessage.style.color = 'red';
                productMessage.textContent = data.message;
            }
        } catch (error) {
            productMessage.style.color = 'red';
            productMessage.textContent = 'Error en el registro';
        }
    });
});