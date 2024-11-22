class Bill {
    constructor(customer, products = [], totalAmount, date) {
        // Validación de campos obligatorios
        if (!customer || !totalAmount || !date ) {
            throw new Error("Some fields were left empty, please complete the information.");
        }

        // Asignación de propiedades
        this.customer = customer;
        this.products = products; // Array de productos [{ productId, name, price, quantity }]
        this.totalAmount = totalAmount;
        this.date = date;
    }
}

// Exportación de la clase Order
module.exports = Bill;