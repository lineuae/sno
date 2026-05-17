const Discord = require('discord.js');
const fs = require('fs');

const FILE_EMOJIS = {
    Informations: '🔍',
    Buyers: '🔰',
    'Modérations': '⚔',
    Utilitaires: '🛠',
    Permissions: '🎭',
    Logs: '📁',
    Owner: '🔑',
    Misc: '🎗',
};

const FOLDER_ORDER = ['Modérations', 'Informations', 'Utilitaires', 'Misc', 'Logs', 'Permissions', 'Owner', 'Buyers'];

module.exports = {
    name: 'help',
    description: {
        fr: "Affiche les commandes du bot",
        en: "Displays bot commands"
    },
    usage: {
        fr: { "help [commande]": "Affiche les commandes ou une commande du bot" },
        en: { "help [command]": "Displays commands or a bot command" }
    },
    run: async (client, message, args) => {
        const lang = await client.db.get('langue') || 'fr';
        const aidetext = await client.lang('help.aide');
        const aide = aidetext.replace('{prefix}', client.prefix);

        if (args.length === 0) {
            const folders = fs.readdirSync('./source/commands').filter(f => f !== 'DEV');
            const module = await client.db.get('module-help') || 'normal';

            const existingFolders = new Set(folders);
            const orderedFolders = FOLDER_ORDER.filter(f => existingFolders.has(f));

            if (module === 'onepage') {
                const formattedCategories = [];
                for (const folder of orderedFolders) {
                    const cmdFiles = fs.readdirSync(`./source/commands/${folder}`).filter(f => f.endsWith('.js'));
                    const names = cmdFiles.map(file => {
                        try { return require(`../${folder}/${file}`).name; } catch { return null; }
                    }).filter(Boolean);
                    formattedCategories.push(`**${FILE_EMOJIS[folder] || '❌'}・${folder}**\n\`${names.join('`, `') || await client.lang('help.nocmd')}\``);
                }

                const helptext = await client.lang('help.help');
                const embed = new Discord.EmbedBuilder()
                    .setColor(client.config.color)
                    .setAuthor({ name: "Noria V4", url: client.user.avatarURL(), iconURL: client.user.avatarURL() })
                    .setDescription(
                        `${await client.lang('help.prefix')} \`${client.prefix}\`\n` +
                        `${await client.lang('help.cmd')} \`${client.commands.size}\`\n` +
                        `${helptext.replace('{prefix}', client.prefix)}\n\n` +
                        formattedCategories.join('\n\n')
                    )
                    .setFooter(client.footer);

                return message.channel.send({ embeds: [embed] });
            }

            // mode "normal" (et "hybride" qui était identique)
            const buildPage = (pageIndex) => {
                const folder = orderedFolders[pageIndex];
                const cmdFiles = fs.readdirSync(`./source/commands/${folder}`).filter(f => f.endsWith('.js'));
                const descriptions = cmdFiles.map(file => {
                    let cmd;
                    try { cmd = require(`../${folder}/${file}`); } catch { return null; }
                    const usage = cmd.usage?.[lang] || cmd.usage?.fr || { [cmd.name]: cmd.description?.[lang] || cmd.description?.fr || '' };
                    return Object.entries(usage).map(([k, v]) => `\n\`${client.prefix}${k}\`\n${v}`).join('');
                }).filter(Boolean);

                const embed = new Discord.EmbedBuilder()
                    .setColor(client.config.color)
                    .setTitle(`${FILE_EMOJIS[folder] || '❌'} ${folder}`)
                    .setFooter(client.footer)
                    .setDescription(`${aide}\n` + descriptions.join(''));

                const row = new Discord.ActionRowBuilder().addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId('helpMenu')
                        .setPlaceholder('Noria')
                        .addOptions(orderedFolders.map(f => ({
                            label: f,
                            value: f,
                            emoji: FILE_EMOJIS[f] || '❌',
                        })))
                );

                const pageRow = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('helpPage')
                        .setDisabled(true)
                        .setStyle(Discord.ButtonStyle.Secondary)
                        .setLabel(`${pageIndex + 1}/${orderedFolders.length}`)
                );

                return { embeds: [embed], components: [row, pageRow] };
            };

            let page = 0;
            if (args.length > 0 && !isNaN(args[0])) {
                page = Math.max(0, Math.min(parseInt(args[0]) - 1, orderedFolders.length - 1));
            }

            const helpMessage = await message.channel.send(buildPage(page));
            const collector = helpMessage.createMessageComponentCollector({
                filter: i => i.customId === 'helpMenu',
                time: 120_000
            });

            collector.on('collect', async i => {
                if (i.user.id !== message.author.id) {
                    return i.reply({ content: await client.lang('interaction'), flags: 64 });
                }
                const newPage = orderedFolders.indexOf(i.values[0]);
                await i.update(buildPage(newPage));
            });

            collector.on('end', () => {
                helpMessage.edit({ components: [] }).catch(() => {});
            });

            return;
        }

        // help <commande>
        const cmdname = args[0].toLowerCase();
        const command = client.commands.get(cmdname);
        if (!command) {
            const msg = (await client.lang('help.inconnue')).replace('{prefix}', client.prefix);
            return message.reply(msg);
        }

        const usage = command.usage?.[lang] || command.usage?.fr || { [command.name]: command.description?.[lang] || command.description?.fr || '' };
        const fields = Object.entries(usage).map(([k, v]) => ({
            name: `\`${client.prefix}${k}\``,
            value: v,
            inline: false
        }));

        const embed = new Discord.EmbedBuilder()
            .setTitle(`${await client.lang('help.command')} ${command.name.charAt(0).toUpperCase() + command.name.slice(1)}`)
            .setColor(client.config.color)
            .setFooter(client.footer)
            .addFields(fields);

        const row = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setStyle(Discord.ButtonStyle.Link)
                .setURL(client.support)
                .setLabel(await client.lang('help.button'))
        );

        message.channel.send({ embeds: [embed], components: [row] });
    }
};
