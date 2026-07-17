import OpenAI from 'openai'
import express from 'express'
import dotenv from 'dotenv'
// import * as z from 'zod'
// import { zodResponseFormat } from "openai/helpers/zod"

dotenv.config()

const app=express()

const openai=new OpenAI({
    apiKey:"ollama",
    baseURL:'http://localhost:11434/v1'
})

// const resumeSchema=z.object({
//     skills:z.array(z.string()),
//     education:z.array(z.string()),
//     experience:z.array(z.string())
// })

function isSkillInDemand(skill:string){
    console.log(skill)
    return Math.random()>0.5
}
function calculateExperience(startDate:any,endDate:any){
    console.log(startDate,endDate)
    return 1
}

type AssistantToolCallType={
    role:'assistant',
    content:null,
    tool_calls:any
}

type MessageType={
    role:'system'|'user'|'assistant',
    content:string,
}
type MessageToolCallType={
    role:'tool',
    tool_call_id:string,
    content:string
}

let messages:(MessageType|AssistantToolCallType|MessageToolCallType)[]=[
        {
            role:"system" as const,
            content:`
            You will be be asked if a skill is in demand or not and/or to calculate the users experience
            You have two functions isSkillInDemand(skill) and calculateExperience(startDate,endDate)
            Only call these functions if the user explicitly asks if a specific skill is in demand or if user asks to calculate experience
            Do not call the function otherwise
            You have to call there functions according to what to the user asks and display the result in this format:
            - Yes {skill} is/is not in demand
            - Your experience in {company} is (x)

            You have to use skill in demand part for as many skills there are and same for experience
            If one/both of them is missing then dont include that sentance in the response
            `,
        },
        {
            role:"user" as const,
            content:`
            My name is krish
            `
        }
    ]

const response=await openai.chat.completions.create({
    model:'lfm2.5:8b',
    messages,
    tools:[
  {
    type: "function",
    function: {
      name: "isSkillInDemand",
      description: "Check if skill is in demand",
      parameters: {
        type: "object",
        properties: {
            skill: {
              type: "string",
              description: "Skill to check if it is in demand",
            },
        },
        required:['skill']
      },
      strict: true,
    },
  },
  {
    type: "function",
    function: {
      name: "calculateExperience",
      description: "Calculate experience by passing start and end date",
      parameters: {
        type: "object",
        properties: {
            startDate: {
              type: "string",
              description: "Start date of job",
            },
            endDate:{
              type: "string",
              description: "End date of job",
            }
        },
        required:['startDate','endDate']
      },
      strict: true,
    },
  },
],
})
if(response.choices[0]?.message.content){
    messages.push({
        role:'assistant',
        content:response.choices[0].message.content
    })
}else{
    messages.push({
        role:'assistant',
        content:null,
        tool_calls:response.choices[0]?.message.tool_calls
    })
}

(response.choices[0]?.message.tool_calls||[]).forEach((tool:any)=>{
    if(tool.function.name==='isSkillInDemand'){
        const argument=JSON.parse(tool.function.arguments)
        const isInDemand=isSkillInDemand(argument.skill)
        messages.push({
          role: "tool",
          tool_call_id: tool.id,
          content:String(isInDemand),
        })
    }else{
        const argument=JSON.parse(tool.function.arguments)
        const exp=calculateExperience(argument.startDate,argument.endDate)
        messages.push({
          role: "tool",
          tool_call_id: tool.id,
          content:String(exp),
        })
    }
})

const finalResponse=await openai.chat.completions.create({
    model:'lfm2.5:8b',
    messages
})

console.log(finalResponse.choices[0]?.message.content)

const PORT=process.env.PORT||8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))
