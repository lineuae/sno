const { QuickDB } = require("quick.db");
const db = new QuickDB();
const config = require("../../../config/config");

async function owner(userId) {
    const database = await db.get(`owner`) || [];
    return database.includes(userId);
}

async function buyer(userId) {
    return config.buyers.includes(userId);
}

module.exports = {
    name: 'perms',
    description: 'Affiche les rôles associés à chaque permission.',
    usage: {
        fr: {'perms': "Affiche les rôles associés à chaque permission."},
        en: {
            'perms': "Displays roles assigned to each permission."
        }
    },
    run: async (client, message) => {
        const permissionIndex = await client.db.get(`perms_${message.guild.id}`) || {};

        // Affichage du contenu de permissionIndex pour le débogage
        console.log(permissionIndex);

        if (Object.keys(permissionIndex).length === 0) {
            return message.channel.send('Aucune permission trouvée.');
        }

        let reply = 'Voici les rôles associés à chaque permission :\n';
        for (const [perm, data] of Object.entries(permissionIndex)) {
            // Affichage du contenu de data pour le débogage
            console.log(data);

            const roles = data.roles.map(roleId => message.guild.roles.cache.get(roleId)?.name || 'Rôle non trouvé').join(', ');
            reply += `\`${perm}\` : ${roles}\n`;
        }

        message.channel.send(reply);
    },
    owner,
    buyer
};
