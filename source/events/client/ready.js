const { mind } = require('gradient-string');
const ligne = require('../../structures/Utils/ligne');

module.exports = {
    name: 'clientReady',
    run: async (client) => {
        console.clear();
        const time = new Date().toLocaleString('fr-FR', {
            timeZone: 'Europe/Paris',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const userbot = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toLocaleString();

        console.log(mind('___________________________________________________________\n'));
        console.log(mind(`[BOT]      : ${client.user.username} (${client.user.id}) connecté à ${time}`));
        console.log(mind(`[LANGUE]   : ${await client.db.get('langue') || 'fr'}`));
        console.log(mind(`[COMMANDS] : ${client.commands.size}`));
        console.log(mind(`[GUILDS]   : ${client.guilds.cache.size}`));
        console.log(mind(`[CHANNELS] : ${client.channels.cache.size}`));
        console.log(mind(`[USERS]    : ${userbot}`));
        console.log(mind(`[LIGNES]   : ${ligne.ligne().toLocaleString()}`));
        console.log(mind(`[VERSION]  : ${client.version}`));
        console.log(mind('___________________________________________________________\n'));
        console.log(mind('Noria est prêt'));
        console.log(mind('___________________________________________________________\n'));

        const restartChannelId = await client.db.get('restartchannel');
        if (restartChannelId) {
            const channel = client.channels.cache.get(restartChannelId);
            if (channel) {
                await channel.send('Bot en ligne.');
                await client.db.delete('restartchannel');
            }
        }
    },
};
