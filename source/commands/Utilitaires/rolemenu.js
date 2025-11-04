const Snoway = require("../../structures/client")
const Discord = require('discord.js');

module.exports = {
    name: 'rolemenu',
    description: {
        fr: "Permet de créer des menus déroulants pour attribuer des rôles",
        en: "Creates dropdown menus to assign roles"
    },
    usage: {
        fr: {
            "rolemenu": "Affiche tous les rolemenus configurés",
            "rolemenu create": "Crée un nouveau rolemenu",
            "rolemenu delete <messageId>": "Supprime un rolemenu",
            "rolemenu list": "Liste tous les rolemenus"
        },
        en: {
            "rolemenu": "Show all configured rolemenus",
            "rolemenu create": "Create a new rolemenu",
            "rolemenu delete <messageId>": "Delete a rolemenu",
            "rolemenu list": "List all rolemenus"
        }
    },
    /**
     * 
     * @param {Snoway} client 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) {
            return message.channel.send(await client.lang('rolemenu.noperm'));
        }

        const database = await client.db.get(`rolemenu_${message.guild.id}`) || [];

        // Liste tous les rolemenus
        if (!args[0] || args[0] === 'list') {
            if (database.length === 0) {
                return message.channel.send(await client.lang('rolemenu.norolemenu'));
            }

            const embed = new Discord.EmbedBuilder()
                .setTitle(await client.lang('rolemenu.list.title'))
                .setColor(client.config.color)
                .setFooter(client.footer)
                .setDescription(await client.lang('rolemenu.list.description', { count: database.length }));

            for (const menu of database) {
                const channel = client.channels.cache.get(menu.channelId);
                const roleList = menu.roles.map(r => `<@&${r.roleId}>`).join(', ');
                embed.addFields({
                    name: `📋 ${menu.title || 'Sans titre'}`,
                    value: `**Channel:** ${channel ? `<#${channel.id}>` : 'Inconnu'}\n**Message ID:** \`${menu.messageId}\`\n**Rôles:** ${roleList}\n**Description:** ${menu.description || 'Aucune'}`,
                    inline: false
                });
            }

            return message.channel.send({ embeds: [embed] });
        }

        // Créer un nouveau rolemenu
        if (args[0] === 'create') {
            const filter = m => m.author.id === message.author.id;
            const collector = message.channel.createMessageCollector({ filter, time: 300000 });
            let step = 0;
            let menuData = {
                channelId: null,
                title: null,
                description: null,
                roles: []
            };

            message.channel.send(await client.lang('rolemenu.create.step1'));

            collector.on('collect', async (m) => {
                if (m.content.toLowerCase() === 'cancel') {
                    collector.stop('cancelled');
                    return message.channel.send(await client.lang('rolemenu.create.cancelled'));
                }

                // Étape 1: Channel
                if (step === 0) {
                    const channel = m.mentions.channels.first() || message.guild.channels.cache.get(m.content);
                    if (!channel || !channel.isTextBased()) {
                        return message.channel.send(await client.lang('rolemenu.create.invalidchannel'));
                    }
                    menuData.channelId = channel.id;
                    step++;
                    return message.channel.send(await client.lang('rolemenu.create.step2'));
                }

                // Étape 2: Titre
                if (step === 1) {
                    menuData.title = m.content;
                    step++;
                    return message.channel.send(await client.lang('rolemenu.create.step3'));
                }

                // Étape 3: Description
                if (step === 2) {
                    menuData.description = m.content;
                    step++;
                    return message.channel.send(await client.lang('rolemenu.create.step4'));
                }

                // Étape 4: Ajouter des rôles
                if (step === 3) {
                    if (m.content.toLowerCase() === 'done') {
                        if (menuData.roles.length === 0) {
                            return message.channel.send(await client.lang('rolemenu.create.noroles'));
                        }
                        collector.stop('completed');
                        return;
                    }

                    // Format: @role emoji label description
                    const role = m.mentions.roles.first();
                    if (!role) {
                        return message.channel.send(await client.lang('rolemenu.create.invalidrole'));
                    }

                    const parts = m.content.split(' ').filter(p => !p.startsWith('<@&'));
                    const emoji = parts[0] || '🎭';
                    const label = parts.slice(1, -1).join(' ') || role.name;
                    const description = parts[parts.length - 1] || 'Aucune description';

                    menuData.roles.push({
                        roleId: role.id,
                        emoji: emoji,
                        label: label,
                        description: description
                    });

                    return message.channel.send(await client.lang('rolemenu.create.roleadded', { 
                        role: role.name, 
                        count: menuData.roles.length 
                    }));
                }
            });

            collector.on('end', async (collected, reason) => {
                if (reason === 'cancelled') return;
                if (reason === 'time') {
                    return message.channel.send(await client.lang('rolemenu.create.timeout'));
                }

                // Créer le menu déroulant
                const channel = message.guild.channels.cache.get(menuData.channelId);
                if (!channel) {
                    return message.channel.send(await client.lang('rolemenu.create.channelnotfound'));
                }

                const embed = new Discord.EmbedBuilder()
                    .setTitle(menuData.title)
                    .setDescription(menuData.description)
                    .setColor(client.config.color)
                    .setFooter(client.footer);

                const selectMenu = new Discord.StringSelectMenuBuilder()
                    .setCustomId(`rolemenu_${Date.now()}`)
                    .setPlaceholder(await client.lang('rolemenu.placeholder'))
                    .setMinValues(0)
                    .setMaxValues(menuData.roles.length);

                for (const role of menuData.roles) {
                    selectMenu.addOptions({
                        label: role.label,
                        description: role.description,
                        value: role.roleId,
                        emoji: role.emoji
                    });
                }

                const row = new Discord.ActionRowBuilder().addComponents(selectMenu);

                try {
                    const sentMessage = await channel.send({ embeds: [embed], components: [row] });
                    
                    // Sauvegarder dans la base de données
                    menuData.messageId = sentMessage.id;
                    menuData.customId = selectMenu.data.custom_id;
                    database.push(menuData);
                    await client.db.set(`rolemenu_${message.guild.id}`, database);

                    return message.channel.send(await client.lang('rolemenu.create.success', { 
                        channel: `<#${channel.id}>` 
                    }));
                } catch (error) {
                    console.error('[ROLEMENU] Error creating menu:', error);
                    return message.channel.send(await client.lang('erreur'));
                }
            });

            return;
        }

        // Supprimer un rolemenu
        if (args[0] === 'delete') {
            const messageId = args[1];
            if (!messageId) {
                return message.channel.send(await client.lang('rolemenu.delete.nomessageid'));
            }

            const menuIndex = database.findIndex(m => m.messageId === messageId);
            if (menuIndex === -1) {
                return message.channel.send(await client.lang('rolemenu.delete.notfound'));
            }

            const menu = database[menuIndex];
            const channel = message.guild.channels.cache.get(menu.channelId);
            
            if (channel) {
                try {
                    const msg = await channel.messages.fetch(messageId);
                    await msg.delete();
                } catch (error) {
                    console.error('[ROLEMENU] Error deleting message:', error);
                }
            }

            database.splice(menuIndex, 1);
            await client.db.set(`rolemenu_${message.guild.id}`, database);

            return message.channel.send(await client.lang('rolemenu.delete.success'));
        }

        return message.channel.send(await client.lang('rolemenu.invalidargs'));
    }
}