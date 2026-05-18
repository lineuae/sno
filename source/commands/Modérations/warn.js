const Discord = require('discord.js');

module.exports = {
    name: 'warn',
    description: {
        fr: "Avertit un membre du serveur",
        en: "Warn a server member"
    },
    usage: {
        fr: { "warn <@user/ID> [raison]": "Envoie un avertissement à un membre et l'enregistre dans ses sanctions" },
        en: { "warn <@user/ID> [reason]": "Send a warning to a member and log it in their sanctions" }
    },
    run: async (client, message, args) => {
        let user = message.mentions.users.first();
        if (!user && args[0]) {
            user = await client.users.fetch(args[0]).catch(() => null);
        }
        if (!user) return message.channel.send('> `❌` Usage : `warn @user [raison]`');

        if (user.id === message.author.id) {
            return message.channel.send('> `❌` Tu ne peux pas t\'avertir toi-même.');
        }
        if (user.id === client.user.id) {
            return message.channel.send('> `❌` Je ne peux pas m\'avertir moi-même.');
        }
        if (user.id === message.guild.ownerId) {
            return message.channel.send('> `❌` Impossible d\'avertir le propriétaire du serveur.');
        }

        const owners = await client.db.get('owner') || [];
        if (owners.includes(user.id) || client.config.buyers.includes(user.id)) {
            return message.channel.send('> `❌` Je ne peux pas avertir cette personne.');
        }

        const reason = args.slice(1).join(' ') || 'Aucune raison fournie';

        await client.db.push(`sanctions_${message.guild.id}`, {
            type: 'warn',
            id: Math.floor(Math.random() * 9999),
            user: user.id,
            reason,
            date: new Date(),
            mod: message.author.id
        });

        const sanctions = await client.db.get(`sanctions_${message.guild.id}`) || [];
        const warnCount = sanctions.filter(s => s.user === user.id && s.type === 'warn').length;

        const embed = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setFooter(client.footer)
            .setTitle('Avertissement émis')
            .addFields(
                { name: 'Membre', value: `${user} (\`${user.username}\`)`, inline: true },
                { name: 'Modérateur', value: `${message.author} (\`${message.author.username}\`)`, inline: true },
                { name: 'Raison', value: `\`${reason}\``, inline: false },
                { name: 'Total avertissements', value: `\`${warnCount}\``, inline: true }
            )
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });

        const dmEmbed = new Discord.EmbedBuilder()
            .setColor('#FFA500')
            .setFooter(client.footer)
            .setTitle(`Tu as reçu un avertissement sur ${message.guild.name}`)
            .addFields(
                { name: 'Raison', value: `\`${reason}\`` },
                { name: 'Modérateur', value: `\`${message.author.username}\`` },
                { name: 'Total avertissements', value: `\`${warnCount}\`` }
            )
            .setTimestamp();

        await user.send({ embeds: [dmEmbed] }).catch(() => {});
    }
};
