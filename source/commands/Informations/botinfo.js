const Discord = require('discord.js');
const os = require('os');

module.exports = {
    name: 'botinfo',
    description: {
        fr: 'Affiche les informations du bot !',
        en: 'Display bot information!'
    },
    run: async (client, message) => {
        const dev = await Promise.all(
            client.dev.map(id => client.users.fetch(id).then(u => u.username).catch(() => id))
        );
        const langue = await client.db.get('langue');
        const uptime = formatUptime(os.uptime(), langue);
        const uptimebot = formatUptime(client.uptime / 1000, langue);
        const totalMemory = formatBytes(os.totalmem());
        const usedMemory = formatBytes(os.totalmem() - os.freemem());

        const embed = new Discord.EmbedBuilder()
            .setTitle('Mes statistiques')
            .setColor(client.config.color)
            .setFooter({ text: "Botinfo inspiré de celui de Caredas" })
            .addFields(
                {
                    name: "Statistique du bot",
                    value:
                        `\`\`\`ANSI\n` +
                        `[1;31mDéveloppeur:[0m [107;49m${dev.join(', ')}[0m\n` +
                        `[1;31mCommandes:[0m [107;49m${client.commands.size}[0m\n` +
                        `[1;31mServeurs:[0m [107;49m${client.guilds.cache.size}[0m\n` +
                        `[1;31mChannels:[0m [107;49m${client.channels.cache.size}[0m\n` +
                        `[1;31mMembres:[0m [107;49m${client.users.cache.size}[0m\n` +
                        `[1;31mNodeJs:[0m [107;49m${process.version}[0m\n` +
                        `[1;31mDiscordJs:[0m [107;49mv${Discord.version}[0m\n` +
                        `[1;31mUptime:[0m [107;49m${uptimebot}[0m\n` +
                        `\`\`\``
                },
                {
                    name: "Statistique du VPS",
                    value:
                        `\`\`\`ANSI\n` +
                        `[1;31mUptime:[0m [107;49m${uptime}[0m\n` +
                        `[1;31mCPU Cores:[0m [107;49m${os.cpus().length}[0m\n` +
                        `[1;31mRAM:[0m [107;49m${usedMemory}/${totalMemory}[0m\n` +
                        `\`\`\``
                }
            );

        message.reply({ embeds: [embed] });
    },
};

function formatUptime(uptime, lang) {
    const units = lang === 'fr'
        ? ['jour', 'heure', 'minute', 'seconde']
        : ['day', 'hour', 'minute', 'second'];

    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime / 3600) % 24);
    const minutes = Math.floor((uptime / 60) % 60);
    const seconds = Math.floor(uptime % 60);

    return [
        [days, units[0]],
        [hours, units[1]],
        [minutes, units[2]],
        [seconds, units[3]],
    ]
        .filter(([n]) => n > 0)
        .map(([n, u]) => `${n} ${u}${n > 1 ? 's' : ''}`)
        .join(', ');
}

function formatBytes(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log2(bytes) / 10);
    return `${(bytes / Math.pow(2, 10 * i)).toFixed(2)} ${sizes[i]}`;
}
