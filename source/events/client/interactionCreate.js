const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'interactionCreate',
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Interaction} interaction 
     * @returns 
     */
    run: async (client, interaction) => {
        if (interaction.type === Discord.InteractionType.ApplicationCommand) {
            const SlashCommands = client.slashCommands.get(interaction.commandName);
            if (!SlashCommands) {
                console.log(`[INTERACTION] Commande non trouvée: ${interaction.commandName} (type: ${interaction.commandType})`);
                return;
            }
            try {
                await SlashCommands.run(client, interaction);
            } catch (error) {
                console.error(`[INTERACTION ERROR] Commande: ${interaction.commandName}`, error);
                // Tenter de répondre à l'utilisateur en cas d'erreur
                const errorMessage = { content: "Une erreur est survenue lors de l'exécution de cette commande.", ephemeral: true };
                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply(errorMessage).catch(() => {});
                } else {
                    await interaction.reply(errorMessage).catch(() => {});
                }
            }
        }
    }
}