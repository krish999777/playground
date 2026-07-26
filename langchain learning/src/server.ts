import express from 'express'
import {initChatModel} from "langchain"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const app=express()

const model=await initChatModel('lfm2.5:8b',{
    modelProvider: "ollama"
})

const loader=new PDFLoader('./iso27001.pdf')
const docs=await loader.load()

console.log(docs.length,docs[0],docs[0]?.pageContent,docs[0]?.metadata,docs[0]?.id)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))