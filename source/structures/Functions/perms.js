const config = require("../../../config/config");

// Vérifie si un utilisateur est owner en utilisant la même DB que le client (MongoDB)
async function owner(db, userId) {
    const owners = await db.get('owner') || [];
    return owners.includes(userId);
}

// Vérifie si un utilisateur est buyer à partir de la config
async function buyer(userId) {
    return config.buyers.includes(userId);
}

module.exports = {
    owner,
    buyer,
}
