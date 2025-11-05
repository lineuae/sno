const { Client, Collection, Routes } = require("discord.js");
const fs = require("fs");
const version = require('../../../version')
const MongoDB = require('../Database/mongodb');
const { REST } = require('@discordjs/rest');
const { readdirSync } = require('fs');
const { Player } = require('discord-player');
const { DefaultWebSocketManagerOptions: { identifyProperties } } = require("@discordjs/ws");
identifyProperties.browser = "Discord Android"


module.exports = class Snoway extends Client {
  constructor(
    options = {
      intents: [3276799],
      partials: [
        1, 2, 5, 3,
        4, 6, 0
      ],
    }
  ) {
    super(options);
    this.setMaxListeners(0);

    this.commands = new Collection();
    this.aliases = new Collection();
    this.slashCommands = new Collection()
    this.context = new Collection()
    this.invites = new Map();
    this.vanityURL = new Map()
    this.SnipeMsg = new Map();
    this.SnipeMention = new Map();
    this.SnipeEdit = new Map();
    this.player = Player.singleton(this);
    this.player.extractors.loadDefault();

    this.functions = require('../Functions/index')
    this.utils = require('../Utils/index')
    this.config = require('../../../config/config');

    this.support = 'https://discord.gg/line'
    this.footer = {text: "emirati V3 by line and node"}
    this.dev = ["403174893707067392", "888538191701893150"],
    this.version = version;
    this.db = new MongoDB();
    this.api = this.functions.api

    this.CommandLoad();
    this.EventLoad();
    this.connect()
    this.slashEvent()

    this.lang = async function (key, guildId) {
      return new Promise(async (resolve, reject) => {
        const guildConfig = await this.db.get(`langue`);
        const langCode = guildConfig || "fr";
        const langFilePath = `../../../langue/${langCode}.json`;
        const keys = key.split(".");
        let text;

        let errorMessage;
        switch (langCode) {
          case "en":
            errorMessage = "No translation for this text";
            break;
          default:
            errorMessage = "Aucune traduction pour ce texte";
        }

        try {
          text = require(langFilePath);
        } catch (error) {

          console.error(
            `Impossible de charger le fichier de langue pour la langue "${langCode}" : ${error.message}`
          );

          return resolve(errorMessage);
        }

        for (const key of keys) {
          text = text[key];
          if (!text) {
            console.error(
              `Impossible de trouver une traduction pour "${key}", langue : ${langCode}`
            );
            return resolve(errorMessage);
          }
        }

        return resolve(text);
      });
    }
  }
  async connect() {
    try {
      // Connexion à MongoDB
      const mongoUri = process.env.MONGODB_URI;
      if (mongoUri) {
        await this.db.connect(mongoUri);
      } else {
        console.warn('[WARNING] ⚠️ MONGODB_URI non défini dans .env - Les données ne seront pas persistantes!');
      }
    } catch (error) {
      console.error('[ERROR] Erreur lors de la connexion à MongoDB:', error);
      console.warn('[WARNING] ⚠️ Le bot continuera sans base de données persistante');
    }

    return super.login(this.config.token).catch(async (err) => {
      console.log(err)
    }).then(() => {
      this.database = new (require("../Database/index"))(this, this.db);
    })
  };


  async slashEvent() {
    const data = [];
    readdirSync("./source/slashCommands/").forEach(async (dir) => {
      let slashCommandFile = readdirSync(`./source/slashCommands/${dir}/`).filter((files) => files.endsWith(".js"));

      for (const file of slashCommandFile) {
        let slashCommand = require(`../../slashCommands/${dir}/${file}`);

        this.slashCommands.set(slashCommand.name, slashCommand);

        const commandType = slashCommand.type ? parseInt(slashCommand.type) : 1;
        
        // Les commandes context (type 2 et 3) ne doivent PAS avoir de description
        const commandData = {
          name: slashCommand.name,
          type: commandType,
        };

        // Ajouter description et options UNIQUEMENT pour les slash commands (type 1)
        if (commandType === 1) {
          commandData.description = slashCommand.description || "No description";
          if (slashCommand.description_localizations) {
            commandData.description_localizations = slashCommand.description_localizations;
          }
          if (slashCommand.options) {
            commandData.options = slashCommand.options;
          }
        }

        data.push(commandData);
      }
    });

    const rest = new REST({ version: '10' }).setToken(this.config.token);
    try {
      await rest.put(Routes.applicationCommands(this.config.botId), { body: data });
      console.log('[SLASH] Commandes slash enregistrées avec succès');
    } catch (error) {
      console.error('[SLASH] Erreur lors de l\'enregistrement des commandes:', error);
    }
  }




  CommandLoad() {
    const subFolders = fs.readdirSync("./source/commands");
    let finale = new Collection();
    for (const category of subFolders) {
      const commandsFiles = fs
        .readdirSync(`./source/commands/${category}`)
        .filter((file) => file.endsWith(".js"));

      for (const commandFile of commandsFiles) {
        const command = require(`../../commands/${category}/${commandFile}`);
        command.category = category;
        command.commandFile = commandFile;

        console.log(`Commande chargée : ${command.name}`);
        if (!finale.has(command.name)) {
          finale.set(command.name, command);
        }

        if (command.aliases && command.aliases.length > 0) {
          command.aliases.forEach((alias) => {
            if (!finale.has(alias)) {
              finale.set(alias, command);
            }
          });
        }
      }
    }
    this.commands = finale;
  }


  EventLoad() {
    const subFolders = fs.readdirSync('./source/events');

    for (const category of subFolders) {
      const eventsFiles = fs
        .readdirSync(`./source/events/${category}`)
        .filter((file) => file.endsWith('.js'));

      for (const eventFile of eventsFiles) {
        const event = require(`../../events/${category}/${eventFile}`);
        const eventHandler = (...args) => event.run(this, ...args);
        this.on(event.name, eventHandler);
        if (category === 'anticrash') {
          process.on(event.name, eventHandler);
        }

        console.log(`EVENT chargé : ${eventFile}`);
      }
    }
  }

};
