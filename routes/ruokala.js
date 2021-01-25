const express = require('express')
//houmaa merge params
const router = express.Router()
const Ruoka = require('../models/ruoka')


//errorit ja validointi
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/expressError')
const { ruokaSchema} = require('../schemas.js')

const validoiRuoka =(req, res, next) => {
    const { error} = ruokaSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }    
}



router.get('/', catchAsync(async(req, res) => {
    const tuotteet = await Ruoka.find({})
    // console.log(tuotteet)
    res.render('ruokala/index', {tuotteet})
})) 

router.get('/uusi', (req, res) => {
    res.render('ruokala/uusi')
 
 })
 //takaisin tulevat commentit pitää parse:ta
 router.post('/', validoiRuoka, catchAsync( async (req, res) => {
    // console.log(req.body)
    const ruoka = new Ruoka(req.body.ruokala)
    await ruoka.save()
    res.redirect('/kassa')
 }))

 router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await Ruoka.findByIdAndDelete(id)
    res.redirect('/kassa')
}))

module.exports = router