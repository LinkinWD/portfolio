const express = require('express')
const router = express.Router()
const Käyttäjä = ('../models/käyttäjät')

router.get('/register', (req, res) => {
    res.render('käyttäjät/register')
})

router.post('/register', async(req, res) =>
    res.send(req.body)
)

module.exports = router