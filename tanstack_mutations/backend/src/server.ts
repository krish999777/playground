import express from 'express'

const app=express()

app.get('/todos',(req,res)=>{
    res.status(200).json({
        id:1,
        title:"tanstack", 
    })
})