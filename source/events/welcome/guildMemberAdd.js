const { EmbedBuilder } = require('discord.js');
const Snoway = require('../../structures/client/index');

module.exports = {
    name: 'guildMemberAdd',
    /**
     * @param {Snoway} client 
     * @param {GuildMember} member 
     */
    run: async (client, member) => {
        const guildId = member.guild.id;
        const welcomeConfig = await client.db.get(`welcome_${guildId}`);

        // Vérifier si le système de bienvenue est configuré et activé
        if (!welcomeConfig || !welcomeConfig.enabled || !welcomeConfig.channelId) {
            return;
        }

        // Récupérer le salon de bienvenue
        const channel = member.guild.channels.cache.get(welcomeConfig.channelId);
        if (!channel) {
            console.log(`[Welcome] Channel ${welcomeConfig.channelId} not found in guild ${member.guild.name}`);
            return;
        }

        // Vérifier les permissions du bot
        if (!channel.permissionsFor(member.guild.members.me).has(['SendMessages', 'EmbedLinks'])) {
            console.log(`[Welcome] Missing permissions in channel ${channel.name}`);
            return;
        }

        // Remplacer les variables dans le message
        // Pour {user}, on le remplace temporairement pour savoir s'il est utilisé
        const hasUserMention = welcomeConfig.message.includes('{user}');
        
        const welcomeMessage = welcomeConfig.message
            .replace(/{user}/g, member.toString()) // Utilise member.toString() pour une vraie mention
            .replace(/{username}/g, member.user.username)
            .replace(/{server}/g, member.guild.name)
            .replace(/{membercount}/g, member.guild.memberCount.toString());

        // Créer l'embed de bienvenue
        const embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setDescription(welcomeMessage)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
            .setFooter({ text: `Membre #${member.guild.memberCount}` })
            .setTimestamp();

        try {
            // Si le message contient {user}, on envoie aussi la mention en dehors de l'embed
            // pour s'assurer que la notification fonctionne
            const messageOptions = { embeds: [embed] };
            if (hasUserMention) {
                messageOptions.content = member.toString();
            }
            
            await channel.send(messageOptions);
            console.log(`[Welcome] Message sent for ${member.user.tag} in ${member.guild.name}`);
        } catch (error) {
            console.error(`[Welcome] Error sending welcome message:`, error);
        }
    }
};
