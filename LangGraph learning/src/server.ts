import express from 'express'
import {START,END,StateGraph,Annotation,Command} from '@langchain/langgraph'

const app=express()

const messagesAnnotation=Annotation.Root({
    logs:Annotation<string[]>({
        default:()=>[],
        reducer:(current,update)=>[...current,...update]
    }),
    mathComplete:Annotation<boolean>(),
    scienceComplete:Annotation<boolean>()
})

const graph=new StateGraph(messagesAnnotation)
.addNode('Math',()=>({logs:['Math']}))
.addNode('Science',()=>({logs:['Science']}))
.addNode('Supervisor',async (state)=>{
    if(state.mathComplete&&state.scienceComplete){
        return new Command({
            goto:END
        })
    }
    else if(state.mathComplete){
        return new Command({
            update:{scienceComplete:true},
            goto:'Science'
        })
    }else{
        return new Command({
            update:{mathComplete:true},
            goto:'Math'
        })
    }
    
},{
    ends:['Science','Math',END]
})
.addEdge(START,'Supervisor')
.addEdge('Science','Supervisor')
.addEdge('Math','Supervisor')

const graphApp=graph.compile()

const res=await graphApp.invoke({})

console.log(res)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))