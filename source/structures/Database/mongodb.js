const mongoose = require('mongoose');

// Schéma flexible pour stocker toutes les données
const DataSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now }
}, { 
    timestamps: true,
    strict: false 
});

const DataModel = mongoose.model('Data', DataSchema);

class MongoDB {
    constructor() {
        this.connected = false;
        this.cache = new Map();
    }

    async connect(uri) {
        if (this.connected) return;
        
        try {
            await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
            
            this.connected = true;
            console.log('[MongoDB] ✅ Connecté avec succès à MongoDB');
            
            // Précharger les données en cache
            await this.loadCache();
            
            // Gérer les événements de connexion
            mongoose.connection.on('error', (err) => {
                console.error('[MongoDB] ❌ Erreur de connexion:', err);
            });
            
            mongoose.connection.on('disconnected', () => {
                console.log('[MongoDB] ⚠️ Déconnecté de MongoDB');
                this.connected = false;
            });
            
            mongoose.connection.on('reconnected', () => {
                console.log('[MongoDB] ✅ Reconnecté à MongoDB');
                this.connected = true;
            });
            
        } catch (error) {
            console.error('[MongoDB] ❌ Erreur de connexion à MongoDB:', error);
            throw error;
        }
    }

    async loadCache() {
        try {
            const allData = await DataModel.find({});
            for (const item of allData) {
                this.cache.set(item.key, item.value);
            }
            console.log(`[MongoDB] 📦 ${allData.length} entrées chargées en cache`);
        } catch (error) {
            console.error('[MongoDB] Erreur lors du chargement du cache:', error);
        }
    }

    async get(key) {
        try {
            // Vérifier d'abord le cache
            if (this.cache.has(key)) {
                return this.cache.get(key);
            }

            // Sinon, récupérer depuis la base de données
            const data = await DataModel.findOne({ key });
            if (data) {
                this.cache.set(key, data.value);
                return data.value;
            }
            return null;
        } catch (error) {
            console.error(`[MongoDB] Erreur lors de la récupération de ${key}:`, error);
            return null;
        }
    }

    async set(key, value) {
        try {
            // Mettre à jour le cache
            this.cache.set(key, value);

            // Mettre à jour ou créer dans la base de données
            await DataModel.findOneAndUpdate(
                { key },
                { key, value, updatedAt: new Date() },
                { upsert: true, new: true }
            );

            return true;
        } catch (error) {
            console.error(`[MongoDB] Erreur lors de la sauvegarde de ${key}:`, error);
            return false;
        }
    }

    async delete(key) {
        try {
            // Supprimer du cache
            this.cache.delete(key);

            // Supprimer de la base de données
            await DataModel.deleteOne({ key });
            return true;
        } catch (error) {
            console.error(`[MongoDB] Erreur lors de la suppression de ${key}:`, error);
            return false;
        }
    }

    async has(key) {
        try {
            if (this.cache.has(key)) {
                return true;
            }
            const data = await DataModel.findOne({ key });
            return !!data;
        } catch (error) {
            console.error(`[MongoDB] Erreur lors de la vérification de ${key}:`, error);
            return false;
        }
    }

    async all() {
        try {
            const allData = await DataModel.find({});
            return allData.map(item => ({ key: item.key, value: item.value }));
        } catch (error) {
            console.error('[MongoDB] Erreur lors de la récupération de toutes les données:', error);
            return [];
        }
    }

    async clear() {
        try {
            this.cache.clear();
            await DataModel.deleteMany({});
            return true;
        } catch (error) {
            console.error('[MongoDB] Erreur lors de la suppression de toutes les données:', error);
            return false;
        }
    }

    // Méthodes pour la compatibilité avec quick.db
    async add(key, value) {
        const current = await this.get(key) || 0;
        return await this.set(key, current + value);
    }

    async subtract(key, value) {
        const current = await this.get(key) || 0;
        return await this.set(key, current - value);
    }

    async push(key, value) {
        const current = await this.get(key) || [];
        if (!Array.isArray(current)) {
            throw new Error(`La valeur de ${key} n'est pas un tableau`);
        }
        current.push(value);
        return await this.set(key, current);
    }

    async pull(key, value, multiple = false) {
        const current = await this.get(key) || [];
        if (!Array.isArray(current)) {
            throw new Error(`La valeur de ${key} n'est pas un tableau`);
        }
        
        if (multiple) {
            const filtered = current.filter(item => JSON.stringify(item) !== JSON.stringify(value));
            return await this.set(key, filtered);
        } else {
            const index = current.findIndex(item => JSON.stringify(item) === JSON.stringify(value));
            if (index > -1) {
                current.splice(index, 1);
            }
            return await this.set(key, current);
        }
    }

    // Méthode pour obtenir les statistiques
    async getStats() {
        try {
            const count = await DataModel.countDocuments();
            const size = this.cache.size;
            return {
                totalEntries: count,
                cacheSize: size,
                connected: this.connected
            };
        } catch (error) {
            console.error('[MongoDB] Erreur lors de la récupération des statistiques:', error);
            return null;
        }
    }
}

module.exports = MongoDB;
