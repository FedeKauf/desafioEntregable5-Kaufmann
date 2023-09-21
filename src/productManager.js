

import fs from 'fs';

class ProductManager {
    constructor (path){
        this.lastId = 0
        this.products=[]
        this.path=path
        this.productFileName="products.json"
    }

    async saveToFile(path, fileName, data){
        if(fs.existsSync(path)){
            await fs.promises.writeFile(path+fileName, JSON.stringify(data, null, 5))
        }else {
            await fs.promises.mkdir(path, {recursive: true})
            await fs.promises.writeFile(path+fileName, JSON.stringify(data, null, 5))
        }
    }

    async loadFile(path, fileName){
        if(fs.existsSync(path)){
            const data = await fs.promises.readFile(path+fileName, 'utf-8')
            return JSON.parse(data)
        }else {
            const pmEmpty = {
                lastId: 0,
                products: []
            }
            return pmEmpty
        } 
    }

    async updateProduct(productoModificado){
        const actualProduct= await this.getProductsById(productoModificado.id)
        if(actualProduct===undefined) return
        const productos = await this.getProducts()
        const indiceProducto = productos.findIndex((producto)=>producto.id===productoModificado.id)
        productos[indiceProducto] = productoModificado
        const pm = {
            lastId: this.lastId,
            products: productos
        }
        this.saveToFile (this.path, this.productFileName, pm)
    }

    async deleteProduct(id){
        const actualProduct= await this.getProductsById(id)
        if(actualProduct===undefined) return false
        const productos = await this.getProducts()
        const indiceProducto = productos.findIndex((producto)=>producto.id===id)
        const listaModificada = [...productos.slice(0,indiceProducto), ...productos.slice(indiceProducto+1,productos.length)]
        const pm = {
            lastId: this.lastId,
            products: listaModificada
        }
        this.saveToFile (this.path, this.productFileName, pm)
        return true
    }

    addProduct(title,description,price, thumbnail, stock, code){
        let nuevoProducto={
            title: title, 
            description: description, 
            price: price, 
            thumbnail: thumbnail, 
            stock: stock,
            code: code,
            status:true
        }

        const nullValues = Object.values(nuevoProducto).some(value => value === null)
        
        if(nullValues){
            return console.log("Error. All product fields must be complete!");
        }
        
        nuevoProducto.id= this.lastId + 1;

        this.products.push(nuevoProducto)
        this.lastId = this.lastId + 1
        
        const pm = {
            "lastId":this.lastId,
            "products": this.products
        }
        this.saveToFile(this.path,this.productFileName,pm)
        return nuevoProducto.id     
    }

    async getProducts(){
        const data = await this.loadFile(this.path, this.productFileName)
        this.lastId=data.lastId
        this.products=data.products
        return data.products
    }
    
    async getProductsById(idProducto){
        const productos= await this.getProducts(this.path, this.productFileName)
        let [producto]=productos.filter(producto=>producto.id===idProducto)
        if(!producto) return console.error(`El producto ${idProducto} no existe`)
        return producto
    }
}

export let pm=new ProductManager("./archivos/");
//module.exports={ pm }