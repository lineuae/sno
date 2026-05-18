const Discord = require('discord.js');
const Snoway = require('../../structures/client/index');

const URL_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?/gi;

function extractDomain(url) {
    try {
        const normalized = url.startsWith('http') ? url : 'https://' + url;
        return new URL(normalized).hostname.replace(/^www\./, '');
    } catch {
        return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0].split('?')[0];
    }
}

function isDomainWhitelisted(domain, whitelist) {
    return whitelist.some(w => domain === w || domain.endsWith('.' + w));
}

module.exports = {
    name: 'messageCreate',
    /**
     * @param {Snoway} client
     * @param {Discord.Message} message
     */
    run: async (client, message) => {
        if (!message.guild || message.author.bot) return;

        const guildId = message.guild.id;
        const cfg = await client.db.get(`antilink_${guildId}`);
        if (!cfg || !cfg.status) return;

        // Owners and buyers bypass
        const owners = await client.db.get('owner') || [];
        if (
            client.dev.includes(message.author.id) ||
            client.config.buyers.includes(message.author.id) ||
            owners.includes(message.author.id) ||
            message.author.id === message.guild.ownerId
        ) return;

        // Exempt channels
        if (cfg.exemptChannels?.includes(message.channelId)) return;

        // Exempt roles
        if (cfg.exemptRoles?.length && message.member.roles.cache.some(r => cfg.exemptRoles.includes(r.id))) return;

        const matches = message.content.match(URL_REGEX);
        if (!matches) return;

        // Check if all found URLs are whitelisted
        const whitelist = cfg.whitelist || [];
        const forbidden = whitelist.length
            ? matches.filter(url => !isDomainWhitelisted(extractDomain(url), whitelist))
            : matches;

        if (!forbidden.length) return;

        // Delete the message
        await message.delete().catch(() => {});

        const action = cfg.action || 'delete';
        const color = await client.db.get(`color_${guildId}`) || client.config.color;

        // Notify the user
        const notif = await message.channel.send(
            `> ${message.author}, les liens ne sont pas autorisés sur ce serveur.`
        ).catch(() => null);
        if (notif) setTimeout(() => notif.delete().catch(() => {}), 5000);

        // Apply action
        if (action === 'warn') {
            await client.db.push(`sanctions_${guildId}`, {
                type: 'warn',
                id: Math.floor(Math.random() * 9999),
                user: message.author.id,
                reason: 'Anti-lien — lien interdit',
                date: new Date(),
                mod: client.user.id
            });
        } else if (action === 'mute') {
            const duration = cfg.muteDuration || 300000;
            await message.member.timeout(duration, 'Anti-lien — lien interdit').catch(() => {});
        }

        // Log
        if (cfg.logChannel) {
            const logChannel = message.guild.channels.cache.get(cfg.logChannel);
            if (logChannel) {
                const embed = new Discord.EmbedBuilder()
                    .setColor(color)
                    .setFooter(client.footer)
                    .setAuthor({ name: 'Anti-lien', iconURL: message.guild.iconURL({ size: 64 }) })
                    .addFields(
                        { name: 'Membre', value: `${message.author} (\`${message.author.username}\`)`, inline: true },
                        { name: 'Salon', value: `<#${message.channelId}>`, inline: true },
                        { name: 'Action', value: `\`${action}\``, inline: true },
                        { name: 'Lien(s) détecté(s)', value: forbidden.map(u => `\`${u}\``).join('\n').slice(0, 1024) }
                    )
                    .setTimestamp();
                logChannel.send({ embeds: [embed] }).catch(() => {});
            }
        }
    }
};
