const express = require('express')
//houmaa merge params
const router = express.Router()
const ruokala = require('../controllers/ruokala')
const Ruoka = require('../models/ruoka')

//errorit ja validointi
const catchAsync = require('../utils/catchAsync')
const {onKirjautunut, validoiRuoka, onAdmin} = require('../middleware')
const renderFile = require('ejs-mate')




router.get('/', catchAsync(ruokala.index))


router.post('/' ,validoiRuoka, catchAsync(ruokala.luoUusiRuokaMyyntiin))
// router.get('/tilaa', onKirjautunut, ruokala.tilaaRuokaa)

router.get('/kassa', onAdmin, onKirjautunut ,catchAsync(async (req, res) => {
    const tuotteet = await Ruoka.find({})
    res.render('ruokala/kassa', { tuotteet})
}))




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
    res.redirect('/ruokala')
}))



router.delete('/:id', onKirjautunut, onAdmin, catchAsync(ruokala.poistaRuokaMyynistä))

 


module.exports = router