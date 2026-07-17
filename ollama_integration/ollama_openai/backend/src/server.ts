import OpenAI from 'openai'
import express from 'express'
import dotenv from 'dotenv'
import * as z from 'zod'
import { zodResponseFormat } from "openai/helpers/zod"

dotenv.config()

const app=express()

const openai=new OpenAI({
    apiKey:"ollama",
    baseURL:'http://localhost:11434/v1'
})

const resumeSchema=z.object({
    skills:z.array(z.string()),
    education:z.array(z.string()),
    experience:z.array(z.string())
})

const response=await openai.chat.completions.create({
    model:'lfm2.5:8b',
    messages:[
        {
            role:"system",
            content:`
            You are a resume analyzer
            you will recieve a professional summary of a person and you have to segregate it into the following in JSON:
            1)skills:array of professional skills(string).
            2)Experience:array of company name (string). Include only if it is a company the user has worked in or is working
            3)Education: array of institute name (string). Include only if is an institude or school the user studied or studies in
            `
        },
        {
            role:"user",
            content:`
            I am a full stack developer, specializing in the mern stack + typescript and sql. 
            I study in Shri bhagubhai mafatlal polytechnic. 
            I have built resumeHub project with prisma and cloudinary and websocket
            `
        }
    ],
    response_format:zodResponseFormat(resumeSchema,'resume')
})

const parsed=JSON.parse(response.choices[0]?.message.content||"{}")
console.log(response.choices[0]?.message.content)
console.log(parsed)

const PORT=process.env.PORT||8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))
