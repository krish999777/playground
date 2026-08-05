import express from 'express'
import {START,END,StateGraph,Annotation,Send,Command} from '@langchain/langgraph'

const app=express()

const messagesAnnotation=Annotation.Root({
    topics:Annotation<string[]>({
        default:():string[]=>[],
        reducer:(current,update)=>[...current,...update]
    }),
    summary:Annotation<string[]>({
        default:()=>[],
        reducer:(current,update)=>[...current,...update]
    })
})

const graph=new StateGraph(messagesAnnotation)
.addNode('planner',(state)=>(new Command({
        goto:state.topics.map((topic:string)=>new Send('summerize',{topic}))
    })
),{
    ends:['summerize']
})
.addNode('summerize',(state:{topic:string})=>({summary:[`summary of ${state.topic}`]}))
.addEdge(START,'planner')
.addEdge('summerize',END)

const graphApp=graph.compile()

const res=await graphApp.invoke({topics:['hahah','lol','krish']})

console.log(res)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))