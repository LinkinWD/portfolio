const express = require('express')
//houmaa merge params
const router = express.Router()
const ruokala = require('../controllers/ruokala')


//errorit ja validointi
const catchAsync = require('../utils/catchAsync')
const {onKirjautunut, validoiRuoka, onAdmin} = require('../middleware')



router.get('/', catchAsync(ruokala.index))


router.post('/' ,validoiRuoka, catchAsync(ruokala.luoUusiRuokaMyyntiin))
// router.get('/tilaa', onKirjautunut, ruokala.tilaaRuokaa)

router.get('/kassa', onAdmin, onKirjautunut ,catchAsync(ruokala.kassa))

router.put('/kassa/:id', onAdmin, onKirjautunut, catchAsync(ruokala.moukkaaRuokaMäärää))

router.get('/uusi', onAdmin, onKirjautunut, ruokala.uusiRuokaFormi)

router.get('/tilaa', onKirjautunut, catchAsync(ruokala.uusiTilaaFormi))

router.put('/tilaa/:id', onKirjautunut, catchAsync( ruokala.luoUusiTilaus))

router.delete('/kassa/:id', onAdmin, onKirjautunut, catchAsync(ruokala.merkitseTilausVastaanotetuksi ))

router.delete('/:id', onKirjautunut, onAdmin, catchAsync(ruokala.poistaRuokaMyynistä))


 


module.exports = router