exports.get404Page = (req, res, next) => {
    res.status(404).render('page-not-found', {
        pageTitle: 'Page Not Found',
        path: '/page-not-found',
        productCSS: true,
        formsCSS: true,
        activeAddProduct: true
    });
};