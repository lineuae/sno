module.exports = {
    name: 'renew',
    aliases: ['purge'],
    description: {
        fr: "Permet de récréer un salon",
        en: "Allows you to recreate a channel"
    },
    run: async (client, message, args) => {
        const channel = message.mentions.channels.first()
            || message.guild.channels.cache.get(args[0])
            || message.channel;

        try {
            const clone = await channel.clone({ reason: `Channel renew par ${message.author.username}` });
            await channel.delete();
            const msg = await clone.send(`<@${message.author.id}>, Salon renouvelé avec succès.`);
            setTimeout(() => msg.delete().catch(() => {}), 2000);
        } catch (error) {
            console.error(error);
            message.channel.send('Une erreur viens de se produire.').catch(() => {});
        }
    }
};
