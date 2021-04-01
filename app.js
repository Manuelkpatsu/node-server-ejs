const path = require('path');
const express = require('express');
const errorController = require('./controllers/error');

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
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404Page);

app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
});
