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
                const selectedRoles = interaction.values; // Rôles sélectionnés dans le menu
                
                const changes = [];
                
                // Pour chaque rôle sélectionné, on toggle (ajoute si pas présent, retire si présent)
                for (const roleId of selectedRoles) {
                    const role = interaction.guild.roles.cache.get(roleId);
                    if (!role) continue;

                    const hasRole = member.roles.cache.has(roleId);

                    try {
                        if (hasRole) {
                            // Le membre a déjà le rôle, on le retire
                            await member.roles.remove(roleId);
                            changes.push(`❌ ${role.name} retiré`);
                        } else {
                            // Le membre n'a pas le rôle, on l'ajoute
                            await member.roles.add(roleId);
                            changes.push(`✅ ${role.name} ajouté`);
                        }
                    } catch (error) {
                        console.error(`[ROLEMENU] Error toggling role ${roleId}:`, error);
                        changes.push(`⚠️ ${role.name} - Erreur`);
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