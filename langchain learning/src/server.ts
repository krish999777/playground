import express from 'express'
import { initChatModel } from "langchain"
import {ChatPromptTemplate} from '@langchain/core/prompts'
import {StringOutputParser} from '@langchain/core/output_parsers'
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

const chat2=ChatPromptTemplate.fromMessages([
    ['system','Frame a sentance with the given name and age'],
    ['human','Name:{name},age {age}']
])

const parser=new StringOutputParser()

const chain=chatTemplate.pipe(model.withStructuredOutput(PersonSchema)).pipe(chat2).pipe(model).pipe(parser)

const res=await chain.invoke({
    item:'william shakesphear'
})

console.log(res)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))