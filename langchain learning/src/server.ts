import express from 'express'
import {initChatModel,tool} from "langchain"
import {ChatPromptTemplate} from '@langchain/core/prompts'
import * as z from 'zod'

const app=express()

const model=await initChatModel('lfm2.5:8b',{
    modelProvider: "ollama"
})

const chatTemplate=ChatPromptTemplate.fromMessages([
    ['system','You are a helpful ai assistant to assist the user'],
    ['human','{input}']
])

const calc=tool(({expression}:{expression:string})=>{
    const ans=eval(expression)
    return ans
},{
    name:'Calculator for arithmetic expressions',
    description:'Calculator which takes arithmentic expression as arugments and returns the answer',
    schema:z.object({
        expression:z.string()
    })
})

const currentTime=tool(()=>new Date(),{
    name:'Get current time',
    description:'Getting current time',
    schema:z.object({})//am i supposed to do this for empty arguement?
})

const languageInfo=tool(({language})=>{
    console.log(language)
    return {
        creator:'krish',
        year:'2009'
    }
},{
    name:'GetProgrammingLanguageInfo',
    description:'Get info about programming language',
    schema:z.object({
        language:z.string()
    })
})

const chat=await chatTemplate.invoke({
    input:'What is 57*42'
})

const result1=await calc.invoke({expression:'57*42'})
const result2=await currentTime.invoke({})
const result3=await languageInfo.invoke({language:'React'})

console.log(result3)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))