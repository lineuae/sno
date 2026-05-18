const Discord = require('discord.js');
const ms = require('../../structures/Utils/ms');

const DEFAULT = {
    status: false,
    action: 'delete',
    muteDuration: 300000,
    whitelist: [],
    exemptRoles: [],
    exemptChannels: [],
    logChannel: null
};

function buildStatusEmbed(client, cfg, guild) {
    const actionLabel = { delete: 'Suppression', warn: 'Avertissement', mute: 'Mute' };
    const exemptRolesList = cfg.exemptRoles.length
        ? cfg.exemptRoles.map(id => `<@&${id}>`).join(', ')
        : '`Aucun`';
    const exemptChannelsList = cfg.exemptChannels.length
        ? cfg.exemptChannels.map(id => `<#${id}>`).join(', ')
        : '`Aucun`';
    const whitelistDisplay = cfg.whitelist.length
        ? cfg.whitelist.map(d => `\`${d}\``).join(', ')
        : '`Aucun`';

    return new Discord.EmbedBuilder()
        .setColor(client.color)
        .setFooter(client.footer)
        .setTitle(`Anti-lien — ${guild.name}`)
        .addFields(
            { name: 'Statut', value: cfg.status ? '**Activé**' : '**Désactivé**', inline: true },
            { name: 'Action', value: actionLabel[cfg.action] || cfg.action, inline: true },
            { name: 'Durée mute', value: cfg.action === 'mute' ? `\`${ms(cfg.muteDuration)}\`` : '`—`', inline: true },
            { name: 'Salon de logs', value: cfg.logChannel ? `<#${cfg.logChannel}>` : '`Non configuré`', inline: true },
            { name: 'Whitelist', value: whitelistDisplay, inline: false },
            { name: 'Rôles exemptés', value: exemptRolesList, inline: true },
            { name: 'Salons exemptés', value: exemptChannelsList, inline: true }
        );
}

module.exports = {
    name: 'antilink',
    aliases: ['antilien'],
    description: {
        fr: 'Configure le filtre anti-lien du serveur',
        en: 'Configure the server anti-link filter'
    },
    usage: {
        fr: {
            'antilink': 'Affiche la configuration actuelle',
            'antilink on/off': 'Active ou désactive le filtre',
            'antilink action <delete|warn|mute>': 'Définit l\'action à effectuer',
            'antilink mute <durée>': 'Durée du mute si l\'action est "mute"',
            'antilink whitelist add <domaine>': 'Ajoute un domaine autorisé (ex: youtube.com)',
            'antilink whitelist remove <domaine>': 'Retire un domaine de la whitelist',
            'antilink whitelist reset': 'Vide la whitelist',
            'antilink exempt role <@rôle>': 'Ajoute/retire un rôle exempté',
            'antilink exempt channel <#salon>': 'Ajoute/retire un salon exempté',
            'antilink logs <#salon|off>': 'Configure le salon de logs'
        },
        en: {
            'antilink': 'Show current config',
            'antilink on/off': 'Enable or disable the filter',
            'antilink action <delete|warn|mute>': 'Set the action to perform',
            'antilink mute <duration>': 'Mute duration when action is "mute"',
            'antilink whitelist add <domain>': 'Add an allowed domain',
            'antilink whitelist remove <domain>': 'Remove a domain from whitelist',
            'antilink whitelist reset': 'Clear the whitelist',
            'antilink exempt role <@role>': 'Toggle an exempt role',
            'antilink exempt channel <#channel>': 'Toggle an exempt channel',
            'antilink logs <#channel|off>': 'Set the log channel'
        }
    },
    run: async (client, message, args) => {
        const guildId = message.guild.id;
        const cfg = Object.assign({}, DEFAULT, await client.db.get(`antilink_${guildId}`) || {});

        const sub = args[0]?.toLowerCase();

        if (!sub || sub === 'status') {
            return message.channel.send({ embeds: [buildStatusEmbed(client, cfg, message.guild)] });
        }

        if (sub === 'on' || sub === 'off') {
            cfg.status = sub === 'on';
            await client.db.set(`antilink_${guildId}`, cfg);
            return message.channel.send(`> Anti-lien **${cfg.status ? 'activé' : 'désactivé'}**.`);
        }

        if (sub === 'action') {
            const valid = ['delete', 'warn', 'mute'];
            const action = args[1]?.toLowerCase();
            if (!action || !valid.includes(action)) {
                return message.channel.send(`> Erreur : Actions valides : \`delete\`, \`warn\`, \`mute\``);
            }
            cfg.action = action;
            await client.db.set(`antilink_${guildId}`, cfg);
            return message.channel.send(`> Action définie sur **${action}**.`);
        }

        if (sub === 'mute') {
            const duration = args[1];
            if (!duration || !ms(duration)) {
                return message.channel.send(`> Erreur : Durée invalide. Exemple : \`10m\`, \`1h\`, \`30s\``);
            }
            if (ms(duration) > 2419200000) {
                return message.channel.send(`> Erreur : La durée maximale est de 28 jours.`);
            }
            cfg.muteDuration = ms(duration);
            await client.db.set(`antilink_${guildId}`, cfg);
            return message.channel.send(`> Durée du mute définie sur **${duration}**.`);
        }

        if (sub === 'whitelist') {
            const action = args[1]?.toLowerCase();
            const domain = args[2]?.toLowerCase().replace(/^(?:https?:\/\/)?(?:www\.)?/, '').split('/')[0];

            if (action === 'add') {
                if (!domain) return message.channel.send(`> Erreur : Usage : \`antilink whitelist add <domaine>\``);
                if (cfg.whitelist.includes(domain)) {
                    return message.channel.send(`> Erreur : \`${domain}\` est déjà dans la whitelist.`);
                }
                cfg.whitelist.push(domain);
                await client.db.set(`antilink_${guildId}`, cfg);
                return message.channel.send(`> \`${domain}\` ajouté à la whitelist.`);
            }

            if (action === 'remove') {
                if (!domain) return message.channel.send(`> Erreur : Usage : \`antilink whitelist remove <domaine>\``);
                if (!cfg.whitelist.includes(domain)) {
                    return message.channel.send(`> Erreur : \`${domain}\` n'est pas dans la whitelist.`);
                }
                cfg.whitelist = cfg.whitelist.filter(d => d !== domain);
                await client.db.set(`antilink_${guildId}`, cfg);
                return message.channel.send(`> \`${domain}\` retiré de la whitelist.`);
            }

            if (action === 'reset') {
                cfg.whitelist = [];
                await client.db.set(`antilink_${guildId}`, cfg);
                return message.channel.send(`> Whitelist vidée.`);
            }

            if (action === 'list' || !action) {
                const display = cfg.whitelist.length
                    ? cfg.whitelist.map(d => `\`${d}\``).join(', ')
                    : '`Aucun domaine whitelisté`';
                return message.channel.send(`> **Whitelist :** ${display}`);
            }

            return message.channel.send(`> Erreur : Sous-commandes : \`add <domaine>\`, \`remove <domaine>\`, \`reset\`, \`list\``);
        }

        if (sub === 'exempt') {
            const type = args[1]?.toLowerCase();

            if (type === 'role') {
                const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
                if (!role) return message.channel.send(`> Erreur : Mentionnez ou précisez l'ID d'un rôle.`);
                if (cfg.exemptRoles.includes(role.id)) {
                    cfg.exemptRoles = cfg.exemptRoles.filter(id => id !== role.id);
                    await client.db.set(`antilink_${guildId}`, cfg);
                    return message.channel.send(`> <@&${role.id}> **retiré** des rôles exemptés.`);
                }
                cfg.exemptRoles.push(role.id);
                await client.db.set(`antilink_${guildId}`, cfg);
                return message.channel.send(`> <@&${role.id}> **ajouté** aux rôles exemptés.`);
            }

            if (type === 'channel') {
                const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]);
                if (!channel) return message.channel.send(`> Erreur : Mentionnez ou précisez l'ID d'un salon.`);
                if (cfg.exemptChannels.includes(channel.id)) {
                    cfg.exemptChannels = cfg.exemptChannels.filter(id => id !== channel.id);
                    await client.db.set(`antilink_${guildId}`, cfg);
                    return message.channel.send(`> <#${channel.id}> **retiré** des salons exemptés.`);
                }
                cfg.exemptChannels.push(channel.id);
                await client.db.set(`antilink_${guildId}`, cfg);
                return message.channel.send(`> <#${channel.id}> **ajouté** aux salons exemptés.`);
            }

            return message.channel.send(`> Erreur : Usage : \`antilink exempt role <@rôle>\` ou \`antilink exempt channel <#salon>\``);
        }

        if (sub === 'logs') {
            const arg = args[1];
            if (!arg) return message.channel.send(`> Erreur : Usage : \`antilink logs <#salon|off>\``);
            if (arg === 'off') {
                cfg.logChannel = null;
                await client.db.set(`antilink_${guildId}`, cfg);
                return message.channel.send(`> Logs anti-lien désactivés.`);
            }
            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(arg);
            if (!channel) return message.channel.send(`> Erreur : Salon introuvable.`);
            cfg.logChannel = channel.id;
            await client.db.set(`antilink_${guildId}`, cfg);
            return message.channel.send(`> Logs anti-lien envoyés dans <#${channel.id}>.`);
        }

        return message.channel.send({ embeds: [buildStatusEmbed(client, cfg, message.guild)] });
    }
};
