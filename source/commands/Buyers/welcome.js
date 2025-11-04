const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: "welcome",
    description: {
        fr: "Configure le système de bienvenue",
        en: "Configure the welcome system"
    },
    usage: {
        fr: {
            "welcome": "Affiche la configuration actuelle",
            "welcome channel <#channel/id>": "Définit le salon de bienvenue",
            "welcome message <message>": "Définit le message de bienvenue",
            "welcome reset": "Réinitialise la configuration",
            "welcome test": "Teste le message de bienvenue"
        },
        en: {
            "welcome": "Show current configuration",
            "welcome channel <#channel/id>": "Set the welcome channel",
            "welcome message <message>": "Set the welcome message",
            "welcome reset": "Reset the configuration",
            "welcome test": "Test the welcome message"
        }
    },
    /**
     * @param {Snoway} client
     * @param {Discord.Message} message
     * @param {Array} args
     */
    run: async (client, message, args) => {
        if (!client.config.buyers.includes(message.author.id)) return;

        const guildId = message.guild.id;
        const welcomeConfig = await client.db.get(`welcome_${guildId}`) || {
            enabled: false,
            channelId: null,
            message: "{user} vient de rejoindre le serveur ! Bienvenue 🎉"
        };

        // Afficher la configuration actuelle
        if (!args[0]) {
            const channel = welcomeConfig.channelId ? `<#${welcomeConfig.channelId}>` : await client.lang('welcome.nochannel');
            const status = welcomeConfig.enabled ? '✅ Activé' : '❌ Désactivé';
            
            const embed = new Discord.EmbedBuilder()
                .setAuthor({ name: await client.lang('welcome.embed.title'), iconURL: message.guild.iconURL() })
                .setColor(client.config.color)
                .addFields(
                    { name: await client.lang('welcome.embed.status'), value: status, inline: true },
                    { name: await client.lang('welcome.embed.channel'), value: channel, inline: true },
                    { name: await client.lang('welcome.embed.message'), value: `\`\`\`${welcomeConfig.message}\`\`\``, inline: false }
                )
                .setDescription(await client.lang('welcome.embed.variables'))
                .setFooter(client.footer);

            return message.channel.send({ embeds: [embed] });
        }

        // Définir le salon
        if (args[0] === 'channel') {
            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
            
            if (!channel) {
                return message.channel.send(await client.lang('welcome.nochannel'));
            }

            if (!channel.isTextBased()) {
                return message.channel.send(await client.lang('welcome.nottext'));
            }

            welcomeConfig.channelId = channel.id;
            welcomeConfig.enabled = true;
            await client.db.set(`welcome_${guildId}`, welcomeConfig);

            return message.channel.send(await client.lang('welcome.channelset', { channel: `<#${channel.id}>` }));
        }

        // Définir le message
        if (args[0] === 'message') {
            if (args.length < 2) {
                return message.channel.send(await client.lang('welcome.nomessage'));
            }

            const newMessage = args.slice(1).join(' ');
            welcomeConfig.message = newMessage;
            await client.db.set(`welcome_${guildId}`, welcomeConfig);

            return message.channel.send(await client.lang('welcome.messageset'));
        }

        // Réinitialiser
        if (args[0] === 'reset') {
            await client.db.delete(`welcome_${guildId}`);
            return message.channel.send(await client.lang('welcome.reset'));
        }

        // Tester
        if (args[0] === 'test') {
            if (!welcomeConfig.channelId) {
                return message.channel.send(await client.lang('welcome.noconfig'));
            }

            const channel = message.guild.channels.cache.get(welcomeConfig.channelId);
            if (!channel) {
                return message.channel.send(await client.lang('welcome.channelnotfound'));
            }

            const testMessage = welcomeConfig.message
                .replace(/{user}/g, `<@${message.author.id}>`)
                .replace(/{username}/g, message.author.username)
                .replace(/{server}/g, message.guild.name)
                .replace(/{membercount}/g, message.guild.memberCount.toString());

            const embed = new Discord.EmbedBuilder()
                .setColor(client.config.color)
                .setDescription(testMessage)
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `Membre #${message.guild.memberCount}` })
                .setTimestamp();

            try {
                await channel.send({ embeds: [embed] });
                return message.channel.send(await client.lang('welcome.testsent'));
            } catch (error) {
                console.error(error);
                return message.channel.send(await client.lang('erreur'));
            }
        }

        return message.channel.send(await client.lang('welcome.invalidargs'));
    }
};
