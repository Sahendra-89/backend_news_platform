const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    content: {
        type: String, // HTML content
        required: true
    },
    metaDescription: {
        type: String,
        trim: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Page', PageSchema);
