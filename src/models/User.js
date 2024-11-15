class User {

    constructor(name, email, role){

	if(!name || !email || !role){
	    throw new Error("Name or Email are Empty")
	}
	this.name = name;
	this.email = email; 
    this.role = role;
    }
}

module.exports = User;
