const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');
module.exports = {
    name: "owner",
    description: {
        fr: "Ajoute/Retire un owner du bot",
        en: "Add/Remove an owner from the bot"
    },
    usage: {
        fr: {
            "owner clear": "Supprime tous les owners",
            "owner <mention/id>": "Ajoute/Retire un owner du bot",
        }, en: {
            "owner clear": "Remove all owners",
            "owner <mention/id>": "Add/Remove an owner from the bot",
        }
    },
    /**
     * @param {Snoway} client
     * @param {Discord.Message} message
     * @param {Array} args
     */
    run: async (client, message, args) => {
        const owners = await client.db.get('owner') || [];

        // Autoriser les buyers, les devs et les owners existants à gérer la liste des owners
        if (!client.config.buyers.includes(message.author.id) &&
            !client.dev.includes(message.author.id) &&
            !owners.includes(message.author.id)) return;

        if (args[0] === 'clear') {
            try {
                await client.db.set('owner', []);
                owners.length = 0;
                message.channel.send(await client.lang('owner.clear'));
            } catch (error) {
                console.error('Erreur clear owners:', error);
                message.channel.send(await client.lang('erreur'));
            }
            return;
        }

        if (args.length < 1) {
            const ownerusernames = await Promise.all(owners.map(async (ownerId, index) => {
                try {
                    const user = await client.users.fetch(ownerId);
                    return `${index + 1} • ${user.username} (ID: ${user.id})`;
                } catch (error) {
                    console.error(`Erreur : ${error.message}`);
                    return await client.lang('owner.introuvable');
                }
            }));

            const ownersList = ownerusernames.length > 0 ? ownerusernames.join('\n') : await client.lang('owner.nowoner');

            const embed = new Discord.EmbedBuilder()
                .setAuthor({ name: await client.lang('owner.embed.title') + ' (' + owners.length + ')', iconURL: message.author.avatarURL() })
                .setColor(client.config.color)
                .setDescription(`\`\`\`js\n${ownersList}\`\`\``)
                .setFooter(client.footer);

            return message.channel.send({ embeds: [embed] });
        }

        const mention = message.mentions.members.first()
        const member = mention ? mention.user : null || await client.users.fetch(args[0]).catch(() => null);
        if (!member) {
            return message.channel.send(await client.lang('owner.nouser'));
        }

        const ownerId = member.id
        const ownerIndex = owners.indexOf(ownerId);

        try {
            if (ownerIndex !== -1) {
                // Retirer un owner existant
                owners.splice(ownerIndex, 1);
                await client.db.set('owner', owners);
                return message.channel.send(`\`${member.username}\` ` + await client.lang('owner.deleteowner'));
            } else {
                // Ajouter un nouveau owner
                if (client.config.buyers.includes(ownerId)) {
                    return message.reply(await client.lang('owner.buyerowner'))
                }
                owners.push(ownerId);
                await client.db.set('owner', owners);
                return message.channel.send(`\`${member.username}\` ` + await client.lang('owner.set'));
            }
        } catch (error) {
            console.error('Erreur mise à jour owners:', error);
            return message.channel.send(await client.lang('erreur'));
        }

    }
};