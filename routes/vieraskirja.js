const express = require('express')
const router = express.Router()
const Vieraskirja = require('../models/vieraskirja')
//muista noi sulut exporteissa
const { onKirjautunut, onLuoja, validoiVieraskirja } = require('../middleware')
const vieraskirja = require('../controllers/vieraskirja')
//errorit ja validointi
const catchAsync = require('../utils/catchAsync')


router.get('/',  catchAsync(vieraskirja.index))

router.get('/uusi', onKirjautunut, catchAsync(vieraskirja.renderöiUusiFormi))

//takaisin tulevat commentit pitää parse:ta
router.post('/' ,validoiVieraskirja, onKirjautunut, catchAsync(vieraskirja.luoUusiVieraskirjaMerkintä))

router.get('/:id/edit', onKirjautunut, onLuoja, catchAsync(vieraskirja.renderöiMuokkaaFormi))

router.put('/:id', onKirjautunut, onLuoja, validoiVieraskirja, catchAsync(vieraskirja.muokkaaMerkintää))

router.delete('/:id', onKirjautunut, onLuoja, catchAsync(vieraskirja.poistaMerkintä))

module.exports = router