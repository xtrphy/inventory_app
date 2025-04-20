const express = require('express');
const router = express.Router();
const client = require('../db/db');

router.get('/', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM brands');
        res.render('index', { title: 'Main Page', brands: result.rows });
    } catch (err) {
        console.error('Error fetching brands:', err);
        res.status(500).send('Database error');
    }
});

module.exports = router;