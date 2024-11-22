class Cart {
    constructor(customer, items = []) {
        if (!customer) {
            throw new Error("Missing required fields: customer");
        }
        this.customer = customer;
        this.items = items;
    }
}

module.exports = Cart;
