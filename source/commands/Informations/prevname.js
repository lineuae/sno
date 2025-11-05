const { EmbedBuilder } = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'prevname',
    aliases: ['prevnames'],
    description: {
        fr: "Affiche les prevnames d\'un membres",
        en: "Display member's prevnames"
    },
    usage: {
        fr: {"prevname [mention/id]": "Affiche les prevnames d\'un membres"},
        en: {"prevname [mention/id]": "Display member's prevnames"}
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Snoway} message 
     * @param {Snoway} args 
     */
    run: async (client, message, args) => {
        let member = message.mentions.members.first();
        
        if (!member && args[0]) {
            try {
                const fetchedUser = await client.users.fetch(args[0]);
                member = fetchedUser;
            } catch (error) {
                console.error(error);
                return message.channel.send(await client.lang('prevname.nouser'));
            }
        }
        
        if (!member) {
            member = message.author;
        }

        const userId = member.id || member.user?.id || member.id;
        const author = message.author.id === userId;

        let prev;
        try {
            prev = await client.api.prevget(userId);
        } catch (error) {
            console.error('[PREVNAME] Erreur API:', error.message);
            return message.channel.send("❌ Impossible de récupérer les prevnames. L'API est temporairement indisponible.");
        }
        
        if (prev.prevnames.length === 0) {
            return message.channel.send({
                content: author ? "Vous n'avez pas de prevname." : `${member.username || member.user.username} n'a pas de prevname.`
            });
        }

        const embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setTitle(author ? "Vos Prevname" : `Prevname de ${member.username || member.user.username}`)
            .setDescription(prev.prevnames.map((entry, index) => `**${index + 1} -** <t:${Math.floor(entry.temps)}:d> - [\`${entry.prevname}\`](https://discord.com/users/${userId})`).join('\n'))
            .setFooter({ text: client.footer.text, iconURL: message.guild.iconURL() });

        return message.channel.send({
            embeds: [embed]
        });
    }
};
