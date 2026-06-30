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
    socket.on("disconnect", (reason) =>console.log("User disconnected "+reason))
    socket.on('login',login=>{
        socket.data.user=login
        socket.join(login)
    })
    socket.on('select-user',data=>{
        socket.data.currentUser=data
    })
    socket.on('message',(message)=>{
        socket.to(socket.data.currentUser).emit('message',{from:socket.data.user,text:message})
        io.to(socket.data.user).emit('message',{from:socket.data.user,text:message})
    })
})
app.get('/',(req,res)=>res.status(200).json({message:io}))



server.listen(8000,()=>console.log('App listening on port 8000'))