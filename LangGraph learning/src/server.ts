import express from 'express'
import {START,END,StateGraph,Annotation,Send,Command} from '@langchain/langgraph'
import {initChatModel,HumanMessage,SystemMessage} from 'langchain'
import * as z from 'zod'

const app=express()

const graphAnnotation=Annotation.Root({
    name:Annotation<string>(),
    greeting:Annotation<string>()
})

const childGraph=new StateGraph(graphAnnotation)
.addNode('makeGreeting',(state)=>({greeting:`Hello ${state.name}`}))
.addNode('uppercase',(state)=>({greeting:state.greeting.toUpperCase()}))
.addEdge(START,'makeGreeting')
.addEdge('makeGreeting','uppercase')
.addEdge('uppercase',END)

const childGraphApp=childGraph.compile()

const graph=new StateGraph(graphAnnotation)
.addNode('run',childGraphApp)
.addEdge(START,'run')
.addEdge('run',END)

const graphApp=graph.compile()

const res=await graphApp.invoke({name:'Krish'})

const drawableGraph=await graphApp.getGraphAsync()
const mermaid=drawableGraph.drawMermaid()

console.log(mermaid)

console.log(res)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))