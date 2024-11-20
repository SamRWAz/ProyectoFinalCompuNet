class Cart {

    constructor(user, items){

        if(!user || items.length === 0){
            throw new Error("Missing required fields")
        }
        
        this.user = user;
        this.items = items;
    }
}

module.exports = Cart;
