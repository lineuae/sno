const Discord = require("discord.js");
const Snoway = require("../../structures/client/index");

module.exports = {
    name: "clientReady",
    /**
     *
     * @param {Snoway} client
     */
    run: async (client) => {
       setInterval(async () => {
            const db = await client.db.get(`status`)
            const presenceOptions = {
                status: db?.status || 0,
                activities: [{
                    name: db?.name || "~",
                    type: db?.type || 4,
                    url: "https://twitch.tv/line"

                }]
            };
            client.user.setPresence(presenceOptions)

        }, 5000)
    }
};
