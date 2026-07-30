import express from 'express'
import {START,END,StateGraph,Annotation} from '@langchain/langgraph'

const app=express()

const state=Annotation.Root({
    name:Annotation<string>(),
    greeting:Annotation<string>(),
})

const graph=new StateGraph(state)
.addNode('greetingNode',(s:typeof state.State)=>({greeting:`Hello ${s.name}`}))
.addEdge(START,'greetingNode')
.addEdge('greetingNode',END)

const graphApp=graph.compile()

const res=await graphApp.invoke({name:'Krish'})

console.log(res)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))