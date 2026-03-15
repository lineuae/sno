module.exports = {
    name: 'massremove',
    description: {
        fr: "Permet de supprimer un rôle à la totalité du serveur",
        en: "Removes a role from the entire server"
    },
    usage: {
        fr: { "massremove <rôle>": "Permet de supprimer un rôle à la totalité du serveur" },
        en: { "massremove <rôle>": "Removes a role from the entire server" }
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
