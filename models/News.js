const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    language: { type: String, default: 'en' },
    image: { type: String },
    featured: { type: Boolean, default: false },
    // SEO Fields
    slug: { type: String, unique: true, sparse: true }, // Sparse allows null/undefined to be non-unique if needed, but we aim for unique slugs
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: { type: String },
    date: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

// Pre-save hook removed - handled in controller

module.exports = mongoose.model('News', NewsSchema);
