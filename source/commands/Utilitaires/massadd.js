module.exports = {
    name: 'massadd',
    description: {
        fr: "Permet d'ajouter un rôle à la totalité du serveur",
        en: "Adds a role to the entire server"
    },
    usage: {
        fr: { "massadd <rôle>": "Permet d'ajouter un rôle à la totalité du serveur" },
        en: { "massadd <rôle>": "Adds a role to the entire server" }
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @returns 
     */
    run: async (client, message, args) => {
        return message.reply({ content: 'Cette commande est désactivée.' })
    }
}
