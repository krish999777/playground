import express from 'express'
import { initChatModel } from "langchain"
import {JsonOutputParser} from '@langchain/core/output_parsers'

const app=express()

const model=await initChatModel('lfm2.5:8b',{
    modelProvider: "ollama"
})

const parser=new JsonOutputParser()

const res=await model.invoke([
    {role:'system',content:`
        Respond in JSON only
        {
            "name":"",
            "age":0
        }
        `},
    {role:'human',content:'Who is William Shakesphere'}
])
console.log(res.content)
const output=await parser.invoke(res)

console.log(output)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))