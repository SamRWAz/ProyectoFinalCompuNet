class Order {
    constructor(customerId, products, totalAmount, date, status, paymentMethod) {
        // Validación de campos obligatorios
        if (!customerId || !products || products.length === 0 || !totalAmount || !date || !status) {
            throw new Error("Some fields were left empty, please complete the information.");
        }

        // Asignación de propiedades
        this.customerId = customerId;
        this.products = products; // Array de productos [{ productId, name, price, quantity }]
        this.totalAmount = totalAmount;
        this.date = date;
        this.status = status;
        this.paymentMethod = paymentMethod;
    }
}

// Exportación de la clase Order
module.exports = Order;
