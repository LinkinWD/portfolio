const express = require('express')
const router = express.Router()
const Vieraskirja = require('../models/vieraskirja')
//muista noi sulut exporteissa
const { onKirjautunut, onLuoja, validoiVieraskirja } = require('../middleware')

//errorit ja validointi
const catchAsync = require('../utils/catchAsync')




router.get('/',  catchAsync(async(req, res) => {
    //async functio, että voidaan odottaa, kun tiedot haetaa tietokannasta. Populatea kommentteihin, koska ne on osana vieraskirjaa ja liitetty sen pohjappiirustukseen
    const vieraskirja = await Vieraskirja.find({}).populate('kommentit').populate('luoja')
    
    // console.log(vieraskirja)
    //näytetään index sivu ja lähetetään 'vieraskirjan' tiedot databasesta
    res.render('vieraskirja/index', {vieraskirja})
}))

router.get('/uusi', onKirjautunut, catchAsync(async (req, res) => {
   
   res.render('vieraskirja/uusi')

}))
//takaisin tulevat commentit pitää parse:ta
router.post('/' ,validoiVieraskirja, onKirjautunut, catchAsync(async (req, res) => {
   // console.log(req.body) 

   const tervehdys = new Vieraskirja(req.body.vieraskirja)
   //Muista tää saatanan luoja liittää tähän :D
   tervehdys.luoja = req.user._id
   await tervehdys.save()
   req.flash('onnistu', 'Teit onnistuneesti uuden kirjoituksen')
   res.redirect('vieraskirja')
}))

router.get('/:id/edit', onKirjautunut, onLuoja, catchAsync(async(req, res) => {
    //etsitää id:llä vieraskirjasta
    const { id } = req.params
    const tervehdys = await Vieraskirja.findById(id)
    // jos yrittää editoida jotain mitä ei enään ole olemassakaaan
    if(!tervehdys) {
        req.flash('error', 'Viestiä ei löydy')
        return res.redirect('/vieraskirja')
    }
    // console.log(req.params.id)
    res.render('vieraskirja/edit', { tervehdys })
}))

router.put('/:id', onKirjautunut, onLuoja, validoiVieraskirja, catchAsync(async(req, res) => {
    // res.send('toimii!')
    const { id } = req.params
    // console.log(req.params)
    const kommentti = await Vieraskirja.findByIdAndUpdate(id, {...req.body.vieraskirja})
    req.flash('onnistu', 'päivitit onnistuneesti viestisi')
    // console.log(kommentti)
    res.redirect(`/vieraskirja`)
}))

router.delete('/:id', onKirjautunut, onLuoja, catchAsync(async(req, res) => {
    const { id } = req.params
    await Vieraskirja.findByIdAndDelete(id)
    req.flash('onnistu', 'Viesti poistettu :(')
    res.redirect('/vieraskirja')
}))

module.exports = router