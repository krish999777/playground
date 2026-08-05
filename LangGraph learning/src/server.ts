import express from 'express'
import {START,END,StateGraph,Annotation,Command} from '@langchain/langgraph'

const app=express()

const messagesAnnotation=Annotation.Root({
    logs:Annotation<string[]>({
        default:()=>[],
        reducer:(current,update)=>[...current,...update]
    }),
    math:Annotation<boolean>(),
    supervisorState:Annotation<'preWorker'|'postWorker'>()
})

const graph=new StateGraph(messagesAnnotation)
.addNode('Math',()=>({logs:['Math']}))
.addNode('Science',()=>{
    return {logs:['Science']}
})
.addNode('Supervisor',async (state)=>{
    if(state.supervisorState==='postWorker'){
        return new Command({
            goto:END
        })
    }

    return new Command({
        update:{supervisorState:'postWorker'},
        goto:state.math?'Math':'Science'
    })
    
},{
    ends:['Science','Math',END]
})
.addEdge(START,'Supervisor')
.addEdge('Science','Supervisor')
.addEdge('Math','Supervisor')

const graphApp=graph.compile()

const res=await graphApp.invoke({math:true})

console.log(res)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))