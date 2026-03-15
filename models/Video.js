const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String },
    views: { type: String, default: '0 views' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', VideoSchema);
