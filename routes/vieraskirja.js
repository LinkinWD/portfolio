const express = require('express')
const router = express.Router()
const Vieraskirja = require('../models/vieraskirja')

//errorit ja validointi
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/expressError')
const { vieraskirjaSchema} = require('../schemas.js')

const validoiVieraskirja = (req, res, next) => {
    // tämä on joi schema, ei mongoose. Se validoi ne nimet, mitkä löytyy [sisältä] inputista. Itse koodi on schemas.js
    const { error }= vieraskirjaSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }}


router.get('/',  catchAsync(async(req, res) => {
    //async functio, että voidaan odottaa, kun tiedot haetaa tietokannasta. Populatea kommentteihin, koska ne on osana vieraskirjaa ja liitetty sen pohjappiirustukseen
    const vieraskirja = await Vieraskirja.find({}).populate('kommentit')
    // console.log(vieraskirja)
    //näytetään index sivu ja lähetetään 'vieraskirjan' tiedot databasesta
    res.render('vieraskirja/index', {vieraskirja})
}))

router.get('/uusi', (req, res) => {
   res.render('vieraskirja/uusi')

})
//takaisin tulevat commentit pitää parse:ta
router.post('/', validoiVieraskirja, catchAsync(async (req, res) => {
   // console.log(req.body) 
   const tervehdys = new Vieraskirja(req.body.vieraskirja)
   await tervehdys.save()
   res.redirect('vieraskirja')
}))

router.get('/:id/edit', catchAsync(async(req, res) => {
    //etsitää id:llä vieraskirjasta
    const tervehdys = await Vieraskirja.findById(req.params.id)
    // console.log(req.params.id)
    res.render('vieraskirja/edit', { tervehdys })
}))

router.put('/:id', validoiVieraskirja, catchAsync(async(req, res) => {
    // res.send('toimii!')
    const { id } = req.params
    // console.log(req.params)
    const kommentti = await Vieraskirja.findByIdAndUpdate(id, {...req.body.vieraskirja})
    // console.log(kommentti)
    res.redirect(`/vieraskirja`)
}))

router.delete('/:id', catchAsync(async(req, res) => {
    const { id } = req.params
    await Vieraskirja.findByIdAndDelete(id)
    res.redirect('/vieraskirja')
}))

module.exports = router