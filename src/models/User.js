const bcrypt = require('bcrypt');

class User {
    constructor(name, email, password, role, hashedPassword = null) {
        if (!name || !email || !role) {
            throw new Error("Missing required fields")
        }
        this.id = Date.now().toString(); // Generar ID único
        this.name = name;
        this.email = email;
        this.password = hashedPassword || this.hashPassword(password);
        this.role = role;
    }

    // Método para hashear contraseña
    hashPassword(password) {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    // Método para verificar contraseña
    comparePassword(password) {
        return bcrypt.compareSync(password, this.password);
    }

    // Método para eliminar la contraseña antes de enviar datos de usuario
    toJSON() {
        const { password, ...userWithoutPassword } = this;
        return userWithoutPassword;
    }

    // Método estático para crear un usuario desde datos planos (como de un JSON)
    static fromJSON(data) {
        return new User(
            data.name, 
            data.email, 
            null, 
            data.role, 
            data.password // Pasamos la contraseña hasheada existente
        );
    }
}

module.exports = User;