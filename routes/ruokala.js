const express = require('express')
//houmaa merge params
const router = express.Router()
const ruokala = require('../controllers/ruokala')

//errorit ja validointi
const catchAsync = require('../utils/catchAsync')
const {onKirjautunut, validoiRuoka} = require('../middleware')




router.get('/', catchAsync(ruokala.index)) 

router.get('/uusi', ruokala.uusiRuokaFormi)

 router.post('/' ,validoiRuoka, catchAsync(ruokala.luoUusiRuokaMyyntiin))

 router.delete('/:id', onKirjautunut, catchAsync(ruokala.poistaRuokaMyynistä))

 router.get('/kassa', catchAsync(ruokala.kassa))


module.exports = router