const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

// Set up
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
const indexRouter = require('./routes/index');
const brandsRouter = require('./routes/brands');

app.use('/', indexRouter);
app.use('/brands', brandsRouter);

// =============================

const PORT = process.env.PORT
app.listen(PORT || 3000, () => {
    console.log(`Server started at: http://localhost:${PORT}`);
});