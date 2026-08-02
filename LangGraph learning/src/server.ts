import express from 'express'
import {START,END,StateGraph,Annotation,MemorySaver,messagesStateReducer} from '@langchain/langgraph'
import {initChatModel,SystemMessage,HumanMessage} from 'langchain'
import type {BaseMessage} from 'langchain'

const app=express()

const model=await initChatModel('lfm2.5:8b',{
    modelProvider:'ollama'
})

const checkpointer=new MemorySaver()

const messagesAnnotation=Annotation.Root({
    messages:Annotation<BaseMessage[]>({
        reducer:messagesStateReducer,
        default:()=>[new SystemMessage('You are helpful assistant and you have to respond in one line')]
    }),
    question:Annotation<string>()
})

const graph=new StateGraph(messagesAnnotation)
.addNode('getResponse',async (state)=>{
    const humanMessage=new HumanMessage(state.question)
    const res=await model.invoke([...state.messages,humanMessage])
    return {messages:[humanMessage,res]}
})
.addEdge(START,'getResponse')
.addConditionalEdges('getResponse',(state)=>(state.messages[state.messages.length-1]!).content.split(' ').length>20?'getResponse':END)

const graphApp=graph.compile({checkpointer})

const res=await graphApp.invoke({question:'My name is krish,What is the MERN stack'},{
    configurable:{thread_id:'ABC'}
})

const res2=await graphApp.invoke({question:'What is my name'},{
    configurable:{thread_id:'ABC'}
})
console.log(res2.messages,res2.question)

const PORT=8000
app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))