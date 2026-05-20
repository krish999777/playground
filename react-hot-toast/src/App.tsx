import toast,{Toaster} from 'react-hot-toast'
import {useState,useEffect} from 'react'
export default function(){
  const [error,setError]=useState<null|string>(null)
  const [loading,setLoading]=useState<boolean>(false)
  async function timeout(ms:number){
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  useEffect(()=>{
    if(loading){
      toast.loading('loading...',{id:'same'})
    }
    if(error){
      toast.error(error,{id:'same'})
    }
  },[error,loading])

  async function notify(){
    setLoading(true)
    setError(null)
    await timeout(2000)
    setLoading(false)
    toast.success('Sucess!!!',{id:'same'})
  }
  async function lol(){
    setLoading(true)
    await timeout(2000)
    setLoading(false)
    setError('This is huge error?!?!?')
  }
  return(
    <div>
      hi
      <Toaster/>
      <button onClick={notify}>Toast!!!</button>
      <button onClick={lol}>Fail!!</button>
    </div>
  )
}