const Snoway = require("../../structures/client/index");
const Discord = require("discord.js")
module.exports = {
    name: "userUpdate",
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.User} oldUser 
     * @param {Discord.User} newUser 
     * @returns 
     */
    run: async (client, oldUser, newUser) => {
        if (oldUser.bot) return;
        if (oldUser.username !== newUser.username) {
            console.log(`USERNAME: ${oldUser.username} --> ${newUser.username}`)
        }
        if (oldUser.globalName !== newUser.globalName) {
            console.log(`GLOBALNAME: ${oldUser.globalName} --> ${newUser.globalName}`)
        }
    },
};
