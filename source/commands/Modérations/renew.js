const Discord = require('discord.js');

module.exports = {
    name: 'renew',
    aliases: ['nuke'],
    description: {
        fr: "Supprime et recrée un salon en conservant ses paramètres",
        en: "Deletes and recreates a channel keeping its settings"
    },
    usage: {
        fr: { "renew [#channel]": "Recrée le salon ciblé ou le salon actuel" },
        en: { "renew [#channel]": "Recreates the targeted channel or the current one" }
    },
    run: async (client, message, args) => {
        const target = message.mentions.channels.first() || message.channel;

        const row = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('renew_confirm')
                .setLabel('Confirmer')
                .setStyle(Discord.ButtonStyle.Danger),
            new Discord.ButtonBuilder()
                .setCustomId('renew_cancel')
                .setLabel('Annuler')
                .setStyle(Discord.ButtonStyle.Secondary)
        );

        const confirmMsg = await message.channel.send({
            content: `> ⚠️ Renouveler <#${target.id}> ? **Tous les messages seront supprimés définitivement.**`,
            components: [row]
        });

        const collector = confirmMsg.createMessageComponentCollector({
            filter: i => i.user.id === message.author.id,
            time: 15_000,
            max: 1
        });

        collector.on('collect', async i => {
            if (i.customId === 'renew_cancel') {
                return i.update({ content: '> Annulé.', components: [] });
            }

            await i.deferUpdate().catch(() => {});

            try {
                const position = target.rawPosition;
                const clone = await target.clone({ reason: `Renew par ${message.author.username}` });
                await clone.setPosition(position).catch(() => {});
                await target.delete(`Renew par ${message.author.username}`);

                const embed = new Discord.EmbedBuilder()
                    .setColor(client.color)
                    .setFooter(client.footer)
                    .setDescription(`> Salon renouvelé par **${message.author.username}**`)
                    .setTimestamp();

                await clone.send({ embeds: [embed] });
            } catch (error) {
                if (error.code === 50013) {
                    return message.channel.send('> \`❌\` Je n\'ai pas les permissions pour renouveler ce salon.').catch(() => {});
                }
                console.error('[RENEW]', error);
                message.channel.send('> \`❌\` Une erreur est survenue.').catch(() => {});
            }
        });

        collector.on('end', (_, reason) => {
            if (reason === 'time') {
                confirmMsg.edit({ content: '> Délai expiré, annulé.', components: [] }).catch(() => {});
            }
        });
    }
};
