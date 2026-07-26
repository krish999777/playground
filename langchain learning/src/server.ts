import express from 'express'
import {initChatModel} from "langchain"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const app=express()

const model=await initChatModel('lfm2.5:8b',{
    modelProvider: "ollama"
})

const loader=new PDFLoader('./iso27001.pdf')
const docs=await loader.load()

const splitter= new RecursiveCharacterTextSplitter({
    chunkSize:500,
    chunkOverlap:50,
})

const chunks = await splitter.splitDocuments(docs)

console.log(chunks.length,chunks[0],chunks[1])

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))