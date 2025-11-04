const Discord = require('discord.js');
const Snoway = require('../../structures/client/index.js');

module.exports = {
    name: 'interactionCreate',
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Interaction} interaction 
     * @returns 
     */
    run: async (client, interaction) => {
        // Gestion des commandes slash
        if (interaction.type === Discord.InteractionType.ApplicationCommand) {
            const SlashCommands = client.slashCommands.get(interaction.commandName);
            if (!SlashCommands) {
                console.log(`[INTERACTION] Commande non trouvée: ${interaction.commandName} (type: ${interaction.commandType})`);
                return;
            }
            try {
                await SlashCommands.run(client, interaction);
            } catch (error) {
                console.error(`[INTERACTION ERROR] Commande: ${interaction.commandName}`, error);
                // Tenter de répondre à l'utilisateur en cas d'erreur
                const errorMessage = { content: "Une erreur est survenue lors de l'exécution de cette commande.", ephemeral: true };
                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply(errorMessage).catch(() => {});
                } else {
                    await interaction.reply(errorMessage).catch(() => {});
                }
            }
        }

        // Gestion des select menus (rolemenu)
        if (interaction.isStringSelectMenu() && interaction.customId.startsWith('rolemenu_')) {
            try {
                const database = await client.db.get(`rolemenu_${interaction.guild.id}`) || [];
                const menu = database.find(m => m.customId === interaction.customId);

                if (!menu) {
                    return interaction.reply({ 
                        content: await client.lang('rolemenu.interaction.notfound'), 
                        ephemeral: true 
                    });
                }

                const member = interaction.member;
                const selectedRoles = interaction.values;
                const menuRoles = menu.roles.map(r => r.roleId);

                // Récupérer les rôles actuels du membre qui font partie de ce menu
                const currentMenuRoles = member.roles.cache.filter(r => menuRoles.includes(r.id));
                
                const rolesToAdd = [];
                const rolesToRemove = [];

                // Déterminer quels rôles ajouter et retirer
                for (const roleId of menuRoles) {
                    const hasRole = currentMenuRoles.has(roleId);
                    const isSelected = selectedRoles.includes(roleId);

                    if (isSelected && !hasRole) {
                        rolesToAdd.push(roleId);
                    } else if (!isSelected && hasRole) {
                        rolesToRemove.push(roleId);
                    }
                }

                // Appliquer les changements
                const changes = [];
                
                for (const roleId of rolesToAdd) {
                    try {
                        await member.roles.add(roleId);
                        const role = interaction.guild.roles.cache.get(roleId);
                        changes.push(`✅ ${role.name}`);
                    } catch (error) {
                        console.error(`[ROLEMENU] Error adding role ${roleId}:`, error);
                    }
                }

                for (const roleId of rolesToRemove) {
                    try {
                        await member.roles.remove(roleId);
                        const role = interaction.guild.roles.cache.get(roleId);
                        changes.push(`❌ ${role.name}`);
                    } catch (error) {
                        console.error(`[ROLEMENU] Error removing role ${roleId}:`, error);
                    }
                }

                if (changes.length === 0) {
                    return interaction.reply({ 
                        content: await client.lang('rolemenu.interaction.nochanges'), 
                        ephemeral: true 
                    });
                }

                return interaction.reply({ 
                    content: await client.lang('rolemenu.interaction.success') + '\n' + changes.join('\n'), 
                    ephemeral: true 
                });

            } catch (error) {
                console.error('[ROLEMENU] Error handling interaction:', error);
                return interaction.reply({ 
                    content: await client.lang('erreur'), 
                    ephemeral: true 
                }).catch(() => {});
            }
        }
    }
}