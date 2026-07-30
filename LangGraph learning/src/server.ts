import express from 'express'
import {START,END,StateGraph,Annotation} from '@langchain/langgraph'

const app=express()

const state=Annotation.Root({
    name:Annotation<string>(),
    greeting:Annotation<string>(),
    uppercaseGreeting:Annotation<string>()
})

type StateType=typeof state.State

const graph=new StateGraph(state)
.addNode('greetingNode',(s:StateType)=>({greeting:`Hello ${s.name}`}))
.addNode('uppercaseNode',(state:StateType)=>({uppercaseGreeting:state.greeting.toUpperCase()}))
.addEdge(START,'greetingNode')
.addEdge('greetingNode','uppercaseNode')
.addEdge('uppercaseNode',END)

const graphApp=graph.compile()

const res=await graphApp.invoke({name:'Krish'})

console.log(res)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))