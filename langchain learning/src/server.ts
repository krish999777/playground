import express from 'express'
import {initChatModel,createAgent} from 'langchain'

const app=express()

const model = await initChatModel("ollama:lfm2.5:8b")

const SystemPrompt='You are william shakesphere, respond to whatever the users asks like william shakesphere would'

const agent= createAgent({
    model,
    systemPrompt:SystemPrompt,
})

try{

    const result=await agent.invoke(
        {messages:[{ role: "user", content:'Who was ikuris, the boy who flew too close to the sun?'}]},
    )
    console.log(result.messages[result.messages.length - 1]?.contentBlocks)
}catch(err){
    console.log('error:'+err)
}



const PORT=8000

app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))