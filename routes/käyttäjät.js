const express = require('express')
const passport = require('passport')
const router = express.Router()
const Käyttäjä = require ('../models/käyttäjät')
const catchAsync = require('../utils/catchAsync')

router.get('/register', (req, res) => {
    res.render('käyttäjät/register')
})

//passport on turhan maaginen, kun ei tartte ees ite tallentaa :D
router.post('/register', catchAsync(async(req, res, next) =>{
    try {
    const { email, username, password } = req.body
    const uusiKäyttäjä = new Käyttäjä({ email, username})
    const registöröityKäyttäja = await Käyttäjä.register(uusiKäyttäjä, password) 
    console.log(registöröityKäyttäja)
    //logattaan uusi käyttäjä sisään
    req.login(registöröityKäyttäja, err => {
        if(err) return next(err)
        req.flash('onnistu', 'Tervetuloa vieraskirjaani!')
        res.redirect('/vieraskirja')
    })
    } catch(e) {
        req.flash('error', e.message)
        res.redirect('register')
    }
    
}))

router.get('/login', (req, res) => {
    res.render('käyttäjät/login')
})

router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
}), (req, res) => {
    req.flash('onnistu', 'Tervetuloa takasin')
    const redirectUrl = req.session.returnTo || '/vieraskirja'
    delete req.session.returnTo
    res.redirect(redirectUrl)

})

router.get('/logout', (req, res) => {
    req.logOut()
    req.flash('onnistu', 'Kirjauduit ulos')
    res.redirect('/')
} )

module.exports = router