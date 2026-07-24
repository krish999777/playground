import express from 'express'
import { initChatModel,HumanMessage,SystemMessage,AIMessage } from "langchain"

const app=express()

const model=await initChatModel('lfm2.5:8b',{
    modelProvider: "ollama"
})

const res=await model.invoke([
    new SystemMessage('Respond in one line only'),
    new HumanMessage('My name is krish. What is node.js'),
    new AIMessage('Nice to meet you krish, Node.js is server side scripting language in js'),
    new HumanMessage('What is my name?')
])

console.log(res.content)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))