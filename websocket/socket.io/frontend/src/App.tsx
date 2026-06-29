import { io } from "socket.io-client"
import {useState,useEffect} from 'react'

const socket=io('http://localhost:8000')
export default function App(){
  const [message,setMessage]=useState<number>(0)
  const [time,setTime]=useState<string|null>(null)

  useEffect(()=>{
    socket.on('message',(data:any)=>setMessage(data))
    socket.on('time',data=>setTime(data))
    return ()=>{
      socket.off('message')
      socket.off('time')
      socket.disconnect()
    }
  },[])
  
  return(
    <>
      <button onClick={()=>socket.emit('ping',{number:message,message:"Hhehehaw lololo"})}>Send</button>
      <div>{message}</div>
      <button onClick={()=>socket.emit('get-time')}>Get time</button>
      <div>{time}</div>
    </>
  )
}