const mongoose = require('mongoose');
const Category = require('./models/Category');
const dotenv = require('dotenv');

dotenv.config();

const categoriesToRemove = [
    'Sports & Crickets',
    'Sports',
    'Cricket',
    'current news' // lowercase duplicate
];

async function cleanupCategories() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/news-platform');
        console.log('Connected to MongoDB for cleanup...');

        for (const name of categoriesToRemove) {
            const result = await Category.deleteMany({ name: name });
            if (result.deletedCount > 0) {
                console.log(`Deleted category: ${name} (Count: ${result.deletedCount})`);
            } else {
                console.log(`Category not found or already deleted: ${name}`);
            }
        }

        console.log('Cleanup complete.');
        process.exit();
    } catch (err) {
        console.error('Cleanup failed:', err);
        process.exit(1);
    }
}

cleanupCategories();
