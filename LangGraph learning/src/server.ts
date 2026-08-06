import express from 'express'
import {START,END,StateGraph,Annotation,Send,Command} from '@langchain/langgraph'
import {initChatModel,HumanMessage,SystemMessage} from 'langchain'
import * as z from 'zod'

const app=express()

const messagesAnnotation=Annotation.Root({
    question:Annotation<string>(),
    answer:Annotation<string>(),
    isComplete:Annotation<boolean>(),
})

const supervisorOutput=z.object({
    model:z.enum(['math','general']).describe("Whether the model that answers this question should be math or general ")
})

const model=await initChatModel('lfm2.5:8b',{modelProvider:'ollama'})

const supervisorModel=model.withStructuredOutput(supervisorOutput)

const graph=new StateGraph(messagesAnnotation)
.addNode('supervisor',async (state)=>{
    if(state.isComplete){
        return new Command({goto:END})
    }
    const res=await supervisorModel.invoke([
        new SystemMessage('You are model choser, You dont have to answer the question, only choose if the given question should be answered with a math model or a general model. Always choose the math model if the question involves any kind of math'),
        new HumanMessage(state.question)
    ])
    console.log(res)
    if(res.model==='math'){
        return new Command({goto:new Send('math',{question:state.question})})
    }else{
        return new Command({goto:new Send('general',{question:state.question})})
    }
},{
    ends:['math','general',END]
})
.addNode('math',async (state)=>{
    console.log('math model invoked')
    const res=await model.invoke([
        new SystemMessage('You are math specialist, you have to answer the math question the user has. Only respond with the answer and not anything else'),
        new HumanMessage(state.question)
    ])
    return {answer:res.content,isComplete:true}
})
.addNode('general',async (state)=>{
    console.log('general model invoked')
    const res=await model.invoke([
        new HumanMessage(state.question)
    ])
    return {answer:res.content,isComplete:true}
})

.addEdge(START,'supervisor')
.addEdge('math','supervisor')
.addEdge('general','supervisor')

const graphApp=graph.compile()

const res=await graphApp.invoke({question:"What is 1+1"})

console.log(res)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))