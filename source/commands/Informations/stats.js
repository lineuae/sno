const Discord = require('discord.js');
const Snoway = require("../../structures/client/index")
module.exports = {
    name: 'stats',
    description: {
        fr: "Affiche les statistiques du serveur",
        en: "Displays server statistics"
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const members = await message.guild.members.fetch();
        const onlineMembers = members.filter(member => member.presence?.status !== 'offline');
        const voiceMembers = members.filter(member => member.voice.channel);
        const boosts = message.guild.premiumSubscriptionCount;

        const embed = new Discord.EmbedBuilder()
            .setColor(client.config.color)
            .setThumbnail(message.guild.iconURL())
            .setTitle(message.guild.name + ' ➔ Statistiques')
            .setDescription(
                `Membres: **${members.size}**\n` +
                `En ligne: **${onlineMembers.size}**\n` +
                `En vocal: **${voiceMembers.size}**\n` +
                `Boosts: **${boosts}**`
            )

        message.channel.send({ embeds: [embed] });
    },
};
