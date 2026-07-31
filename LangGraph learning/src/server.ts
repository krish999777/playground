import express from 'express'
import {START,END,StateGraph,Annotation} from '@langchain/langgraph'

const app=express()

const stateAnnotation=Annotation.Root({
    name:Annotation<string>(),
    result:Annotation<boolean>()
})

type StateType=typeof stateAnnotation.State

const graph=new StateGraph(stateAnnotation)
.addNode('randomResult',(state:StateType)=>({result:Math.random()>0.5}))
.addNode('A',()=>{console.log('A'); return {}})
.addNode('B',()=>{console.log('B'); return {}})
.addEdge(START,'randomResult')
.addConditionalEdges('randomResult',(state)=>state.result?'A':'B')

const graphApp=graph.compile()

const res=await graphApp.invoke({name:'Krish'})

console.log(res)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))