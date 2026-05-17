const https = require('node:https');

const fetchBuffer = (url) => new Promise((resolve, reject) => {
    https.get(url, res => {
        if (res.statusCode !== 200) {
            res.resume();
            return reject(Object.assign(new Error(), { code: `HTTP_${res.statusCode}` }));
        }
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
    }).on('error', reject);
});

const INVALID_EMOJI = { fr: 'emoji introuvable ou invalide', en: 'emoji not found or invalid' };

const ERROR_REASONS = {
    30008: { fr: "slots d'emojis pleins", en: 'emoji slots full' },
    50013: { fr: 'permissions manquantes', en: 'missing permissions' },
    50035: INVALID_EMOJI,
    50046: INVALID_EMOJI,
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
            emojis.map(async emoji => {
                const url = `https://cdn.discordapp.com/emojis/${emoji.id}.webp${emoji.animated ? '?animated=true' : ''}`;
                const buffer = await fetchBuffer(url);
                return message.guild.emojis.create({ attachment: buffer, name: emoji.name });
            })
        );

        const added = [];
        const failed = [];

        for (let i = 0; i < results.length; i++) {
            const { name } = emojis[i];
            if (results[i].status === 'fulfilled') {
                added.push(name);
            } else {
                const code = results[i].reason?.code;
                const reason = ERROR_REASONS[code]?.[lang] ?? (fr ? 'erreur inconnue' : 'unknown error');
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
