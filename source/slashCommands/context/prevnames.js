const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: "prevnames",
    type: 2,
    /**
     * @param {Snoway} client
     * @param {Discord.Integration} interaction
     */
    run: async (client, interaction) => {
        return interaction.reply({ content: 'La fonctionnalité prevnames (via l\'ancienne API) est désactivée sur ce squelette.', flags: Discord.MessageFlags.Ephemeral });
    }
};