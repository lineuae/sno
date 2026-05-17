const Discord = require('discord.js');

module.exports = {
    name: 'unbanall',
    description: {
        fr: 'Débannis tous les utilisateurs bannis.',
        en: "Unbans all banned users."
    },
    run: async (client, message) => {
        const bans = await message.guild.bans.fetch();

        if (bans.size === 0) {
            return message.reply({ content: "Il n'y a aucun membre banni.", allowedMentions: { repliedUser: false } });
        }

        try {
            const snapshot = bans.map(ban => ({ id: ban.user.id }));
            await Promise.all(bans.map(ban => message.guild.bans.remove(ban.user.id).catch(() => {})));

            await client.db.set(`unbanall_${message.guild.id}`, snapshot);

            const embed = new Discord.EmbedBuilder()
                .setColor(client.config.color)
                .setDescription(`**${bans.size}** membres ont été débannis. Utilisez \`${client.prefix}cancelunbanall\` pour annuler.`)
                .setFooter(client.footer);

            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        } catch (error) {
            console.error(error);
            message.reply(await client.lang('erreur'));
        }
    }
};
