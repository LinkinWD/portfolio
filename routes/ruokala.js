const express = require('express')
//houmaa merge params
const router = express.Router()
const ruokala = require('../controllers/ruokala')

//errorit ja validointi
const catchAsync = require('../utils/catchAsync')
const {onKirjautunut, validoiRuoka, onAdmin} = require('../middleware')

router.get('/', catchAsync(ruokala.index)) 

router.get('/uusi', onAdmin, ruokala.uusiRuokaFormi)

 router.post('/' ,validoiRuoka, onAdmin, catchAsync(ruokala.luoUusiRuokaMyyntiin))

 router.delete('/:id', onKirjautunut, onAdmin,catchAsync(ruokala.poistaRuokaMyynistä))

 
module.exports = router