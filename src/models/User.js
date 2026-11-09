
const { randomUUID } = require('crypto');

//region User Model


class User {
    constructor({
        id = randomUUID(),
        fullName,
        email,
        passwordHash,
        role = 'client',
        createdAt = new Date().toISOString(),
        updatedAt = new Date().toISOString()
    }) {
        this.id = id;
        this.fullName = fullName;
        this.email = email.toLowerCase().trim();
        this.passwordHash = passwordHash;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    //region Public Serialization

    toPublicJSON() {
        return {
            id: this.id,
            fullName: this.fullName,
            email: this.email,
            role: this.role,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    //endregion
}

//endregion

module.exports = User;
