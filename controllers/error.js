exports.get404Page = (req, res, next) => {
    res.status(404).render('page-not-found', {
        pageTitle: 'Page Not Found',
        path: '/page-not-found',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.get500Page = (req, res, next) => {
    res.status(500).render('500', {
        pageTitle: 'Error',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });
};
