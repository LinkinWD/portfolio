const { ruokaSchema} = require('../schemas.js')
const Ruoka = require('../models/ruoka')

module.exports.index = async(req, res) => {
    const tuotteet = await Ruoka.find({})
    // console.log(tuotteet)
    res.render('ruokala/index', {tuotteet})
}

module.exports.uusiRuokaFormi = (req, res) => {
    res.render('ruokala/uusi')
 
 }

 module.exports.luoUusiRuokaMyyntiin = async (req, res, next) => {
    // console.log(req.body)
    const ruoka = new Ruoka(req.body.ruokala)
    await ruoka.save()
    res.redirect('/kassa')
 }

 module.exports.poistaRuokaMyynistä = async (req, res) => {
    const { id } = req.params
    await Ruoka.findByIdAndDelete(id)
    res.redirect('/kassa')
}

