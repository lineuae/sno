const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: "refreshslash",
    aliases: ["reloadslash", "syncslash"],
    description: {
        fr: "Force le rechargement des commandes slash",
        en: "Force reload of slash commands"
    },
    /**
     * @param {Snoway} client
     * @param {Discord.Message} message
     * @param {Array} args
     */
    run: async (client, message, args) => {
        if (!client.dev.includes(message.author.id)) return;

        const msg = await message.channel.send("🔄 Rechargement des commandes slash...");

        try {
            // Recharger les commandes
            await client.slashEvent();
            
            await msg.edit("✅ Commandes slash rechargées avec succès !\n⚠️ Les commandes context peuvent prendre jusqu'à 1 heure pour apparaître sur Discord.");
        } catch (error) {
            console.error('[REFRESH SLASH] Error:', error);
            await msg.edit("❌ Erreur lors du rechargement des commandes slash.");
        }
    }
};
