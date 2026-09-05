import { useRef,useEffect,useState } from "react"

export default function App(){
  const video=useRef<HTMLVideoElement>(null)
  const recorder=useRef<MediaRecorder|null>(null)
  const [error,setError]=useState<string|null>(null)
  const [,forceRender]=useState<number>(0)
  const [camera,setCamera]=useState<boolean>(true)

  useEffect(()=>{
    const handleStart=()=>forceRender(prev=>prev+1);
    let myStream:null|MediaStream=null;
    (async ()=>{
      try{
        if(!camera){
          return
        }
        const stream=await navigator.mediaDevices.getUserMedia({
          video:true,
        })
        myStream=stream//here
        const rec=new MediaRecorder(stream)
        recorder.current=rec
        video.current!.srcObject=stream
        rec.addEventListener('start',handleStart)
        rec.addEventListener('stop',handleStart)
        handleStart()
      }catch(err:any){
        setError(err?.message)
      }
    })()
    return ()=>{
      recorder.current?.removeEventListener('start',handleStart)
      recorder.current?.removeEventListener('stop',handleStart)
      if(recorder.current?.state==='recording'){
        recorder.current.stop()
      }
      if(myStream){
        const tracks=myStream.getTracks()
        tracks.forEach(track=>{
          track.stop()
        })
        recorder.current=null
        handleStart()
      }
    }
  },[camera])
  function startRecording(){
    if(!recorder.current){
      setError('Recorder not set')
      return
    }
    recorder.current.start()
  }
  function stopRecording(){
    if(!recorder.current){
      setError('Recorder not set')
      return
    }
    if(recorder.current.state!=='recording'){
      setError('Recording not started')
      return
    }
    recorder.current.stop()
  }
  return(
    <>
      <div>{error}</div>
      {camera?<video ref={video} autoPlay playsInline />:null}
      {
        !recorder.current
        ?
        null
        :
        recorder.current.state==='recording'
        ?
        <button onClick={stopRecording}>Stop</button>
        :
        <button onClick={startRecording}>Start</button>
      }
      <button onClick={()=>setCamera(prev=>!prev)}>Turn {camera?'Off':'On'} camera</button>
    </>
  )
}