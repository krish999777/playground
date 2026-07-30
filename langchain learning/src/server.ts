import express from 'express'
import {initChatModel} from "langchain"
// import {StringOutputParser} from '@langchain/core/output_parsers'

const app=express()

const model=await initChatModel('lfm2.5:8b',{
    modelProvider: "ollama"
})

// const parser=new StringOutputParser()

const res=await model.batch(['What is react in 2 lines','what is express in 1 line',['user','what is node in 3 lines']])

console.log(res.map(r=>r.content))


const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))