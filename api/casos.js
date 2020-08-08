const express = require('express')
const axios = require('axios')

const router = express.Router()

router.get('/test', (req, res, next) => {
    res.json({status: 'ok'})
})

router.post('/:state/:dateStart/:dataEnd', async (req, res, next) => {
    const { state, dateStart, dataEnd } = req.params
    const cidadesArr = []

    const initialDate = await axios.get(`https://brasil.io/api/dataset/covid19/caso/data/?date=${dateStart}&format=json&state=${state}`)
    const finalDate = await axios.get(`https://brasil.io/api/dataset/covid19/caso/data/?date=${dataEnd}&format=json&state=${state}`)
    
    const initialD = initialDate.data.results
    const finalD = finalDate.data.results
    // console.log(finalD)

    for (let key in initialD) {
        // console.log(finalD[key].city)
        cidadesArr.push({
            cidade: initialD[key].city,
            totalHabitantes: initialD[key].estimated_population_2019,
            casosInicial: initialD[key].confirmed,
            casosFinal: finalD[key].confirmed,
            porcentagem: (finalD[key].confirmed - initialD[key].confirmed) / initialD[key].estimated_population_2019 * 100
        })
    }
    const sorted = [...cidadesArr].sort((a, b) => b.porcentagem - a.porcentagem)
    const cidadesFiltradas = sorted.slice(0, 10)

    res.status(200).json({ resultado: cidadesFiltradas })
})

module.exports = router