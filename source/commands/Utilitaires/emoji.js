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
            const emojiss = rawEmoji.match(emojiRegex);

            if (emojiss) {
                const emojiName = emojiss[1];
                const emojiId = emojiss[2];
                const isAnimated = rawEmoji.startsWith("<a:");
                const extension = isAnimated ? "gif" : "png";
                const url = `https://cdn.discordapp.com/emojis/${emojiId}.${extension}?size=4096`;

                try {
                    const response = await fetch(url, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }

                    const buffer = Buffer.from(await response.arrayBuffer());

                    await message.guild.emojis.create({
                        attachment: buffer,
                        name: emojiName,
                        animated: isAnimated
                    });

                    creeemojis++;
                } catch (error) {
                    console.error(`Erreur création emoji "${emojiName}" (ID: ${emojiId}):`, error);
                    errors.push(`${emojiName}: ${error.message}`);
                }
            }
        }

        if (creeemojis > 0) {
            const successMsg = await client.lang('emoji.create');
            message.channel.send(`${creeemojis} émoji${creeemojis !== 1 ? "s" : ""} ${successMsg}${creeemojis !== 1 ? "s" : ""}`);
        }

        if (errors.length > 0) {
            message.channel.send({ content: `${await client.lang('erreur')}\n\`\`\`${errors.join('\n')}\`\`\`` });
        }
    },
};
