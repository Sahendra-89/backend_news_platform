const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const auth = require('../auth'); // Assuming auth middleware exists

// @route   GET /api/pages/:slug
// @desc    Get page by slug
// @access  Public
router.get('/:slug', async (req, res) => {
    try {
        const page = await Page.findOne({ slug: req.params.slug });
        if (!page) {
            return res.status(404).json({ msg: 'Page not found' });
        }
        res.json(page);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/pages
// @desc    Get all pages (for admin list)
// @access  Public (or Admin only if you prefer)
router.get('/', async (req, res) => {
    try {
        const pages = await Page.find().sort({ title: 1 });
        res.json(pages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/admin/pages
// @desc    Create a new page
// @access  Private (Admin)
router.post('/', auth, async (req, res) => {
    if (!req.user.admin) return res.status(401).json({ msg: 'Admin authorization required' });
    const { title, slug, content, metaDescription } = req.body;

    try {
        let page = await Page.findOne({ slug });
        if (page) {
            return res.status(400).json({ msg: 'Page already exists with this slug' });
        }

        page = new Page({
            title,
            slug,
            content,
            metaDescription
        });

        await page.save();
        res.json(page);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/pages/:id
// @desc    Update a page
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
    if (!req.user.admin) return res.status(401).json({ msg: 'Admin authorization required' });
    const { title, slug, content, metaDescription } = req.body;

    try {
        let page = await Page.findById(req.params.id);
        if (!page) {
            return res.status(404).json({ msg: 'Page not found' });
        }

        page.title = title || page.title;
        page.slug = slug || page.slug;
        page.content = content || page.content;
        page.metaDescription = metaDescription || page.metaDescription;
        page.updatedAt = Date.now();

        await page.save();
        res.json(page);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/admin/pages/:id
// @desc    Delete a page
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
    if (!req.user.admin) return res.status(401).json({ msg: 'Admin authorization required' });
    try {
        const page = await Page.findById(req.params.id);
        if (!page) {
            return res.status(404).json({ msg: 'Page not found' });
        }

        await page.deleteOne();
        res.json({ msg: 'Page removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
