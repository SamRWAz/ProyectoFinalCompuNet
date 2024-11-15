class Product {

    constructor(name, description, price, quantity){

	if(!name || !description || !price || !quantity){
	    throw new Error("Some fields were left empty, please complete the information.")
	}
	this.name = name;
	this.description = description;
	this.price = price;
	this.quantity = quantity;
    }
}

module.exports = Product;
