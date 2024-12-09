module.exports = {
    name: 'setperm',
    description: 'Attribue un ou plusieurs rôles à une permission.',
    usage: {
        fr: {'setperm <permission> <roles>': "Attribue un ou plusieurs rôles à une permission."},
        en: {
            'setperm <permission> <roles>': "Assigns one or more roles to a permission."
        }
    },
    run: async (client, message, args) => {

        if (args.length < 2) {
            return message.channel.send(`\`❌\` Erreur: \`${client.prefix}setperm (1/2/3/4/5/6/7/8/9) @role1 @role2 ...\``);
        }

        const permission = args[0];
        const roles = message.mentions.roles.map(role => role) || args.slice(1).map(roleId => message.guild.roles.cache.get(roleId));

        if (!permission || !roles.length) {
            return message.channel.send('\`❌\` Erreur: Permission ou rôles invalides.');
        }

        const permissionIndex = await client.db.get(`perms_${message.guild.id}`) || {};
        if (permissionIndex["perm" + permission]) {
            permissionIndex["perm" + permission].roles = roles.map(role => role.id);
            await client.db.set(`perms_${message.guild.id}`, permissionIndex);
            message.channel.send(`Les rôles associés à la permission \`${permission}\` ont été mis à jour vers \`${roles.map(role => role.name).join(', ')}\`.`);
        } else {
            message.channel.send(`\`❌\` Erreur: La permission \`${permission}\` n'existe pas.`);
        }
    },
};
