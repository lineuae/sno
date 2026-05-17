const ms = require("../../structures/Utils/ms");

module.exports = {
    name: 'mute',
    description: {
        fr: 'Permet de rendre muet un utilisateur du serveur',
        en: "Mute a server user"
    },
    usage: {
        fr: { "mute <@user/ID> [durée] [raison]": "Rend muet un utilisateur (durée par défaut: 28j)" },
        en: { "mute <@user/ID> [duration] [reason]": "Mute a server user (default duration: 28d)" }
    },
    run: async (client, message, args) => {
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return message.reply({ content: 'Veuillez indiquer un membre' });

        if (target.id === message.guild.ownerId) {
            return message.reply('> `❌` Vous ne pouvez pas mute le propriétaire du serveur');
        }

        let duration = ms('28d');
        let reasonStart = 1;

        if (args[1] && isNaN(args[1])) {
            const parsed = ms(args[1]);
            if (parsed) {
                duration = parsed;
                reasonStart = 2;
            }
        }

        const reason = args.slice(reasonStart).join(' ') || undefined;

        try {
            await target.timeout(duration, reason);
            message.channel.send({ content: `${target.user} a été **timeout**` });
        } catch (error) {
            if (error.code === 50013) {
                return message.reply('> `❌` Je ne peux pas mute ce membre');
            }
            message.channel.send('> `❌` Une erreur est survenue');
        }
    }
};
