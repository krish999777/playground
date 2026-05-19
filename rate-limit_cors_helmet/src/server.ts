import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import {rateLimit} from 'express-rate-limit'

const app=express()
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(helmet())

const limit=rateLimit({
    windowMs:10000,
    max:5,
    standardHeaders:true,
    legacyHeaders:false
})
app.get('/',limit,(req,res)=>res.status(200).json({message:"Rated limited endpoint"}))

app.listen(8000,()=>console.log(`App listening on port 8000`))