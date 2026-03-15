const mongoose = require('mongoose');
const Category = require('./models/Category');
const dotenv = require('dotenv');

dotenv.config();

const categories = [
    'Politics & Government',
    'Business & Economy',
    'Technology',
    'Entertainment',
    'Health & Science',
    'Education & Jobs',
    'Regional / Local'
];

async function seedCategories() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/news-platform');
        console.log('Connected to MongoDB for seeding...');

        for (const name of categories) {
            const exists = await Category.findOne({ name });
            if (!exists) {
                await Category.create({ name });
                console.log(`Created category: ${name}`);
            } else {
                console.log(`Category already exists: ${name}`);
            }
        }

        console.log('Seeding complete.');
        process.exit();
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seedCategories();
