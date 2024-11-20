class Order {
    constructor(user, products, totalAmount, date) {
        // Validación de campos obligatorios
        if (!user || !products || products.length === 0 || !totalAmount || !date ) {
            throw new Error("Some fields were left empty, please complete the information.");
        }

        // Asignación de propiedades
        this.user = user;
        this.products = products; // Array de productos [{ productId, name, price, quantity }]
        this.totalAmount = totalAmount;
        this.date = date;
    }
}

// Exportación de la clase Order
module.exports = Order;
