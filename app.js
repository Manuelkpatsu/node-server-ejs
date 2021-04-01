const path = require('path');
const express = require('express');

const app = express();

require('dotenv').config();
const port = process.env.PORT || 3000;

// Templating engines
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// Imported routes
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Routes
app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('page-not-found', {
        pageTitle: 'Page Not Found',
        path: '/page-not-found',
        productCSS: true,
        formsCSS: true,
        activeAddProduct: true
    });
});

app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
});
