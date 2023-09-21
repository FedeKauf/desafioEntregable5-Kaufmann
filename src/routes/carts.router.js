//const Router=require('express').Router
import { Router } from 'express';
//const path=require('path')
import path from 'path';
//const fs=require('fs')
import fs from 'fs';
import __dirname from '../utils.js';

export const router=Router()
let ruta=path.join(__dirname,'..', '..', 'archivos','carts.json') 

function getCarts(){
    if(fs.existsSync(ruta)){
        return JSON.parse(fs.readFileSync(ruta,'utf-8'))
    }else{
        return []
    }
}

function saveCarts(carts){
    fs.writeFileSync(ruta, JSON.stringify(carts, null, 5))    
}


router.post('/', async (req, res) => {
    let carts = getCarts()
    let lastId = carts.length ? carts[carts.length -1].id : 0
    let newCart = {
        id:lastId + 1,
        products : []
    }
    carts=[...carts, newCart]
    saveCarts(carts)
    return res.status(200).json({mensaje: 'Se creó el carrito', nuevoCarrito: newCart})
})
router.get('/:cid', async (req, res) => {
    let {cid} = req.params
    cid = parseInt(cid)
    let carts = getCarts()
    let [cart] = carts.filter((c) => c.id === cid)
    if(!cart) return res.status(400).json({error: "Carrito no encontrado"})
    return res.status(200).json({carrito: cart})
})
router.post('/:cid/product/:pid', async (req, res) => {
    let {cid, pid} = req.params
    cid=parseInt(cid)
    pid=parseInt(pid)
    let carts = getCarts()
    let cartIndex = carts.findIndex((c) => c.id === cid)
    if(cartIndex<0) return res.status(400).json({error: "Carrito no encontrado"})
    let cart = carts[cartIndex]
    let products = cart.products
    let [product] = products.filter((p) => p.id === pid)
    if(product){
        product.quantity += 1
    }else{
        product = {
            id: pid,
            quantity: 1
        }
        cart.products.push(product)
    }
    carts[cartIndex]=cart
    saveCarts(carts)
    return res.status(200).json({carrito: cart})
})

//module.exports=router