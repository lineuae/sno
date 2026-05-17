const ERROR_REASONS = {
    30008: { fr: "slots d'emojis pleins", en: 'emoji slots full' },
    50013: { fr: 'permissions manquantes', en: 'missing permissions' },
    50035: { fr: 'emoji introuvable ou invalide', en: 'emoji not found or invalid' },
};

module.exports = {
    name: 'create',
    description: {
        fr: "Permet de copier un emoji pour l'ajouter au serveur",
        en: "Copy an emoji to add it to the server"
    },
    aliases: ["emoji"],
    usage: {
        fr: { "emoji <1-50 émojis>": "Copie un ou plusieurs emoji(s) sur le serveur" },
        en: { "emoji <1-50 emojis>": "Copy one or more emoji(s) to the server" }
    },
    run: async (client, message, args) => {
        const lang = (await client.db.get('langue')) || 'fr';
        const fr = lang === 'fr';
        const pl = (n) => n !== 1 ? 's' : '';

        const emojis = [...args.join(' ').matchAll(/<a?:([a-zA-Z0-9_]+):(\d+)>/g)].map(m => ({
            name: m[1],
            id: m[2],
            animated: m[0].startsWith('<a:'),
        }));

        if (emojis.length === 0) {
            return message.channel.send(
                fr ? 'Veuillez fournir au moins un emoji personnalisé.' : 'Please provide at least one custom emoji.'
            );
        }

        const results = await Promise.allSettled(
            emojis.map(emoji =>
                message.guild.emojis.create({
                    attachment: `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}`,
                    name: emoji.name,
                })
            )
        );

        const added = [];
        const failed = [];

        for (let i = 0; i < results.length; i++) {
            const { name } = emojis[i];
            if (results[i].status === 'fulfilled') {
                added.push(name);
            } else {
                const code = results[i].reason?.code;
                const reason = ERROR_REASONS[code]?.[lang] ?? `code ${code} — ${results[i].reason?.message?.split('\n')[0] ?? '?'}`;
                failed.push(`**${name}** — ${reason}`);
            }
        }

        const lines = [];

        if (added.length > 0) {
            const n = added.length;
            lines.push(
                fr
                    ? `**${n} emoji${pl(n)} ajouté${pl(n)}** : ${added.map(x => `\`${x}\``).join(', ')}`
                    : `**${n} emoji${pl(n)} added**: ${added.map(x => `\`${x}\``).join(', ')}`
            );
        }

        if (failed.length > 0) {
            const n = failed.length;
            lines.push(
                fr
                    ? `**Échec sur ${n} emoji${pl(n)}** :\n${failed.join('\n')}`
                    : `**Failed on ${n} emoji${pl(n)}**:\n${failed.join('\n')}`
            );
        }

        if (lines.length > 0) message.channel.send(lines.join('\n\n'));
    },
};
