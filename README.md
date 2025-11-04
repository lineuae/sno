<h1 align="center">
 🤡 〢 Sno
</h1>

---
## <a id="menu"></a>🍃 〢 Menu

- [📩・Deploy With](#deploys)
- [⚙️・Setting up](#setup)
- [✨・New Features](#features)

## <a id="deploys"></a>📩 〢 Deploys
[![Deploy](https://raw.githubusercontent.com/Nekros-dsc/deploy-buttons/main/buttons/remade/replit.svg)](https://replit.com/github/Nekros-dsc/Snoway-Bot)

[![Deploy](https://raw.githubusercontent.com/Nekros-dsc/deploy-buttons/main/buttons/remade/glitch.svg)](https://glitch.com/edit/#!/import/github/Nekros-dsc/Snoway-Bot)

[![Deploy](https://raw.githubusercontent.com/Nekros-dsc/deploy-buttons/main/buttons/remade/heroku.svg)](https://heroku.com/deploy/?template=https://github.com/Nekros-dsc/Snoway-Bot)

[![Deploy](https://raw.githubusercontent.com/Nekros-dsc/deploy-buttons/main/buttons/remade/railway.svg)](https://railway.app/new/template?template=https://github.com/Nekros-dsc/Snoway-Bot)

## <a id="setup"></a> 📁 〢 Setting up

### Local Installation
1. Install [NodeJS](https://nodejs.org/)
2. Clone the repository
3. Run `npm install --ignore-scripts`
4. Create a `.env` file (see `.env.example`)
5. Add your MongoDB URI (required for data persistence)
6. Run `node index.js`

### Deploy on Render (Recommended)
See [RENDER_SETUP.md](RENDER_SETUP.md) for detailed instructions.

**Required Environment Variables:**
- `DISCORD_TOKEN` - Your Discord bot token
- `BOT_ID` - Your bot's application ID
- `MONGODB_URI` - MongoDB connection string (REQUIRED)
- `PREFIX` - Command prefix (optional, default: `-`)
- `COLOR` - Embed color (optional, default: `#808080`)

## <a id="features"></a> ✨ 〢 New Features

### 🎉 Welcome System
- Automatic welcome messages for new members
- Customizable message and channel
- Dynamic variables: `{user}`, `{username}`, `{server}`, `{membercount}`
- Command: `welcome` (buyers only)

### 🎭 Role Menu System
- Interactive dropdown menus for role assignment
- Toggle roles on/off with a single click
- Multiple role menus per server
- Full customization (title, description, emojis)
- Command: `rolemenu` (requires "Manage Roles" permission)

### 💾 MongoDB Integration
- **Persistent data storage** - no more data loss on restart
- All configurations saved permanently
- Fast in-memory caching for optimal performance
- Automatic synchronization

## ⚠️ Important Notes

- **MongoDB is REQUIRED** for data persistence
- Without MongoDB, all data will be lost on restart
- See [RENDER_SETUP.md](RENDER_SETUP.md) for MongoDB setup instructions

## 📞 Support
For questions or issues, join our Discord: https://discord.gg/line
