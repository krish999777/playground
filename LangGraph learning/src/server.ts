import express from 'express'
import {START,END,StateGraph,Annotation,Command} from '@langchain/langgraph'

const app=express()

const messagesAnnotation=Annotation.Root({
    logs:Annotation<string[]>({
        default:()=>[],
        reducer:(current,update)=>[...current,...update]
    }),
    math:Annotation<boolean>()
})

const graph=new StateGraph(messagesAnnotation)
.addNode('Math',()=>({logs:['Math']}))
.addNode('Science',()=>{
    return {logs:['Science']}
})
.addNode('Researcher',async (state)=>{
    return new Command({
        update:{logs:['researcher']},
        goto:state.math?'Math':'Science'
    })
    
},{
    ends:['Science','Math']
})
.addEdge(START,'Researcher')
.addEdge('Science',END)
.addEdge('Math',END)

const graphApp=graph.compile()

const res=await graphApp.invoke({math:false})

console.log(res)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))