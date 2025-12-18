module.exports = async (client, db) => {
    client.guilds.cache.forEach(guild => {
        setTimeout(async () => {
            setInterval(async () => {
                const langue = await db.get(`langue`);
                const check = await db.get(`perms_${guild.id}`);
                if (!langue) {
                    await db.set(`langue`, "fr");
                }

                
                if (!check) {
                    const defaultPermissions = {
                        "perm1": { "role": null, "commands": [] },
                        "perm2": { "role": null, "commands": [] },
                        "perm3": { "role": null, "commands": [] },
                        "perm4": { "role": null, "commands": [] },
                        "perm5": { "role": null, "commands": [] },
                        "perm6": { "role": null, "commands": [] },
                        "perm7": { "role": null, "commands": [] },
                        "perm8": { "role": null, "commands": [] },
                        "perm9": { "role": null, "commands": [] },
                        "public": { "status": true, "commands": [] },
                    };

                    const permissions = await db.get(`perms_${guild.id}`);
                    if (!permissions) {
                        await db.set(`perms_${guild.id}`, defaultPermissions);
                    }

                    console.log('[PERMS] Création des permissions pour ' + guild.name)
                }
            }, 3000);
        }, 3000);
    });
};
