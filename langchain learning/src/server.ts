import express from 'express'
import { initChatModel } from "langchain"
import {ChatPromptTemplate} from '@langchain/core/prompts'
import * as z from 'zod'

const app=express()

const model=await initChatModel('lfm2.5:8b',{
    modelProvider: "ollama"
})

const PersonSchema=z.object({
    name:z.string().describe('Name of what was referred by the user'),
    age:z.number().describe('age of what aws referred by the user')
})

const chatTemplate=ChatPromptTemplate.fromMessages([
    ['system','Only include information explicitly known. Do not guess. If a field is unknown, return null.'],
    ['human','Tell me about {item}']
])

const chain=chatTemplate.pipe(model.withStructuredOutput(PersonSchema))

const res=await chain.invoke({
    item:'william shakesphear'
})

console.log(res)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))