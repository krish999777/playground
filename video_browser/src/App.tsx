import { useRef,useEffect,useState } from "react"

export default function App(){
  const video=useRef<HTMLVideoElement>(null)
  const [error,setError]=useState<string|null>(null)

  useEffect(()=>{
    async function getStream(){
      try{
        const stream=await navigator.mediaDevices.getUserMedia({
          video:true,
        })
        video.current!.srcObject=stream
        console.log(video.current)
      }catch(err:any){
        setError(err?.message)
      }
    }
    getStream()
  },[])
  console.log(video.current)
  return(
    <>
      <div>{error}</div>
      <video ref={video} autoPlay playsInline />
    </>
  )
}