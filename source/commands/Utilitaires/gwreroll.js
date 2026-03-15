const Discord = require('discord.js');

module.exports = {
    name: 'giveawayreroll',
    aliases: ["reroll"],
    description: {
        fr: 'Permet de choisir de nouveaux gagnants pour un giveaway terminé',
        en: "Allows to choose new winners for a ended giveaway"
    },
    usage: {
        fr: { "reroll <code>": "Choisit de nouveaux gagnants pour un giveaway terminé en utilisant son code" },
        en: { "reroll <code>": "Allows to choose new winners for a ended giveaway using its code" }
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @returns 
     */
    run: async (client, message, args) => {
        return message.reply({ content: 'Cette commande est désactivée.' })
    },
};
