const Discord = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.GuildMember} member 
     */
    run: async (client, member) => {
        if (!member) return;

        const invitesData = client.invites;
        const guild = member.guild;
        const guildInvites = invitesData.get(guild.id);
        const currentInvites = await guild.invites.fetch();

        if (!guildInvites) return;

        guildInvites.forEach((inviterInvites, inviterId) => {
            inviterInvites.forEach(async inviteData => {
                const currentInvite = currentInvites.find(inv => inv.code === inviteData.code);
                if (currentInvite) {
                    const usesBefore = inviteData.uses;
                    const usesAfter = currentInvite.uses;
                    const difference = usesAfter - usesBefore;
                    const user = client.users.cache.get(inviterId)
                    if (difference > 0) {
                        console.log(`Invité par ${inviteData.code} par ${user?.username ?? inviterId}`);
                        let db = await client.db.get(`invite_user_${member.guild.id}`) || [];
                        let result = db.find(entry => entry.id === inviterId);

                        if (!result) {
                            result = {
                                id: inviterId,
                                total: 0,
                                valid: 0,
                                fake: 0,
                                left: 0,
                                bonus: 0
                            };
                            db.push(result);
                        }

                        result.total++;
                        result.valid++;
                        await client.db.set(`invite_user_${member.guild.id}`, db);

                    }
                }
            });
        });

        invitesData.set(guild.id, guildInvites);
    }
};
