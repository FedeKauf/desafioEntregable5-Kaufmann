import {Router} from 'express'
import { productModel } from '../dao/models/entities.model.js'
export const router=Router()



router.get('/', async (req, res) => {
    let limit = req.query.limit
    const products = await productModel.find().limit(limit).lean().exec() 
    if(limit){
        res.status(200).render('home', {products:products.slice(0,limit)});
    }else{
        res.status(200).render('home', {products});
    }
})


router.get('/realtimeproducts', async (req, res) => {
    let limit = req.query.limit
    const products = await productModel.find().limit(limit).lean().exec()

    res.status(200).render('realTimeProducts', {products})
})


