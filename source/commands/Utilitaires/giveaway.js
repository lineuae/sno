module.exports = {
    name: 'giveaway',

    aliases: ["giveaways", "gsart", "gw"],

    description: {
        fr: 'Permet de lancer un giveaway',
        en: "Launch a giveaway"
    },
    run: async (client, message, args) => {
        return message.reply({ content: 'Cette commande est désactivée.' })
    },
};