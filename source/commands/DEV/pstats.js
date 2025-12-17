const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: "pstats",
    description: "Affiche le nombre de prevname",
    /**
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {
        return message.reply('Les statistiques de l\'ancienne API sont désactivées sur ce squelette.');
    }
};

function numm(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
