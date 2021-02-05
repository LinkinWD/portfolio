const { ruokaSchema} = require('../schemas.js')
const Ruoka = require('../models/ruoka')
const Tilaus = require('../models/tilaus')

module.exports.index = async(req, res) => {
    const tuotteet = await Ruoka.find({})
    // console.log(tuotteet)
    res.render('ruokala/index', {tuotteet})
}

/* module.exports.tilaaRuokaa = (req,res) => {
    res.render('ruokala/tilaa')
}
 */
module.exports.uusiRuokaFormi = (req, res) => {
    res.render('ruokala/uusi')
 
 }

 module.exports.luoUusiRuokaMyyntiin = async (req, res, next) => {
    // console.log(req.body)
    const ruoka = new Ruoka(req.body.ruokala)
    await ruoka.save()
    res.redirect('ruokala/kassa')
 }

 module.exports.poistaRuokaMyynistä = async (req, res) => {
    const { id } = req.params
    await Ruoka.findByIdAndDelete(id)
    res.redirect('/ruokala/kassa')
}
module.exports.kassa = async (req, res) => {
    const tuotteet = await Ruoka.find({})
    const tilaukset = await Tilaus.find({}).populate('tilaaja')
    res.render('ruokala/kassa', { tuotteet, tilaukset})
}

module.exports.moukkaaRuokaMäärää = async (req, res) => {
    const { id } = req.params
    const update = await Ruoka.findByIdAndUpdate(id, {...req.body.ruokala})
    res.redirect('/ruokala/kassa')
}

module.exports.uusiTilaaFormi = async(req,res) => {
    const tuotteet = await Ruoka.find({})
    res.render('ruokala/tilaa', { tuotteet })
}

module.exports.luoUusiTilaus = async(req, res) => {
    const { id } =req.params
    const tilaus = req.body.tilaus * -1
    const uusiMäärä = await Ruoka.findByIdAndUpdate(id, { $inc: {'määrä': `${tilaus}`}})
    console.log(tilaus)
    const ruoka = await Ruoka.findById(id)
    const uusiTilaus = new Tilaus()
    uusiTilaus.tuote = ruoka.nimi
    uusiTilaus.määrä = req.body.tilaus
    uusiTilaus.tilaaja = req.user._id
    await uusiTilaus.save()
    res.redirect('/ruokala')
}

module.exports.merkitseTilausVastaanotetuksi = async(req, res) => {
   
    const { id } = req.params
    await Tilaus.findByIdAndDelete(id)
    res.redirect('/ruokala/kassa')
}
