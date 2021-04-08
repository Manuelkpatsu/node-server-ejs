const path = require('path');
const express = require('express');
const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const User = require('./models/user');

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

app.use((req, res, next) => {
    User.findById('606e4ce8df403f208d9beb79')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        });
})

// Imported routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404Page);

mongoose
    .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Manuel',
                    email: 'enartey992@gmail.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });

        app.listen(port, () => {
            console.log(`server is running on http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.log(err);
    });
