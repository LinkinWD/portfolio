const express = require('express')
//houmaa merge params
const router = express.Router({mergeParams: true})
const Vieraskirja = require('../models/vieraskirja')
const Kommentti = require('../models/kommentit')
const { onKirjautunut, onKommentinLuoja } = require('../middleware')
const kommentit = require('../controllers/kommentit')

//errorit ja validointi
const catchAsync = require('../utils/catchAsync')
const { validoiKommentti } = require('../middleware')

router.post('/', onKirjautunut, validoiKommentti, catchAsync(kommentit.KirjoitaKommentti))

router.delete('/:kommenttiId', onKirjautunut, onKommentinLuoja ,catchAsync(kommentit.poistaKommentti))

module.exports = router
