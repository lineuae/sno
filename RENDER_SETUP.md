# Configuration sur Render

## Étapes pour déployer le bot sur Render

### 1. Créer un nouveau Web Service sur Render
- Allez sur [render.com](https://render.com)
- Cliquez sur "New +" puis "Web Service"
- Connectez votre dépôt GitHub

### 2. Configuration du service
- **Name**: Choisissez un nom pour votre service
- **Environment**: Node
- **Build Command**: `npm install --ignore-scripts`
- **Start Command**: `node index.js`

### 3. Variables d'environnement
Dans la section "Environment Variables", ajoutez les variables suivantes :

| Key | Value | Obligatoire | Description |
|-----|-------|-------------|-------------|
| `DISCORD_TOKEN` | Votre token Discord | ✅ Oui | Token du bot Discord |
| `BOT_ID` | L'ID de votre bot | ✅ Oui | ID de l'application Discord |
| `MONGODB_URI` | URI de connexion MongoDB | ✅ Oui | Pour la persistance des données |
| `PREFIX` | Le préfixe des commandes (ex: `-`) | ❌ Non | Défaut: `-` |
| `COLOR` | La couleur des embeds (ex: `#808080`) | ❌ Non | Défaut: `#808080` |

**⚠️ Important** : 
- **MONGODB_URI est OBLIGATOIRE** pour que les données persistent (rolemenus, welcome, configs, etc.)
- Format MongoDB : `mongodb+srv://username:password@cluster.mongodb.net/botdiscord?retryWrites=true&w=majority`
- COLOR doit être au format hexadécimal avec le `#` (exemple: `#808080`)

### 4. Configuration MongoDB (OBLIGATOIRE)

#### Créer un cluster MongoDB Atlas (gratuit)
1. Allez sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un compte gratuit
3. Créez un cluster (plan M0 gratuit)
4. Créez un utilisateur de base de données :
   - Database Access > Add New Database User
   - Choisissez un nom d'utilisateur et mot de passe **SÉCURISÉ**
   - Permissions: "Read and write to any database"
5. Autorisez l'accès réseau (IMPORTANT) :
   - Allez dans **Network Access** (menu de gauche)
   - Cliquez sur **"Add IP Address"**
   - Cliquez sur **"Allow Access from Anywhere"**
   - Confirmez avec **"0.0.0.0/0"** (permet toutes les IPs)
   - Cliquez sur **"Confirm"**
   - ⚠️ Cette étape est OBLIGATOIRE pour Render car l'IP change à chaque redémarrage
6. Obtenez l'URI de connexion :
   - Database > Connect > Connect your application
   - Copiez l'URI et remplacez `<username>` et `<password>`
   - Ajoutez `/botdiscord` après `.net/` pour nommer votre base

**Exemple d'URI :**
```
mongodb+srv://monbot:MotDePasse123@cluster0.ab1cd.mongodb.net/botdiscord?retryWrites=true&w=majority
```

### 5. Déploiement
- Cliquez sur "Create Web Service"
- Render va automatiquement déployer votre bot
- Vérifiez les logs pour confirmer la connexion MongoDB :
  ```
  [MongoDB] ✅ Connecté avec succès à MongoDB
  ```

## ⚠️ Sans MongoDB

Si vous ne configurez pas MongoDB :
- ❌ Toutes les données seront perdues à chaque redémarrage
- ❌ Rolemenus supprimés
- ❌ Système de bienvenue réinitialisé
- ❌ Configurations de serveur perdues
- ❌ Permissions effacées

## Notes importantes
- ⚠️ **Ne commitez JAMAIS le fichier `.env`** - il est déjà dans le `.gitignore`
- Le fichier `.env.example` sert de template pour savoir quelles variables sont nécessaires
- Sur Render, les variables d'environnement sont configurées dans le dashboard, pas dans un fichier `.env`
- Le bot redémarre automatiquement sur Render après 15 minutes d'inactivité

## Obtenir votre token Discord
1. Allez sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Sélectionnez votre application
3. Allez dans "Bot"
4. Cliquez sur "Reset Token" pour obtenir votre token
5. **Copiez-le immédiatement** - vous ne pourrez plus le voir après

## Nouvelles Fonctionnalités

### 🎉 Système de Bienvenue
Commande : `welcome` (réservée aux buyers)
- Message automatique pour chaque nouveau membre
- Variables : `{user}`, `{username}`, `{server}`, `{membercount}`

### 🎭 Système de Rolemenu
Commande : `rolemenu` (nécessite permission "Gérer les rôles")
- Menus déroulants interactifs pour attribuer des rôles
- Toggle automatique : cliquer ajoute/retire le rôle
- Support de plusieurs rolemenus par serveur

## Support
Pour toute question, rejoignez le serveur Discord : https://discord.gg/line
