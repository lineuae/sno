const axios = require('axios');
const config = require("../../../config/config");

// Récupère les informations de l'application/bot via l'API Discord
async function getProfile() {
	const response = await axios.get("https://discord.com/api/v10/applications/@me", {
		headers: {
			Authorization: "Bot " + config.token,
		},
	});
	return response.data;
}

module.exports = {
	getProfile,
};