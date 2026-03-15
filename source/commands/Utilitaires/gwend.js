const Discord = require('discord.js');

module.exports = {
    name: 'giveawayend',
    description: {
        fr: 'Permet de mettre fin à un giveaway en cours',
        en: "Ends a giveway in progress"
    },
    aliases: ["end"], 
    usage: {
       fr: {"gwend <code>": "Termine un giveaway en cours en utilisant son code"},
       en: {"gwend <code>": "Ends a giveway in progress using its code"}
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
