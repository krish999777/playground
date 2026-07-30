import express from 'express'
import {START,END,StateGraph,Annotation} from '@langchain/langgraph'

const app=express()

const state=Annotation.Root({
    name:Annotation<string>(),
    greeting:Annotation<string>(),
})

const graph=new StateGraph(state)

graph.addNode('greetingNode',(s:typeof state.State)=>({greeting:`Hello ${s.name}`}))
graph.addEdge(START,'greetingNode')
graph.addEdge('greetingNode',END)
const graphApp=graph.compile()

const res=await graphApp.stream({name:'Krish'})

for await (const chunk of res){
    console.log(chunk)
}

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))