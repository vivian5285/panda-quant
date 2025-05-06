import mongoose from 'mongoose';
import { createLogger } from '../utils/logger';
const dbLogger = createLogger('Database');
export async function connectDB() {
    try {
        await mongoose.connect(process.env['MONGODB_URI'] || 'mongodb://localhost:27017/panda-quant');
        dbLogger.info('Successfully connected to MongoDB.');
    }
    catch (error) {
        dbLogger.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}
export async function disconnectDB() {
    try {
        await mongoose.disconnect();
        dbLogger.info('Successfully disconnected from MongoDB.');
    }
    catch (error) {
        dbLogger.error('Error disconnecting from MongoDB:', error);
        process.exit(1);
    }
}
mongoose.connection.on('error', (error) => {
    dbLogger.error('MongoDB connection error:', error);
});
mongoose.connection.on('disconnected', () => {
    dbLogger.warn('MongoDB disconnected');
});
//# sourceMappingURL=database.js.map