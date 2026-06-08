import express from 'express'
import type {Request,Response} from 'express'
import cors from 'cors'

const app=express()

let data=[{
    id:1,
    title:"tanstack", 
    description:"Learn useQuery from tanStack"
}]
let currentId=2

app.use(express.json())
app.use(cors())
app.get('/todos',(req:Request,res:Response)=>{
    res.status(200).json(data)
})
app.post('/todos',async (req:Request,res:Response)=>{
    data.push({
        id:currentId,
        title:req.body.title,
        description:req.body.description
    })
    currentId++;
    res.status(201).json({
        id:currentId-1,
        title:req.body.title,
        description:req.body.description
    })
})
app.delete('/todos/:id',(req:Request,res:Response)=>{
    const {id}=req.params
    data=data.filter(data=>data.id!==Number(id))
    res.status(204).send()
})
app.listen(8000,()=>console.log('App listening on port 8000'))