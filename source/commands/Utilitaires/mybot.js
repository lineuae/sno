const Snoway = require("../../structures/client");
const Discord = require('discord.js');

module.exports = {
    name: 'mybot',
    aliases: ["mybots", "bot", "bots"],
    description: {
        fr: 'Affiche vos bots',
        en: "Display your bots"
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @returns 
     */
    run: async (client, message, args) => {
        return message.reply({ content: 'La fonctionnalité mybot (liste de bots via panel) est désactivée sur ce squelette.' });
    },
};
