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
        await interaction.deferReply();
        
        const color = await client.db.get(`color_${interaction.guild.id}`) || client.config.color;
        
        // Récupérer l'utilisateur ciblé ou l'auteur de la commande
        const targetUser = interaction.options.getUser('user') || interaction.user;
        const userId = targetUser.id;
        const author = interaction.user.id === userId;

        let prev;
        try {
            console.log('[PREVNAME SLASH] Appel API pour userId:', userId);
            prev = await client.api.prevget(userId);
            console.log('[PREVNAME SLASH] Réponse API:', prev);
        } catch (error) {
            console.error('[PREVNAME SLASH] Erreur API complète:', error);
            
            // Fallback: essayer de récupérer depuis la base de données locale
            const localPrevnames = await client.db.get(`prevnames_${userId}`);
            if (localPrevnames && localPrevnames.length > 0) {
                prev = { prevnames: localPrevnames };
                console.log('[PREVNAME SLASH] Utilisation des données locales');
            } else {
                return interaction.editReply({ 
                    content: "❌ Impossible de récupérer les prevnames.\n**Détails:** " + error.message +
                    "\n\n**Configuration API:**\n`Panel:` http://167.114.48.55:30126/api\n`Endpoint:` /prevname/get"
                });
            }
        }
        
        if (!prev || !prev.prevnames || prev.prevnames.length === 0) {
            console.log('[PREVNAME SLASH] Aucun prevname trouvé');
            return interaction.editReply({
                content: author 
                    ? "Vous n'avez pas de prevname." 
                    : `${targetUser.username} n'a pas de prevname.`
            });
        }
        
        console.log('[PREVNAME SLASH] Création de l\'embed avec', prev.prevnames.length, 'prevnames');

        const embed = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(author ? "Vos Prevname" : `Prevname de ${targetUser.username}`)
            .setDescription(
                prev.prevnames
                    .map((entry, index) => 
                        `**${index + 1} -** <t:${Math.floor(entry.temps)}:d> - [\`${entry.prevname}\`](https://discord.com/users/${userId})`
                    )
                    .join('\n')
            )
            .setFooter({ text: client.footer.text, iconURL: interaction.guild.iconURL() });

        return interaction.editReply({
            embeds: [embed]
        });
    }
};
