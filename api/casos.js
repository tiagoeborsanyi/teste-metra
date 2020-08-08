const express = require('express')
const request = require('request')
const axios = require('axios')

const router = express.Router()

router.get('/test', async (req, res, next) => {
    res.json({status: 'ok'})
})

router.post('/:state/:dateStart/:dataEnd', async (req, res, next) => {
    const { state, dateStart, dateEnd } = req.params
    

    const initialDate = await axios.get(`https://brasil.io/api/dataset/covid19/caso/data/?date=${dateStart}&format=json&state=${state}`)
    const finalDate = await axios.get(`https://brasil.io/api/dataset/covid19/caso/data/?date=${dateEnd}&format=json&state=${state}`)
    console.log(initialDate.data.results)
    res.status(200).json(initialDate.data.results)
})

module.exports = router