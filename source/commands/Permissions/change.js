const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'change',
    description: {
        fr: "Change la permission d'une commande",
        en: "Change the permission of a command"
    },
    usage: {
        fr: {
            "change <commande> <permissions/public>": "Permet de changer l'accessibilité d'une commande à plusieurs permissions",
        },
        en: {
            "change <command> <permissions/public>": "Allows you to change the accessibility of a command to multiple permissions",
        }
    },
    /**
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {
        if (args.length < 2) {
            return message.reply(`> \`❌\` Erreur : Usage : \`${client.prefix}change <cmd> <1/2/3/4/5/6/7/8/9/public> [permissions...]\``);
        }

        const commandInput = args[0].toLowerCase();
        const commandName = client.commands.get(commandInput)?.name;

        if (!commandName) {
            return message.reply("> `❌` Erreur : Commande invalide !");
        }

        const permissionsToAssign = args.slice(1).map(p => p.toLowerCase());

        const validPermissions = permissionsToAssign.every(p => 
            p === 'public' || (!isNaN(parseInt(p)) && parseInt(p) >= 1 && parseInt(p) <= 9));

        if (!validPermissions) {
            return message.reply("> `❌` Erreur : Permission invalide !");
        }

        const oldPermissions = await client.db.get(`perms_${message.guild.id}`);
        const newPermissions = oldPermissions || {};

        // Retirer la commande de toutes les permissions existantes
        for (const perm in newPermissions) {
            if (newPermissions[perm].commands) {
                const indexToRemove = newPermissions[perm].commands.indexOf(commandName);
                if (indexToRemove !== -1) {
                    newPermissions[perm].commands.splice(indexToRemove, 1);
                }
            }
        }

        // Ajouter la commande aux nouvelles permissions spécifiées
        permissionsToAssign.forEach(permission => {
            if (permission === 'public') {
                const publicPermissionIndex = newPermissions['public'] || { status: false, commands: [] };
                if (!publicPermissionIndex.commands.includes(commandName)) {
                    publicPermissionIndex.commands.push(commandName);
                }
                newPermissions['public'] = publicPermissionIndex;
            } else {
                const permIndex = `perm${permission}`;
                const permissionData = newPermissions[permIndex] || { roles: [], commands: [] };
                if (!permissionData.commands.includes(commandName)) {
                    permissionData.commands.push(commandName);
                }
                newPermissions[permIndex] = permissionData;
            }
        });

        await client.db.set(`perms_${message.guild.id}`, newPermissions);

        return message.reply(`La commande \`${commandName}\` a bien été modifiée pour les permissions suivantes : \`${permissionsToAssign.join(', ')}\`.`);
    }
};
