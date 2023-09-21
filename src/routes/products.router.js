import {pm} from '../productManager.js';
import {Router} from 'express'
export const router=Router()



router.get('/', async (req, res) => {
    let limit = req.query.limit
    const products = await pm.getProducts()
    if(limit){
        res.status(200).json({products:products.slice(0,limit)});
    }else{
        res.status(200).json({products});
    }
})

router.get('/:pid', async (req, res) => {
    let {pid}=req.params
    
    pid=parseInt(pid)
    if(isNaN(pid)){
        res.json({status:'error', mensaje: 'Requiere2 un argumento id numerico'})
        return
    }  
    let resultado = await pm.getProductsById(pid)

    if(resultado){
        res.json({status: 'ok', producto: resultado })
    }else{
        res.json({status:'error', mensaje: `El producto con ID: ${pid} no existe`})
    }
})

router.post('/', async (req, res) => {

    let {title,description,price, thumbnail, stock, code} = req.body
    if(!title || !description || !price || !stock  || !code) return res.status(400).json({error: 'Los campos no pueden estar vacíos'})
    let nuevoProductoId = await pm.addProduct (title, description, price, thumbnail, stock, code)

    if(nuevoProductoId){
        return res.status(200).json({mensaje: 'Se creó el producto', nuevoProductoId})
        
    }else return res.status(400).json({error: 'Ocurrió un problema'})
})
router.put('/:pid', async (req, res) => {
    let {pid}=req.params
    let {title,description,price, thumbnail, stock, code,status}=req.body
    pid=parseInt(pid)
    if(isNaN(pid)){
        res.json({status:'error', mensaje: 'Requiere1 un argumento id numerico'})
        return
    }  
    let producto = await pm.getProductsById(pid)

    if(!producto){
        return res.json({status:'error', mensaje: `El producto con ID: ${pid} no existe`})
    }

    producto.title=title ? title:producto.title
    producto.description=description ? description:producto.description
    producto.price=price ? price:producto.price
    producto.thumbnail=thumbnail ? stock:producto.stock
    producto.code=code ? code:producto.code
    producto.status=status ? status:producto.status

    pm.updateProduct(producto)
    return res.status(200).json({mensaje: 'Se modificó el producto', producto})
})
router.delete('/:pid', async (req, res) => {
    let {pid}=req.params
    
    pid=parseInt(pid)
    if(isNaN(pid)){
        res.json({status:'error', mensaje: 'Requiere0 un argumento id numerico'})
        return
    }  
    let resultado = await pm.deleteProduct(pid)

    if(resultado){
        res.json({status: 'ok', mensaje: 'Producto eliminado'})
    }else{
        res.json({status:'error', mensaje: `El producto con ID: ${pid} no existe`})
    }
})

