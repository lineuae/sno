const Snoway = require("../../structures/client");
const Discord = require('discord.js');

module.exports = {
    name: 'create',
    description: {
        fr: "Permet de copier un emoji pour l\'ajouter au serveur",
        en: "Copy an emoji to add it to the server"
    },
    aliases: ["emoji"],
    usage: {
        fr: {
            "emoji <1-50 émojis>": "Permet de copier un ou plusieurs emoji(s) pour les ajouter au serveur"
        }, en: {
            "emoji <1-50 emojis>": "Allows you to copy one or more emoji(s) to add them to the server"
        }
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @returns 
     */
    run: async (client, message, args) => {
        const emojiRegex = /<a?:([a-zA-Z0-9_]+):(\d+)>/;
        let creeemojis = 0;
        let errors = [];

        for (const rawEmoji of args) {
            const match = rawEmoji.match(emojiRegex);
            if (!match) continue;

            const name = match[1];
            const id = match[2];
            const animated = rawEmoji.startsWith("<a:");
            const url = `https://cdn.discordapp.com/emojis/${id}.${animated ? 'gif' : 'png'}`;

            try {
                await message.guild.emojis.create({ attachment: url, name });
                creeemojis++;
            } catch (error) {
                console.error(`Emoji error ${name}:`, error.message);
                errors.push(`${name}: ${error.message}`);
            }
        }

        if (creeemojis > 0) {
            message.channel.send(`${creeemojis} émoji${creeemojis !== 1 ? 's' : ''} ${await client.lang('emoji.create')}${creeemojis !== 1 ? 's' : ''}`);
        }

        if (errors.length > 0) {
            message.channel.send(`${await client.lang('erreur')}\n\`\`\`${errors.join('\n')}\`\`\``);
        }
    },
};
