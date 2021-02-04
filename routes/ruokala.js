const express = require('express')
//houmaa merge params
const router = express.Router()
const ruokala = require('../controllers/ruokala')
const Ruoka = require('../models/ruoka')
const Tilaus = require('../models/tilaus')

//errorit ja validointi
const catchAsync = require('../utils/catchAsync')
const {onKirjautunut, validoiRuoka, onAdmin} = require('../middleware')
const renderFile = require('ejs-mate')




router.get('/', catchAsync(ruokala.index))


router.post('/' ,validoiRuoka, catchAsync(ruokala.luoUusiRuokaMyyntiin))
// router.get('/tilaa', onKirjautunut, ruokala.tilaaRuokaa)

router.get('/kassa', onAdmin, onKirjautunut ,catchAsync(async (req, res) => {
    const tuotteet = await Ruoka.find({})
    const tilaukset = await Tilaus.find({}).populate('tilaaja')
    res.render('ruokala/kassa', { tuotteet, tilaukset})
}))

router.put('/kassa/:id', async (req, res) => {
    const { id } = req.params
    const update = await Ruoka.findByIdAndUpdate(id, {...req.body.ruokala})
    res.redirect('/ruokala/kassa')
})




router.get('/uusi', ruokala.uusiRuokaFormi)



router.get('/tilaa', catchAsync(async(req,res) => {
    const tuotteet = await Ruoka.find({})
    res.render('ruokala/tilaa', { tuotteet })
}))

router.put('/tilaa/:id', catchAsync( async(req, res) => {
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
}))

router.delete('/kassa/:id', catchAsync(async(req, res) => {
   
    const { id } = req.params
    await Tilaus.findByIdAndDelete(id)
    res.redirect('/ruokala/kassa')
} ))

router.delete('/:id', onKirjautunut, onAdmin, catchAsync(ruokala.poistaRuokaMyynistä))


 


module.exports = router