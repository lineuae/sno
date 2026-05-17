const Discord = require('discord.js');

module.exports = {
    name: 'resetbot',
    description: {
        fr: "Supprime toutes les données du bot",
        en: "Deletes all bot data"
    },
    run: async (client, message) => {
        if (!client.config.buyers.includes(message.author.id)) return;

        try {
            const row = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setLabel('✅')
                    .setCustomId('resetbot_valider_' + message.id)
                    .setStyle(Discord.ButtonStyle.Secondary),
                new Discord.ButtonBuilder()
                    .setLabel('❌')
                    .setCustomId('resetbot_refuser_' + message.id)
                    .setStyle(Discord.ButtonStyle.Danger)
            );

            const msg = await message.channel.send({
                content: await client.lang('resetbot.message'),
                components: [row]
            });

            const collector = msg.createMessageComponentCollector({ time: 60_000 });

            collector.on('collect', async (i) => {
                if (i.user.id !== message.author.id) {
                    return i.reply({ content: await client.lang('interaction'), flags: 64 });
                }

                collector.stop();

                if (i.customId === `resetbot_valider_${message.id}`) {
                    await client.db.clear();
                    await i.update({ content: await client.lang('resetbot.reset'), components: [] });
                } else {
                    await i.update({ content: await client.lang('resetbot.noreset'), components: [] });
                }
            });

            collector.on('end', (_, reason) => {
                if (reason === 'time') {
                    msg.edit({ components: [] }).catch(() => {});
                }
            });
        } catch (error) {
            message.channel.send(`${await client.lang('resetbot.erreur')} \`\`\`js\n${error.message}\`\`\``);
        }
    }
};
