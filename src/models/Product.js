class Product {

    constructor(name, description, price, quantity, category) {
        if (!name || !description || !price || !quantity || !category) {
            throw new Error('Some fields were left empty, please complete the information.');
        }
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.category = category;
    }
}

module.exports = Product;