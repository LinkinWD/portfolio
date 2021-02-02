const express = require('express')
const router = express.Router()

//muista noi sulut exporteissa
const { onKirjautunut, onLuoja, validoiVieraskirja } = require('../middleware')
const vieraskirja = require('../controllers/vieraskirja')
//errorit ja validointi
const catchAsync = require('../utils/catchAsync')

//router.route, voit yhdistää samanalkuisia
router.route('/')
        .get(catchAsync(vieraskirja.index))
        .post(validoiVieraskirja, onKirjautunut, catchAsync(vieraskirja.luoUusiVieraskirjaMerkintä))
//Järjestyksellä on väliä, tämä ennen id, ettei oli id:uusi
router.get('/uusi', onKirjautunut, catchAsync(vieraskirja.renderöiUusiFormi))

router.route('/:id')
        .put(onKirjautunut, onLuoja, validoiVieraskirja, catchAsync(vieraskirja.muokkaaMerkintää))
        .delete(onKirjautunut, onLuoja, catchAsync(vieraskirja.poistaMerkintä))



router.get('/:id/edit', onKirjautunut, onLuoja, catchAsync(vieraskirja.renderöiMuokkaaFormi))

module.exports = router