import express from 'express'
import { initChatModel } from "langchain"
import { ChatPromptTemplate,MessagesPlaceholder } from "@langchain/core/prompts";

const app=express()

const model=await initChatModel('lfm2.5:8b',{
    modelProvider: "ollama"
})

const prompt = ChatPromptTemplate.fromMessages([
    ['system','Respond in {lines} line only'],
    new MessagesPlaceholder('fewShot'),
    ['human','What is {topic}']
])

const messages=await prompt.invoke({
    lines:1,
    topic:'E in that',
    fewShot:[
        ['human','What is MERN'],
        ['ai','MongoDB Express React Node']
    ]
})

console.log(messages)

const res=await model.invoke(messages)

console.log(res.content)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))