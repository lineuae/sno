module.exports = {
    api: {
        giphy: {
            // Token GIPHY optionnel, à définir dans les variables d'environnement si nécessaire
            token: process.env.GIPHY_TOKEN || null,
        },
    },
};