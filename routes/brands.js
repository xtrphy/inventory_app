const express = require('express');
const router = express.Router();
const client = require('../db/db');
const upload = require('../upload');

router.get('/', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM brands');
        res.render('brands', { title: 'All brands', brands: result.rows });
    } catch (err) {
        console.error('Error fetching brands:', err);
        res.status(500).send('Database error');
    }
});


router.get('/add-brand', (req, res) => {
    res.render('add-brand', { errorMessage: null });
});

router.post('/add-brand', upload, async (req, res) => {
    const { name, password } = req.body;
    const correctPassword = 'admin';
    const image_url = req.file ? `uploads/${req.file.filename}` : null;

    if (password === correctPassword) {
        try {
            await client.query('INSERT INTO brands (name, image_url) VALUES ($1, $2)', [name, image_url]);
            res.redirect('/brands');
        } catch (err) {
            console.error('Error adding brand:', err);
            res.status(500).send('Database error');
        }
    } else {
        res.render('add-brand', { errorMessage: 'Wrong password!' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const brands = await client.query('SELECT * FROM brands WHERE id = $1', [id]);
        const phones = await client.query(`
                SELECT smartphones.*, brands.name AS brand_name
            FROM smartphones
            JOIN brands ON smartphones.brand_id = brands.id
            WHERE brands.id = $1
            `, [id]);

        if (brands.rows.length === 0) {
            res.status(404).send('Brand not found');
        }

        res.render('brand', { brands: brands.rows[0], phones: phones.rows });
    } catch (err) {
        console.error('Error fetching brand by ID:', err);
        res.status(500).send('Database error');
    }
});

module.exports = router;