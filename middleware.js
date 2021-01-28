module.exports.onKirjautunut = (req, res, next) => {
    
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Sinun tarvitsee kirjautua tehdäksesi tämän')
        return res.redirect('/login')
    }
    next()
}