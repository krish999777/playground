import express from 'express'
import {START,END,StateGraph,Annotation} from '@langchain/langgraph'

const app=express()

const stateAnnotation=Annotation.Root({
    count:Annotation<number>({
        default:()=>0,
        reducer:(current,update)=>current+update
    }),
    logs: Annotation<string[]>({
        default: () => [],
        reducer: (current, update) => current.concat(update)
    })
})

const graph=new StateGraph(stateAnnotation)
.addNode('inc',(state)=>{console.log(state.count);return({count:1,logs:[`Incremented to ${state.count+1}`]})})
.addEdge(START,'inc')
.addConditionalEdges('inc',(state)=>state.count<3?'inc':END)



const graphApp=graph.compile()

const res=await graphApp.invoke({})

console.log(res)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))