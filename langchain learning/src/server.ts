import express from 'express'
import {initChatModel} from "langchain"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import {OllamaEmbeddings} from '@langchain/ollama'
import { QdrantVectorStore } from "@langchain/qdrant"
import dotenv from 'dotenv'


const app=express()
dotenv.config()

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

const vectorStore=await QdrantVectorStore.fromExistingCollection(embeddingModel,{url:process.env.QDRANT_URL!,collectionName: "iso27001",})

const vectorDoc=await vectorStore.similaritySearch('What is ISO 27001?',4)

console.log(vectorDoc)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))