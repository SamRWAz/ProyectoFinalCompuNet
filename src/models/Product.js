class Product {

    constructor(name, image, price, quantity) {
        if (!name || !image || !price || !quantity ) {
            throw new Error('Some fields were left empty, please complete the information.');
        }
        this.id = Date.now().toString();
        this.name = name;
        this.image = image;
        this.price = price;
        this.quantity = quantity;
    }
}

module.exports = Product;