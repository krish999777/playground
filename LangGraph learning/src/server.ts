import express from 'express'
import {START,END,StateGraph,Annotation,Send,Command} from '@langchain/langgraph'
import {initChatModel,HumanMessage,SystemMessage} from 'langchain'
import * as z from 'zod'

const app=express()

const childGraphAnnotation=Annotation.Root({
    text:Annotation<string>()
})

const graphAnnotation=Annotation.Root({
    name:Annotation<string>(),
    greeting:Annotation<string>()
})

const childGraph=new StateGraph(childGraphAnnotation)
.addNode('greeting',(state)=>({text:`Hello ${state.text}`}))
.addNode('uppercase',(state)=>({text:state.text.toUpperCase()}))
.addEdge(START,'greeting')
.addEdge('greeting','uppercase')
.addEdge('uppercase',END)

const childGraphApp=childGraph.compile()

const graph=new StateGraph(graphAnnotation)
.addNode('run',async (state)=>{
    const {text:greeting}=await childGraphApp.invoke({text:state.name})
    return {greeting}
})
.addEdge(START,'run')
.addEdge('run',END)

const graphApp=graph.compile()

const res=await graphApp.invoke({name:'Krish'})

console.log(res)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))