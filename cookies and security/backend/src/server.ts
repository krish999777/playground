import express from 'express'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import type {Request,Response} from 'express'
import cors from 'cors'

const app=express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({  
    origin: 'http://localhost:5173', // Your exact frontend origin
    credentials: true  
}))

const SECRET_KEY='rviuerwjviwerjvriuojrtiuvniurtnwrtivourtnviurthnvwriuhvnortiuyovwrtiyvunrtiuyvnrwb'

app.post('/login',(req:Request,res:Response)=>{
    const {email,password}=req.body
    if(email==='admin@gmail.com'&&password==='admin@123'){
        const token=jwt.sign({role:'admin',id:1},SECRET_KEY,{expiresIn:'8h'})
        res.cookie('token',token,{
            httpOnly:true,
            secure:false,
            sameSite:'lax'
        })
        res.status(200).json({message:'Logged in successfully'})
    }
})
app.post('/logout',(req:Request,res:Response)=>{
    res.clearCookie('token')
    res.status(200).json({
        message: 'Logged out'
    });
})

app.get('/profile',(req:Request,res:Response)=>{
    console.log(req.cookies)
    const {token}=req.cookies
    if(token){
        const payload=jwt.decode(token)
        if(payload){
            return res.status(200).json(payload)
        }
    }
    return res.status(400).json({error:"Invalid/Missing token"})
})
app.get('/',(req,res)=>res.status(200).json({message:'hi'}))

app.listen(8000,()=>console.log('App listening on Port 8000'))