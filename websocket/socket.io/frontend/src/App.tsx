import { io } from "socket.io-client"
import {useState,useEffect} from 'react'

const socket=io('http://localhost:8000')
export default function App(){
  const [message,setMessage]=useState<number>(0)
  useEffect(()=>{
    socket.on('message',(data:any)=>setMessage(data))
  },[])
  
  return(
    <>
      <button onClick={()=>socket.emit('ping',{number:message,message:"Hhehehaw lololo"})}>Send</button>
      <div>{message}</div>
    </>
  )
}