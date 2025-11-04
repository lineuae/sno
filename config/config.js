require('dotenv').config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  botId: process.env.BOT_ID,
  buyers: ["403174893707067392"],
  prefix: process.env.PREFIX || "-",
  color: process.env.COLOR || "#808080",
};
