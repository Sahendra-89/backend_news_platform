const mongoose = require('mongoose');

const connectDB = async () => {
    const connString = process.env.MONGO_URI;

    if (!connString) {
        console.error('❌ MONGO_URI environment variable is NOT set!');
        console.error('Please add MONGO_URI to your Render environment variables.');
        process.exit(1);
    }

    // Mask URI for safe logging
    const maskedURI = connString.replace(/:([^@]+)@/, ':****@');
    console.log(`📡 Attempting to connect to: ${maskedURI}`);

    const maxRetries = 5;
    let retries = 0;

    while (retries < maxRetries) {
        try {
            await mongoose.connect(connString, {
                serverSelectionTimeoutMS: 10000, // 10 seconds timeout
            });
            console.log('✅ MongoDB Connected: Atlas');
            return;
        } catch (err) {
            retries++;
            console.error(`❌ MongoDB connection attempt ${retries}/${maxRetries} failed: ${err.message}`);
            if (retries === maxRetries) {
                console.error('❌ All MongoDB connection attempts failed. Exiting.');
                process.exit(1);
            }
            // Wait 3 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
};

module.exports = connectDB;
