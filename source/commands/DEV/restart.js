const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');
const { exec } = require('child_process');

module.exports = {
    name: "restart",
    description: "Redémarre le bot.",
    /**
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {
        try {
            await message.channel.send({ content: 'Redémarrage...' });
            await client.db.set(`restartchannel`, message.channel.id);
            
            // Tenter PM2 d'abord
            exec(`pm2 restart ${client.user.id}`, async (err, stdout, stderr) => {
                if (err) {
                    // Si PM2 n'est pas disponible, redémarrer le processus directement
                    console.log('PM2 non disponible, redémarrage du processus...');
                    process.exit(0);
                }
            });
        } catch (error) {
            console.error('Erreur:', error);
            message.channel.send({ content: `Erreur: ${error.message}` });
        }
    }
};
