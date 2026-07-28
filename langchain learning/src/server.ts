import express from 'express'
import {initChatModel} from "langchain"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import {OllamaEmbeddings} from '@langchain/ollama'

const app=express()

const model=await initChatModel('lfm2.5:8b',{
    modelProvider: "ollama"
})

const embeddingModel=new OllamaEmbeddings({
    model:'nomic-embed-text-v2-moe:latest',
})

const loader=new PDFLoader('./iso27001.pdf')
const docs=await loader.load()

const splitter= new RecursiveCharacterTextSplitter({
    chunkSize:500,
    chunkOverlap:50,
})

const chunks = await splitter.splitDocuments(docs)

const vectors=await embeddingModel.embedDocuments(chunks.map(chunk=>chunk.pageContent))

console.log(vectors,vectors.length,chunks.length)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))