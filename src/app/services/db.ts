import { User } from '../models/User';
import sequelize from './sequelize';

let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

export async function initDatabase() {
    if (initializationPromise) return initializationPromise;
    
    if (isInitialized) return;
    
    initializationPromise = (async () => {
        try {
            await sequelize.authenticate();
            User.initModel(sequelize);
            // Only sync in development
            if (process.env.NODE_ENV === 'development') {
                await sequelize.sync();
            }
            isInitialized = true;
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Database initialization failed:', error);
            throw error;
        } finally {
            initializationPromise = null;
        }
    })();

    return initializationPromise;
}

export { sequelize };