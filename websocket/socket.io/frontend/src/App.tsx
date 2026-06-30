import { io } from "socket.io-client"
import {useState,useEffect,useRef} from 'react'

const socket=io('http://localhost:8000')
export default function App(){
  const [message,setMessage]=useState<{
    from:string,
    text:string
  }|null>(null)
  const input=useRef<HTMLInputElement>(null)

  useEffect(()=>{
    socket.on('message',data=>setMessage(data))
  },[])

  function handleSubmit(e:any){
    e.preventDefault()
    const form=e.target
    const formData=new FormData(form)
    const login=formData.get('login')
    socket.emit('login',login)
  }
  
  return(
    <>
    <form onSubmit={handleSubmit}>
      <input type="radio" name="login" value="krish"/>Krish
      <input type="radio" name="login" value="alice"/>Alice
      <input type="radio" name="login" value="john"/>John
      <button>Submit</button>
    </form>
    <button onClick={()=>{
      socket.emit('select-user','krish')
    }}>Krish</button>
    <button onClick={()=>{
      socket.emit('select-user','alice')
    }}>Alice</button>
    <button onClick={()=>{
      socket.emit('select-user','john')
    }}>John</button>
      <input ref={input} type="text"/>
      <button onClick={()=>{
        const value=input?.current?.value||'This message is have an issue'
        socket.emit('message',value)
      }}>Send</button>
      {message?
        <div>
          <p>{message.from}</p>
          <p>{message.text}</p>
        </div>:null}
    </>
  )
}