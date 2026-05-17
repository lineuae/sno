const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'pp',
    description: {
        fr: "Affiche la photo de profil d'un utilisateur",
        en: "Displays a user's profile picture"
    },
    usage: {
        fr: {
            "pp [@utilisateur|id]": "Affiche la photo de profil de l'utilisateur mentionné ou par son ID",
            "pp": "Affiche votre propre photo de profil"
        },
        en: {
            "pp [@user|id]": "Shows the mentioned user's profile picture or by ID",
            "pp": "Shows your own profile picture"
        }
    },
    run: async (client, message, args) => {
        let user;
        
        if (args.length > 0) {
            const mention = message.mentions.users.first();
            if (mention) {
                user = mention;
            } else {
                const id = args[0];
                user = message.guild.members.cache.get(id)?.user || client.users.cache.get(id);
                if (!user) {
                    try {
                        user = await client.users.fetch(id);
                    } catch {
                        return message.reply('❌ Utilisateur introuvable.');
                    }
                }
            }
        } else {
            user = message.author;
        }

        if (!user) {
            return message.reply('❌ Utilisateur introuvable.');
        }

        const avatarURL = user.displayAvatarURL({ extension: 'png', size: 4096, forceStatic: false });
        const avatarURLHighQuality = user.displayAvatarURL({ extension: 'png', size: 4096 });

        const embed = new EmbedBuilder()
            .setTitle(`Photo de profil de ${user.username}`)
            .setColor(client.config.color)
            .setImage(avatarURL)
            .setFooter({ text: `Demandé par ${message.author.username}`, iconURL: message.author.displayAvatarURL({ extension: 'png', size: 128 }) });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Voir en HD')
                    .setStyle(ButtonStyle.Link)
                    .setURL(avatarURLHighQuality)
            );

        message.channel.send({ embeds: [embed], components: [row] });
    }
};
