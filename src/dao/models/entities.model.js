import mongoose from 'mongoose'

const cartsCollection = 'carts'

const cartSchema = new mongoose.Schema({
    id: {type: String, unique: true, required: true},
    products: [
        new mongoose.Schema(
        {
          productId: { type: Number, required: true },
          quantity: { type: Number, required: true },
        },
        { _id: false }
      ),
    ],
})

export const cartModel = mongoose.model (cartsCollection,cartSchema)


const productsCollection = 'products'

const productSchema = new mongoose.Schema ({
    productId: {type:Number, unique:true, requiered:true},
    code : {type:String, unique:true, required:true},
    title: {type:String, required:true },
    description : {type:String, required:true },
    price: {type:Number, required:true },
    stock: {type:Number, required:true },
    category: {type:String, required:true },
    thumbnail: [],  
})

export const productModel = mongoose.model (productsCollection, productSchema)



const chatsCollection = 'messages'

const chatSchema = new mongoose.Schema ({
    user : String,
   message : String
})

export const chatModel = mongoose.model (chatsCollection,chatSchema)

