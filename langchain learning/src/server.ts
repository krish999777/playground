import express from 'express'
import {initChatModel} from "langchain"
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import {OllamaEmbeddings} from '@langchain/ollama'
import { QdrantVectorStore } from "@langchain/qdrant"
import {ChatPromptTemplate} from '@langchain/core/prompts'
import dotenv from 'dotenv'
import { RunnableLambda } from '@langchain/core/runnables';
import type { Document } from 'langchain';
import {StringOutputParser} from '@langchain/core/output_parsers'


const app=express()
dotenv.config()

const model=await initChatModel('lfm2.5:8b',{
    modelProvider: "ollama"
})

const embeddingModel=new OllamaEmbeddings({
    model:'nomic-embed-text-v2-moe:latest',
})

// const loader=new PDFLoader('./iso27001.pdf')
// const docs=await loader.load()

// const splitter= new RecursiveCharacterTextSplitter({
//     chunkSize:500,
//     chunkOverlap:50,
// })

// const chunks = await splitter.splitDocuments(docs)

const QUESTION='What is monitoring and measurement'

const formatDocs=new RunnableLambda({
    func:(docs:Document[])=>({context:docs.map(doc=>doc.pageContent).join('\n\n'),input:QUESTION})
})

const parser=new StringOutputParser()

const vectorStore=await QdrantVectorStore.fromExistingCollection(embeddingModel,{url:process.env.QDRANT_URL!,collectionName: "iso27001",})

const retriever=vectorStore.asRetriever({k:4})

const promptTemplate=ChatPromptTemplate.fromMessages([
    [
        'system',`
        You have to answer the users question only from the provided context. If the answer is not in the context, say you dont know.\n
        context:{context}
    `],
    [
        'human',`
        {input}
        `
    ]
])

const chain=retriever.pipe(formatDocs).pipe(promptTemplate).pipe(model).pipe(parser)

const res=await chain.invoke(QUESTION)

console.log(res)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))