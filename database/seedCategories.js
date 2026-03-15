const mongoose = require('mongoose');
const Category = require('./models/Category');

const seedCategories = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/news-platform');
        console.log('Database connected.');

        const categories = [
            'Education & Jobs',
            'Technology',
            'International News',
            'Design',
            'Current News',
            'Politics',
            'Sports'
        ];

        for (const name of categories) {
            const exists = await Category.findOne({ name });
            if (!exists) {
                await Category.create({ name });
                console.log(`Created category: ${name}`);
            } else {
                console.log(`Category exists: ${name}`);
            }
        }

        console.log('Seeding complete.');
        process.exit();
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
};

seedCategories();
