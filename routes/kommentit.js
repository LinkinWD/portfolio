const express = require('express')
//houmaa merge params
const router = express.Router({mergeParams: true})
const Vieraskirja = require('../models/vieraskirja')
const Kommentti = require('../models/kommentit')
const { validoiKommentti } = require('../middleware')

//errorit ja validointi
const catchAsync = require('../utils/catchAsync')




router.post('/', validoiKommentti, catchAsync(async(req, res) => {
    //etsitään oikea merkintä vieraskirjasta
    const vieraskirja = await Vieraskirja.findById(req.params.id)
    //tehdään uusi kommentti
    const kommentti = new Kommentti(req.body.kommentit)
    //työnnetään kommentti oikeaan kohtaan vieraskirjassa
    vieraskirja.kommentit.push(kommentti)
    //tallenetaan kummatkin
    await kommentti.save()
    await vieraskirja.save()
    req.flash('onnistu', 'teit onnistuneesti uuden kommentin')
    res.redirect('/vieraskirja')
}))

router.delete('/:kommenttiId', catchAsync(async(req, res) => {
    const { id, kommenttiId} = req.params
    //pull, vedetään vieraskirjasta kommentti, jolla on kommentti id
    await Vieraskirja.findByIdAndUpdate(id, { $pull: { kommentit: kommenttiId } } )
    //etsitään kommentti ja poistetaan
    await Kommentti.findByIdAndDelete(kommenttiId)
    req.flash('onnistu', 'kommentti poistettu')
    res.redirect('/vieraskirja')
}))

module.exports = router
