const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: "prevclear",
    description: "Supp les prevnames d'un id",
    /**
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {
        return message.reply('Cette commande prevclear est désactivée car le panel/API n\'est plus utilisé.');
    }
};
