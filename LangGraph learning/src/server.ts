import express from 'express'
import {START,END,StateGraph,Annotation,Send,Command} from '@langchain/langgraph'
import {initChatModel,createAgent,HumanMessage} from 'langchain'

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

const model=await initChatModel('lfm2.5:8b',{modelProvider:'ollama'})

const summaryAgent=createAgent({
    model,
    systemPrompt:'You will recieve a topic and you have to summarize that topic in 2 lines.',
})

const graph=new StateGraph(messagesAnnotation)
.addNode('planner',(state)=>(new Command({
        goto:state.topics.map((topic:string)=>new Send('summerize',{topic}))
    })
),{
    ends:['summerize']
})
.addNode('summerize',async (state:{topic:string})=>{
    const res=await summaryAgent.invoke({messages:[new HumanMessage(state.topic)]})
    return {summary:[res.messages[res.messages.length-1]?.content]}
})
.addNode('merge',(state)=>{console.log(state.summary);return{}})
.addEdge(START,'planner')
.addEdge('summerize','merge')
.addEdge('merge',END)

const graphApp=graph.compile()

const res=await graphApp.invoke({topics:['MERN stack','React.js','Node.js']})

console.log(res)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))