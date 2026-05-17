const Discord = require('discord.js');

module.exports = {
    name: 'ban',
    description: {
        fr: "Permet de bannir l'utilisateur mentionné",
        en: "Allows you to ban the specified user"
    },
    usage: {
        fr: { "ban <@user/ID> [raison]": "Permet de bannir un utilisateur du serveur, une raison peut être précisé" },
        en: { "ban <@user/ID> [reason]": "Allows you to ban a user from the server, a reason can be specified" }
    },
    run: async (client, message, args) => {
        let user = message.mentions.users.first();
        if (!user && args[0]) {
            user = await client.users.fetch(args[0]).catch(() => null);
        }

        if (!user) {
            return message.channel.send('> `❌` Usage: `ban @user [raison]`');
        }

        const owners = await client.db.get('owner') || [];
        if (owners.includes(user.id) || client.config.buyers.includes(user.id)) {
            return message.channel.send('Je ne peux pas bannir cette personne.');
        }

        const reason = args.slice(1).join(' ') || await client.lang('ban.aucuneraison');

        try {
            await message.guild.members.ban(user, { reason });
            message.channel.send(`**${user.username}** a été **banni**`);
            await client.db.push(`sanctions_${message.guild.id}`, {
                type: 'ban',
                id: Math.floor(Math.random() * 9999),
                user: user.id,
                reason,
                date: new Date(),
                mod: message.author.id
            });
        } catch (error) {
            if (error.code === 50013) {
                return message.channel.send('> `❌` Je n\'ai pas les permissions pour bannir cet utilisateur.');
            }
            message.channel.send('> `❌` Une erreur est survenue.');
        }
    }
};
