const express = require('express')
const passport = require('passport')
const router = express.Router()
const käyttäjät = require('../controllers/käyttäjät')

const catchAsync = require('../utils/catchAsync')

router.get('/register', käyttäjät.renderöiUusiKäyttäjäFormi)

//passport on turhan maaginen, kun ei tartte ees ite tallentaa :D
router.post('/register', catchAsync(käyttäjät.rekisteröiUusiKäyttäjä))

router.get('/login', käyttäjät.renderöiLoggausFormi)

router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
}), käyttäjät.loggaaKäyttäjäSisään)

router.get('/logout', käyttäjät.loggaaKäyttäjäUlos )

module.exports = router