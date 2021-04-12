const { validationResult } = require('express-validator');

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product', 
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product', 
            path: '/admin/edit-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                imageUrl: imageUrl,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });

    product
        .save()
        .then(result => {
            console.log('Created Product!');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/admin/products');
    }
    const id = req.params.productId;
    Product
        .findById(id)
        .then(product => {
            if (!product) {
                return res.redirect('/admin/products');
            }

            res.render('admin/edit-product', {
                pageTitle: 'Edit Product', 
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            });
        })
        .catch(err => console.log(err));
    
}

exports.postEditProduct = (req, res, next) => {
    const id = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product', 
            path: '/admin/edit-product',
            editing: true,
            hasError: true,
            product: {
                title: updatedTitle,
                imageUrl: updatedImageUrl,
                price: updatedPrice,
                description: updatedDescription,
                _id: id
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
    
    Product.findById(id)
        .then(product => {
            if (!product) {
                return res.redirect('/admin/products');
            }
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/admin/products');
            }

            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            product.image = updatedImageUrl;
            return product
                .save()
                .then(result => {
                    console.log('Updated Product!');
                    res.redirect('/admin/products');
                });
        })
        .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product
        .deleteOne({ _id: id, userId: req.user._id })
        .then(() => {
            console.log('Product deleted!');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
        .then(products => {
            res.render('admin/products', {
                prods: products, 
                pageTitle: 'Admin Products', 
                path: '/admin/products'
            });
        })
        .catch(err => console.log(err));
}
