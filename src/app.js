import express from 'express';
import {engine} from 'express-handlebars'
import __dirname from './utils.js'
import path from 'path';
import routerApi from './dao/managerdb.js'
import { router as viewRouter } from './routes/view.router.js';
import {Server} from 'socket.io'


const PORT=8080
const app=express()



app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'/public')))
app.use('/api', routerApi)

app.use('/', viewRouter)

app.get('*',(req, res)=>{
    res.send('Error 404 - Page not found')
})

const serverExpress = app.listen(PORT, ()=>{
    console.log(`Server corriendo en puerto ${PORT}`)
})


const serverSocket=new Server(serverExpress)

serverSocket.on('connection', (socket) => {
    console.log(`Se ha conectado un cliente con id ${socket.id}`)

    socket.on('identificacion',nombre=>{
        console.log(`Se ha conectado ${nombre}`)
        socket.emit('idCorrecto',{message:`Hola ${nombre}, bienvenido...!!!`})
        socket.broadcast.emit('nuevoUsuario', nombre)

    })
   
    socket.on('nuevoProducto', async (newProduct) => {
        await fetch('http://localhost:8080/api/products', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newProduct),
        })
        
        serverSocket.emit('actualizar');
    
    })

    
    socket.on('eliminarProducto', async (id) => {
        await fetch(`http://localhost:8080/api/products/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
        serverSocket.emit('actualizar');
    
    })

    socket.on('bienvenida', () => {
        console.log("Bienvenido!")
    })

})
