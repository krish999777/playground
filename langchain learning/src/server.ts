import express from 'express'
import {initChatModel,tool,createAgent} from "langchain"
// import {ChatPromptTemplate} from '@langchain/core/prompts'
import {MemorySaver} from '@langchain/langgraph'
import * as z from 'zod'

const app=express()

const checkpointer=new MemorySaver()

const model=await initChatModel('lfm2.5:8b',{
    modelProvider: "ollama"
})

// const chatTemplate=ChatPromptTemplate.fromMessages([
//     ['system','You are a helpful ai assistant to assist the user. You dont have to use the tools. Use the tools only if needed'],
//     ['human','{input}']
// ])

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
    schema:z.object({})
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

// const chat1=await chatTemplate.invoke({
//     input:'Hi my name is krish'
// })

// const chat2=await chatTemplate.invoke({
//     input:'What is my name?'
// })

// const result1=await calc.invoke({expression:'57*42'})
// const result2=await currentTime.invoke({})
// const result3=await languageInfo.invoke({language:'React'})

const agent = createAgent({
    model,
    tools:[calc,currentTime,languageInfo],
    checkpointer
})

const res=await agent.invoke({messages:[['human','Hi my name is krish']]},{configurable:{thread_id:'1'}})
const res2=await agent.invoke({messages:[['human','What is my name?']]},{configurable:{thread_id:'1'}})
const res3=await agent.invoke({messages:[['human','What is my name?']]},{configurable:{thread_id:'2'}})


console.log('res 1')
console.log(res.messages[res.messages.length-1]?.content)
console.log('res 2')
console.log(res2.messages[res2.messages.length-1]?.content)
console.log('res 3')
console.log(res3.messages[res3.messages.length-1]?.content)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))