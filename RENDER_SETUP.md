# Configuration sur Render

## Étapes pour déployer le bot sur Render

### 1. Créer un nouveau Web Service sur Render
- Allez sur [render.com](https://render.com)
- Cliquez sur "New +" puis "Web Service"
- Connectez votre dépôt GitHub

### 2. Configuration du service
- **Name**: Choisissez un nom pour votre service
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `node index.js`

### 3. Variables d'environnement
Dans la section "Environment Variables", ajoutez les variables suivantes :

| Key | Value | Obligatoire |
|-----|-------|-------------|
| `DISCORD_TOKEN` | Votre token Discord | ✅ Oui |
| `BOT_ID` | L'ID de votre bot | ✅ Oui |
| `PREFIX` | Le préfixe des commandes (ex: `-`) | ❌ Non (défaut: `-`) |
| `COLOR` | La couleur des embeds (ex: `#808080`) | ❌ Non (défaut: `#808080`) |

**⚠️ Important pour COLOR** : 
- Doit être au format hexadécimal avec le `#` (exemple: `#808080`)
- Si vous ne définissez pas cette variable, la couleur par défaut sera utilisée

### 4. Déploiement
- Cliquez sur "Create Web Service"
- Render va automatiquement déployer votre bot

## Notes importantes
- ⚠️ **Ne commitez JAMAIS le fichier `.env`** - il est déjà dans le `.gitignore`
- Le fichier `.env.example` sert de template pour savoir quelles variables sont nécessaires
- Sur Render, les variables d'environnement sont configurées dans le dashboard, pas dans un fichier `.env`

## Obtenir votre token Discord
1. Allez sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Sélectionnez votre application
3. Allez dans "Bot"
4. Cliquez sur "Reset Token" pour obtenir votre token
5. **Copiez-le immédiatement** - vous ne pourrez plus le voir après

## Support
Pour toute question, rejoignez le serveur Discord : https://discord.gg/line
