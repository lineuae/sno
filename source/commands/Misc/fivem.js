const {EmbedBuilder, Message} = require('discord.js');
const Snoway = require('../../structures/client');
module.exports = {
  name: 'fivem',
  description: {
    fr: "Connecte votre serveur FiveM.",
    en: "Connect your FiveM server."
  },
  /**
   * 
   * @param {Snoway} client 
   * @param {Message} message 
   * @param {string[]} args 
   */
  run: async (client, message, args) => {
    return message.reply('Le système FiveM est désactivé sur ce bot.').catch(() => {});
  }
};

async function embed(client) {
  const embed = new EmbedBuilder()
    .setColor(client.config.color)
    .setFooter(client.footer);

  return embed;
}

function check(ip) {
  const words = ip.split(" ");
  for (const word of words) {
    if (word.includes(":")) {
      const [ip, port] = word.split(":");
      return { ip, port };
    }
  }
  return { ip: null, port: null };
}