import express from 'express'
import {Server} from 'socket.io'
import { createServer } from "http"
import cors from 'cors'

const app=express()
const server = createServer(app)
const io=new Server(server,{
    cors:{
        origin:'http://localhost:5173',
        methods: ["GET", "POST"],
    }
})

app.use(cors())
io.on("connection",(socket)=>{
    console.log("A client connected!")
    const num=Math.floor(Math.random()*10)
    console.log('Random number:',num)
    socket.emit('message',num)
    socket.on('ping',(data)=>console.log(data))
})
app.get('/',(req,res)=>res.status(200).json({message:io}))



server.listen(8000,()=>console.log('App listening on port 8000'))