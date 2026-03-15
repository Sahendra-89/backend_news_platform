const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String },
    serviceType: {
        type: String,
        required: true,
        enum: ['Website Development', 'E-Commerce', 'SEO', 'Maintenance', 'Redesign', 'Hosting & Security']
    },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);
