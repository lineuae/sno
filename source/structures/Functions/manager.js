const axios = require('axios');
const config = require("../../../config/config")
const config_api = require('./config')

async function prevclear(userId) {
    try {
        const response = await axios.post(`${config_api.snoway.panel}/prevname/clear`, {
            userId: userId,
        }, {
            headers: {
                'api-key': config_api.snoway.api
            }
        });
        return response.data;
    } catch (e) {
        console.error('Erreur prevclear:', e.message);
        throw e;
    }
}

async function prevget(userId) {
    try {
        const response = await axios.post(`${config_api.snoway.panel}/prevname/get`, {
            userId: userId,
        }, {
            headers: {
                'api-key': config_api.snoway.api
            }
        });
        return response.data;
    } catch (e) {
        console.error('Erreur prevget:', e.message);
        throw e;
    }
}

async function prevadd(userId, prevname) {
    try {
        const response = await axios.post(`${config_api.snoway.panel}/prevname/add`, {
            prevname: prevname,
            userId: userId,
        }, {
            headers: {
                'api-key': config_api.snoway.api
            }
        });
        return response.data;
    } catch (e) {
        console.error('Erreur prevadd:', e.message);
        throw e;
    }
}

async function prevcount() {
    try {
        const response = await axios.post(`${config_api.snoway.panel}/prevname/count`, null, {
            headers: {
                'api-key': config_api.snoway.api
            }
        });
        return response.data;
    } catch (e) {
        console.error('Erreur prevcount:', e.message);
        throw e;
    }
}

async function botget(userId) {
    try {
        const response = await axios.post(`${config_api.manager.panel}/bots/get`, {
            ownerId: userId,
        }, {
            headers: {
                'api-key': config_api.manager.key
            }
        });
        return response.data;
    } catch (e) {
        console.error('Erreur botget:', e.message);
        throw e;
    }
}

async function owneradd(botId, userId) {
    try {
        const response = await axios.post(`${config_api.manager.panel}/bots/owner/add`, {
            BotId: botId,
            owner: userId
        }, {
            headers: {
                'api-key': config_api.manager.key
            }
        });
        return response.data;
    } catch (e) {
        console.error('Erreur owneradd:', e.message);
        throw e;
    }
}

async function ownerdel(botId, userId) {
    try {
        const response = await axios.post(`${config_api.manager.panel}/bots/owner/remove`, {
            BotId: botId,
            owner: userId
        }, {
            headers: {
                'api-key': config_api.manager.key
            }
        });
        return response.data;
    } catch (e) {
        console.error('Erreur ownerdel:', e.message);
        throw e;
    }
}

async function ownerclear(botId) {
    try {
        const response = await axios.post(`${config_api.manager.panel}/bots/owner/clear`, {
            BotId: botId,
        }, {
            headers: {
                'api-key': config_api.manager.key
            }
        });
        return response.data;
    } catch (e) {
        console.error('Erreur ownerclear:', e.message);
        throw e;
    }
}

module.exports = {
    prevclear,
    prevget,
    prevadd,
    botget,
    owneradd,
    ownerdel,
    ownerclear,
    prevcount
}