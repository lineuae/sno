const defaultPerms = {
    perm1: { role: null, commands: [] },
    perm2: { role: null, commands: [] },
    perm3: { role: null, commands: [] },
    perm4: { role: null, commands: [] },
    perm5: { role: null, commands: [] },
    perm6: { role: null, commands: [] },
    perm7: { role: null, commands: [] },
    perm8: { role: null, commands: [] },
    perm9: { role: null, commands: [] },
    public: { status: true, commands: [] },
};

module.exports = async (client, db) => {
    if (!await db.get('langue')) {
        await db.set('langue', 'fr');
    }

    await Promise.all(
        client.guilds.cache.map(async (guild) => {
            if (!await db.get(`perms_${guild.id}`)) {
                await db.set(`perms_${guild.id}`, defaultPerms);
                console.log(`[PERMS] Permissions créées pour ${guild.name}`);
            }
        })
    );
};
