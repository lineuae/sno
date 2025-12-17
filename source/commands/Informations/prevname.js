const { EmbedBuilder } = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'prevname',
    aliases: ['prevnames'],
    description: {
        fr: "Affiche les prevnames d\'un membres",
        en: "Display member's prevnames"
    },
    usage: {
        fr: {"prevname [mention/id]": "Affiche les prevnames d\'un membres"},
        en: {"prevname [mention/id]": "Display member's prevnames"}
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Snoway} message 
     * @param {Snoway} args 
     */
    run: async (client, message, args) => {
        return message.channel.send('La fonctionnalité de prevnames est désactivée car l\'ancienne API/panel n\'est plus utilisée.');
    }
};
