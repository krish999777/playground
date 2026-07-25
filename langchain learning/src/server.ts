import express from 'express'
import { initChatModel } from "langchain"
import { HumanMessage } from 'langchain'
import {ChatPromptTemplate,MessagesPlaceholder} from '@langchain/core/prompts'

const app=express()

const model=await initChatModel('lfm2.5:8b',{
    modelProvider: "ollama"
})

const chatTemplate=ChatPromptTemplate.fromMessages([
    ['system','You are a helpful ai assistant to assist the user'],
    new MessagesPlaceholder('history'),
    new MessagesPlaceholder('userMessage')
])

const humanMessage=new HumanMessage('I am krish, what is react.js')

const chat1=await chatTemplate.invoke({
    history:[],
    userMessage:humanMessage
})

const res1=await model.invoke(chat1)

const chat2=await chatTemplate.invoke({
    history:[
        humanMessage,
        ['ai',res1.content]
    ],
    userMessage:new HumanMessage('What is my name?')
})

const res=await model.invoke(chat2)

console.log(res.content)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))