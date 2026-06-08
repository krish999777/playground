import express from 'express'
import type {Request,Response} from 'express'

const app=express()

app.use(express.json())
app.get('/todos',(req:Request,res:Response)=>{
    res.status(200).json({
        id:1,
        title:"tanstack", 
        description:"Learn useQuery from tanStack"
    })
})
app.post('/todos',(req:Request,res:Response)=>{
    res.status(201).json({
        id:2,
        title:req.body.title,
        description:req.body.description
    })
})
app.delete('todo',(req:Request,res:Response)=>{
    res.status(204).send()
})
app.listen(8000,()=>console.log('App listening on port 8000'))