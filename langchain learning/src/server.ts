import express from 'express'
import {initChatModel} from "langchain"
import {StringOutputParser} from '@langchain/core/output_parsers'

const app=express()

const model=await initChatModel('lfm2.5:8b',{
    modelProvider: "ollama"
})

const parser=new StringOutputParser()

const chain=model.pipe(parser).withRetry({stopAfterAttempt:3})

const stream=await chain.stream('What model is this?')

for await(const chunk of stream){
    console.log(chunk)
}




const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))