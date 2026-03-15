module.exports = {
  name: 'pclean',
  description: {
    fr: 'Nettoie les permissions des commandes supprimées.',
    en: 'Cleans permissions for deleted commands.'
  },
  usage: {
    fr: { 'pclean': 'Supprime de la DB les permissions pointant vers des commandes supprimées.' },
    en: { 'pclean': 'Removes permissions in DB that point to deleted commands.' }
  },
  run: async (client, message) => {
    try {
      const key = `perms_${message.guild.id}`;
      const db = (await client.db.get(key)) || {};

      const existingCommandNames = new Set();
      for (const [name, cmd] of client.commands.entries()) {
        if (cmd && typeof cmd.name === 'string') existingCommandNames.add(cmd.name);
      }

      let removed = 0;

      for (const permKey of Object.keys(db)) {
        const permVal = db[permKey];
        if (!permVal || typeof permVal !== 'object') continue;

        if (Array.isArray(permVal.commands)) {
          const before = permVal.commands.length;
          permVal.commands = permVal.commands.filter((c) => existingCommandNames.has(c));
          removed += before - permVal.commands.length;
        }
      }

      await client.db.set(key, db);
      return message.reply({ content: `Permissions nettoyées: ${removed} commande${removed === 1 ? '' : 's'} supprimée${removed === 1 ? '' : 's'}.` });
    } catch (e) {
      console.log(e);
      return message.reply({ content: 'Une erreur est survenue.' });
    }
  }
};
