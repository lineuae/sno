# Configuration de l'API Prevname

## Problème actuel

Le bot reste bloqué sur "is thinking..." lors de l'utilisation de la commande `/prevname`. Cela indique que l'API ne répond pas.

## Configuration actuelle

L'API est configurée dans `source/structures/Functions/config.js`:

```javascript
snoway: {
    panel: "http://167.114.48.55:30126/api",
    api: "eHNdapE343dET5GY5ktc978ABhg4w3suD5Ny4sEW4F5KLg8u84"
}
```

## Solutions possibles

### 1. Vérifier si l'API est en ligne

Testez l'API avec cette commande PowerShell:
```powershell
Invoke-RestMethod -Uri "http://167.114.48.55:30126/api/prevname/get" -Method POST -Headers @{"api-key"="eHNdapE343dET5GY5ktc978ABhg4w3suD5Ny4sEW4F5KLg8u84"} -Body (@{userId="123456789"} | ConvertTo-Json) -ContentType "application/json"
```

### 2. Obtenir une nouvelle clé API

Si l'API actuelle ne fonctionne plus, vous devez:

1. **Contacter le fournisseur de l'API** (line/node - créateurs du bot)
2. **Héberger votre propre API** en créant un serveur Express.js
3. **Utiliser une API alternative** pour les prevnames Discord

### 3. Créer votre propre API (Recommandé)

Créez un serveur API simple avec Express.js:

```javascript
// api-server.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.use(express.json());

// Middleware de vérification de la clé API
app.use((req, res, next) => {
    const apiKey = req.headers['api-key'];
    if (apiKey !== 'VOTRE_CLE_API_ICI') {
        return res.status(401).json({ error: 'Invalid API key' });
    }
    next();
});

// Endpoint pour récupérer les prevnames
app.post('/api/prevname/get', async (req, res) => {
    const { userId } = req.body;
    // Récupérer depuis votre base de données
    const prevnames = await Prevname.find({ userId });
    res.json({ prevnames });
});

app.listen(30126, () => {
    console.log('API running on port 30126');
});
```

### 4. Utiliser le fallback local (Solution temporaire)

Le bot a maintenant un système de fallback qui utilise la base de données locale si l'API ne répond pas. Les prevnames seront stockés dans MongoDB sous la clé `prevnames_${userId}`.

## Modifications apportées

1. **Timeout ajouté** - L'API a maintenant un timeout de 5 secondes
2. **Logs détaillés** - Pour diagnostiquer le problème exact
3. **Fallback local** - Utilise la DB locale si l'API échoue
4. **Messages d'erreur améliorés** - Affiche les détails de l'erreur

## Tester les corrections

1. Redémarrez le bot
2. Utilisez `/prevname` dans Discord
3. Vérifiez les logs dans la console pour voir l'erreur exacte
4. Les logs afficheront:
   - `[PREVNAME SLASH] Appel API pour userId: ...`
   - `[API] Erreur prevget: ...`
   - Le type d'erreur (timeout, connexion refusée, etc.)

## Contact

Pour obtenir une nouvelle clé API ou des informations sur l'API Snoway, contactez:
- **Discord:** line / node
- **Support:** https://discord.gg/line
