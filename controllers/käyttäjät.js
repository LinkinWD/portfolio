const Käyttäjä = require ('../models/käyttäjät')
const passport = require('passport')

module.exports.renderöiUusiKäyttäjäFormi = (req, res) => {
    res.render('käyttäjät/register')
}

module.exports.rekisteröiUusiKäyttäjä = async(req, res, next) =>{
    try {
    const { email, username, password } = req.body
    const uusiKäyttäjä = new Käyttäjä({ email, username})
    const registöröityKäyttäja = await Käyttäjä.register(uusiKäyttäjä, password) 
    // console.log(registöröityKäyttäja)
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
    
}

module.exports.renderöiLoggausFormi = (req, res) => {
    res.render('käyttäjät/login')
}

module.exports.loggaaKäyttäjäSisään = (req, res) => {
    req.flash('onnistu', 'Tervetuloa takasin')
    
    //tää ei taida toimia, sniff
    const redirectUrl = req.session.returnTo || '/'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.loggaaKäyttäjäUlos = (req, res) => {
    req.logOut()
    req.flash('onnistu', 'Kirjauduit ulos')    
    res.redirect('/')
}


