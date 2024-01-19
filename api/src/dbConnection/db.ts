import mongoose from 'mongoose';
import config from '../config/config';

const connectDB = async () => {
    try {
        await mongoose.connect(config.db_url);
        console.log('Connected to MongoDB',);
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

export default connectDB;
