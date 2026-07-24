import express from 'express'
import { initChatModel } from "langchain"
import * as z from 'zod'

const app=express()

const model=await initChatModel('lfm2.5:8b',{
    modelProvider: "ollama"
})

const PersonSchema=z.object({
    name:z.string().describe('The name of the person referred by the user'),
    age:z.number().positive().describe('Age of the person referred by the user')
})

const structuredModel = model.withStructuredOutput(PersonSchema)

const res=await structuredModel.invoke([
    {role:'system',content:'Only include information explicitly known. Do not guess. If a field is unknown, return null.'},
    {role:'human',content:'Tell me about cupboards'}
])
console.log(res)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))