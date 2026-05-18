const Discord = require('discord.js');

module.exports = {
    name: 'role',
    aliases: ['giverole', 'removerole'],
    description: {
        fr: "Ajoute ou retire un rôle à un membre",
        en: "Add or remove a role from a member"
    },
    usage: {
        fr: {
            "role <@user/ID> <@role/ID>": "Ajoute le rôle si le membre ne l'a pas, le retire sinon"
        },
        en: {
            "role <@user/ID> <@role/ID>": "Adds the role if the member doesn't have it, removes it otherwise"
        }
    },
    run: async (client, message, args) => {
        const member = message.mentions.members.first()
            || message.guild.members.cache.get(args[0]);

        if (!member) {
            return message.channel.send('> `❌` Membre introuvable. Usage : `role @user @role`');
        }

        const role = message.mentions.roles.first()
            || message.guild.roles.cache.get(args[1]);

        if (!role) {
            return message.channel.send('> `❌` Rôle introuvable. Usage : `role @user @role`');
        }

        if (role.managed) {
            return message.channel.send('> `❌` Ce rôle est géré par une intégration externe et ne peut pas être attribué manuellement.');
        }

        if (role.id === message.guild.id) {
            return message.channel.send('> `❌` Tu ne peux pas attribuer le rôle `@everyone`.');
        }

        const botMember = message.guild.members.me;
        if (role.comparePositionTo(botMember.roles.highest) >= 0) {
            return message.channel.send('> `❌` Ce rôle est supérieur ou égal à mon rôle le plus élevé, je ne peux pas le gérer.');
        }

        try {
            if (member.roles.cache.has(role.id)) {
                await member.roles.remove(role);
                return message.channel.send(
                    `> Le rôle **${role.name}** a été **retiré** à \`${member.user.username}\`.`
                );
            } else {
                await member.roles.add(role);
                return message.channel.send(
                    `> Le rôle **${role.name}** a été **ajouté** à \`${member.user.username}\`.`
                );
            }
        } catch (error) {
            if (error.code === 50013) {
                return message.channel.send('> `❌` Je n\'ai pas les permissions pour modifier les rôles de ce membre.');
            }
            console.error('[ROLE]', error);
            return message.channel.send('> `❌` Une erreur est survenue.');
        }
    }
};
