const express = require('express');
const router = express.Router();
const client = require('../db/db');
const upload = require('../upload');

router.get('/', (req, res) => {
    res.render('brands', { title: 'Brands Page' });
});


router.get('/add', (req, res) => {
    res.render('add-brand');
});

router.post('/add', upload, async (req, res) => {
    const { name } = req.body;
    const image_url = req.file ? `uploads/${req.file.filename}` : null;

    try {
        await client.query('INSERT INTO brands (name, image_url) VALUES ($1, $2)', [name, image_url]);
        res.redirect('/brands');
    } catch (err) {
        console.error('Error adding brand:', err);
        res.status(500).send('Database error');
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await client.query('SELECT * FROM brands WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            res.status(404).send('Brand not found');
        }

        res.render('brand', { brands: result.rows[0] });
    } catch (err) {
        console.error('Error fetching brand by ID:', err);
        res.status(500).send('Database error');
    }
});

module.exports = router;