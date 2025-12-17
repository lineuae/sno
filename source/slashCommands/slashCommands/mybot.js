const Snoway = require("../../structures/client");
const Discord = require('discord.js');

module.exports = {
    name: 'mybot',
    description:  'Affiche vos bots',
    description_localizations: {
        "fr": "Affiche vos bots", 
        "en-US": "Display your bots"
    },
    type: 1,
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Interaction} interaction 
     * @param {string[]} args 
     */
    run: async (client, interaction) => {
        return interaction.reply({ content: 'La fonctionnalité mybot (via l\'ancienne API) est désactivée sur ce squelette.', flags: Discord.MessageFlags.Ephemeral });
    },
};
