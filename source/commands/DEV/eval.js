module.exports = {
    name: 'eval',
    description: 'Évalue du code JavaScript',
    /**
     * 
     * @param {Snoway} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @returns 
     */
    async run(client, message, args) {
        return message.reply({ content: 'Cette commande est désactivée.' })
    },
};
