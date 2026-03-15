const Snoway = require("../../structures/client");
const Discord = require('discord.js');

module.exports = {
    name: 'zipemoji',
    aliases: ["emojizip", "emojitozip"],
    description: {
        fr: "Crée un Zip des emojis d'un discord",
        en: 'Create a Zip of discord emojis'
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
    }
};
