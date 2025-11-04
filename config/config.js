require('dotenv').config();

// Fonction pour valider et obtenir la couleur
function getColor() {
  const color = process.env.COLOR;
  // Si la couleur est vide, nulle, ou invalide, utiliser la valeur par défaut
  if (!color || color === "0" || !color.startsWith("#")) {
    return "#808080";
  }
  return color;
}

module.exports = {
  token: process.env.DISCORD_TOKEN,
  botId: process.env.BOT_ID,
  buyers: ["403174893707067392"],
  prefix: process.env.PREFIX || "-",
  color: getColor(),
};
