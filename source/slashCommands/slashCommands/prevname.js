const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'prevname',
    description: "Affiche les prevnames d'un membre",
    description_localizations: {
        "fr": "Affiche les prevnames d'un membre",
        "en-US": "Display member's prevnames"
    },
    type: 1,
    options: [
        {
            name: 'user',
            description: 'Le membre dont vous voulez voir les prevnames',
            description_localizations: {
                "fr": "Le membre dont vous voulez voir les prevnames",
                "en-US": "The member whose prevnames you want to see"
            },
            type: 6, // USER type
            required: false
        }
    ],
    /**
     * @param {Snoway} client
     * @param {Discord.ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        return interaction.reply({ content: 'La fonctionnalité prevname (via l\'ancienne API) est désactivée sur ce squelette.', flags: Discord.MessageFlags.Ephemeral });
    }
};
