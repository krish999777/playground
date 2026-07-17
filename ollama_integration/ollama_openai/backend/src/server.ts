import OpenAI from 'openai'
import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app=express()

const openai=new OpenAI({
    apiKey:"ollama",
    baseURL:'http://localhost:11434/v1'
})

app.get('/',async (req,res)=>{
    const {question}=req.query
    if(!question){
        return res.status(200).send("Add a query parameter question to get ai response (?question=...)")
    }
    const response=await openai.chat.completions.create({
    model:'lfm2.5:8b',
    messages:[
        {
            role:"user",
            content:String(question)
        }
    ],
    stream:true
})
let message=""
for await (const chunk of response){
    message+=chunk.choices[0]?.delta.content
    res.write(chunk.choices[0]?.delta.content??'Error')
    console.log(chunk.choices[0]?.delta.content??'Error')
}

res.end()
})

const PORT=process.env.PORT||8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))
