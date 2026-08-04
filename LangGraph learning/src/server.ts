import express from 'express'
import {START,END,StateGraph,Annotation} from '@langchain/langgraph'

const app=express()

const messagesAnnotation=Annotation.Root({
    logs:Annotation<string[]>({
        default:()=>[],
        reducer:(current,update)=>[...current,...update]
    })
})

const graph=new StateGraph(messagesAnnotation)
.addNode('A',()=>({logs:['A']}))
.addNode('B',()=>{
    console.log('B started')
    return {logs:['B']}
})
.addNode('C',async ()=>{
    await new Promise((resolve)=>{
        setTimeout(()=>resolve(''),2000)
    })
    return {logs:['C']}
    
})
.addEdge(START,'A')
.addEdge('A','B')
.addEdge('A','C')
.addEdge('B',END)
.addEdge('C',END)

const graphApp=graph.compile()

const res=await graphApp.invoke({})

console.log(res)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))