const express = require('express');
const router = express.Router();
const client = require('../db/db');
const upload = require('../upload');

router.get('/', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM smartphones');
        res.render('phones', { title: 'All smartphones', phones: result.rows });
    } catch (err) {
        console.error('Error fetching smartphones:', err);
        res.status(500).send('Database error');
    }
});

router.get('/add-phone', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM brands');
        res.render('add-phone', { brands: result.rows });
    } catch (err) {
        console.error('Erro fetching database', err);
        res.status(500).send('Database error');
    }
});

router.post('/add-phone', upload, async (req, res) => {
    const { name, price, stock, description, brand } = req.body;
    const image_url = req.file ? `uploads/${req.file.filename}` : null;

    try {
        await client.query('INSERT INTO smartphones (model_name, price, stock_quantity, description, brand_id, image_url) VALUES ($1, $2, $3, $4, $5, $6)',
            [name, price, stock, description, brand, image_url]);
        res.redirect('/phones');
    } catch (err) {
        console.error('Error adding brand:', err);
        res.status(500).send('Database error');
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await client.query('SELECT * FROM smartphones WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            res.status(404).send('Smartphone not found');
        }

        res.render('phone', { phone: result.rows[0] });
    } catch (err) {
        console.error('Error fetching smartphone by ID:', err);
        res.status(500).send('Database error');
    }
});

module.exports = router;