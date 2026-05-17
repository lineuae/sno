const { Client, Collection, GatewayIntentBits, Partials, Routes } = require("discord.js");
const fs = require("fs");
const version = require('../../../version');
const MongoDB = require('../Database/mongodb');
const { REST } = require('@discordjs/rest');

module.exports = class Snoway extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
      ],
      partials: [
        Partials.Channel,
        Partials.Message,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.User,
      ],
    });

    this.commands = new Collection();
    this.slashCommands = new Collection();
    this.context = new Collection();
    this.invites = new Map();
    this.vanityURL = new Map();
    this.SnipeMsg = new Map();
    this.SnipeMention = new Map();
    this.SnipeEdit = new Map();

    this.functions = require('../Functions/index');
    this.utils = require('../Utils/index');
    this.config = require('../../../config/config');

    this.support = 'https://discord.gg/line';
    this.footer = { text: "Noria V4 by line and node" };
    this.dev = ["403174893707067392", "888538191701893150"];
    this.version = version;
    this.db = new MongoDB();

    this.CommandLoad();
    this.EventLoad();
    this.connect();
    this.slashEvent();

    this.lang = async (key) => {
      const langCode = (await this.db.get('langue')) || 'fr';
      const fallback = langCode === 'en'
        ? 'No translation for this text. Please contact the developers!'
        : 'Aucune traduction pour ce texte. Merci de contacter les développeurs !';

      let langContent;
      try {
        langContent = require(`../../../langue/${langCode}.json`);
      } catch {
        return fallback;
      }

      let text = langContent;
      for (const subKey of key.split('.')) {
        text = text?.[subKey];
        if (text === undefined || text === null) {
          console.error(`[LANG] Traduction manquante: "${key}" (${langCode})`);
          return langContent?.notard || fallback;
        }
      }
      return text;
    };
  }

  async connect() {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri) {
      try {
        await this.db.connect(mongoUri);
      } catch (error) {
        console.error('[ERROR] Erreur MongoDB:', error);
        console.warn('[WARNING] Le bot continuera sans base de données persistante');
      }
    } else {
      console.warn('[WARNING] MONGODB_URI non défini - Les données ne seront pas persistantes!');
    }

    await super.login(this.config.token).catch(console.error);
    this.database = new (require('../Database/index'))(this, this.db);
  }

  async slashEvent() {
    const data = [];
    for (const dir of fs.readdirSync('./source/slashCommands/')) {
      const files = fs.readdirSync(`./source/slashCommands/${dir}/`).filter(f => f.endsWith('.js'));
      for (const file of files) {
        const cmd = require(`../../slashCommands/${dir}/${file}`);
        this.slashCommands.set(cmd.name, cmd);

        const type = cmd.type ? parseInt(cmd.type) : 1;
        const entry = { name: cmd.name, type };
        if (type === 1) {
          entry.description = cmd.description || 'No description';
          if (cmd.description_localizations) entry.description_localizations = cmd.description_localizations;
          if (cmd.options) entry.options = cmd.options;
        }
        data.push(entry);
      }
    }

    const rest = new REST({ version: '10' }).setToken(this.config.token);
    try {
      await rest.put(Routes.applicationCommands(this.config.botId), { body: data });
      console.log('[SLASH] Commandes slash enregistrées');
    } catch (error) {
      console.error('[SLASH] Erreur:', error);
    }
  }

  CommandLoad() {
    for (const category of fs.readdirSync('./source/commands')) {
      let files;
      try {
        files = fs.readdirSync(`./source/commands/${category}`).filter(f => f.endsWith('.js'));
      } catch {
        continue;
      }
      for (const file of files) {
        let cmd;
        try {
          cmd = require(`../../commands/${category}/${file}`);
        } catch (e) {
          console.error(`[CMD] Erreur chargement ${file}:`, e.message);
          continue;
        }
        cmd.category = category;
        if (!this.commands.has(cmd.name)) {
          this.commands.set(cmd.name, cmd);
        }
        for (const alias of (cmd.aliases || [])) {
          if (!this.commands.has(alias)) this.commands.set(alias, cmd);
        }
      }
    }
    console.log(`[CMD] ${this.commands.size} commandes/alias chargés`);
  }

  EventLoad() {
    for (const category of fs.readdirSync('./source/events')) {
      const files = fs.readdirSync(`./source/events/${category}`).filter(f => f.endsWith('.js'));
      for (const file of files) {
        const event = require(`../../events/${category}/${file}`);
        const handler = (...args) => event.run(this, ...args);
        if (category === 'anticrash') {
          process.on(event.name, handler);
        } else {
          this.on(event.name, handler);
        }
      }
    }
  }
};
