import { useEffect, useRef, useState } from "react";
import {FaceLandmarker,FilesetResolver} from '@mediapipe/tasks-vision'
import * as THREE from "three";

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvas=useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function setupCamera() {
      try {
        const ctx=canvas.current!.getContext('2d')
        const vision=await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm")
        const faceLandmarker = await FaceLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath: "/models/face_landmarker.task"
          },
          runningMode:"VIDEO",
          outputFacialTransformationMatrixes:true
        });
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (!videoRef.current) return;

        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener("loadeddata", () => {
          canvas.current!.width=videoRef.current!.videoWidth
          canvas.current!.height=videoRef.current!.videoHeight
          const landmarksArray=[
            FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
            FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
          ]
          function recogniseFace(){
            if(!ctx){
              return
            }
            ctx.clearRect(0,0,canvas.current!.width,canvas.current!.height)
            ctx.drawImage(videoRef.current!,0,0,canvas.current!.width,canvas.current!.height)
            const result = faceLandmarker.detectForVideo(
              videoRef.current!,
              performance.now()
            )
            if(result.faceLandmarks.length===0){
              console.log('No face found')
            }else{
              const face=result.faceLandmarks[0]
              ctx.beginPath()
              ctx.moveTo(1/3*canvas.current!.width,0)
              ctx.lineTo(1/3*canvas.current!.width,canvas.current!.height)
              ctx.stroke()
              ctx.moveTo(2/3*canvas.current!.width,0)
              ctx.lineTo(2/3*canvas.current!.width,canvas.current!.height)
              ctx.stroke()
              ctx.moveTo(0,1/3*canvas.current!.height)
              ctx.lineTo(canvas.current!.width,1/3*canvas.current!.height)
              ctx.stroke()
              ctx.moveTo(0,2/3*canvas.current!.height)
              ctx.lineTo(canvas.current!.width,2/3*canvas.current!.height)
              ctx.stroke()
              landmarksArray.forEach(landmarks=>{
                ctx.beginPath()
                landmarks.forEach(landmark=>{
                  ctx.moveTo(face[landmark.start].x*canvas.current!.width,face[landmark.start].y*canvas.current!.height)
                  ctx.lineTo(face[landmark.end].x*canvas.current!.width,face[landmark.end].y*canvas.current!.height)
                  ctx.strokeStyle='#FF0000'
                  ctx.stroke()
                })
              })
              ctx.strokeStyle='#000000'
              let minX=1,maxX=0;
              let minY=1,maxY=0;
              const matrix=(result.facialTransformationMatrixes?.[0])

              if(matrix){
                if (matrix) {
                  const m = new THREE.Matrix4()
                  m.fromArray(matrix.data)
                  
                  const euler = new THREE.Euler()
                  euler.setFromRotationMatrix(m)

                  console.log(euler.x)
                  console.log(euler.y)
                  console.log(euler.z)
                  console.log('\n')
                }
              }

              face.forEach(landmark=>{
                minX=Math.min(minX,landmark.x)
                minY=Math.min(minY,landmark.y)
                maxX=Math.max(maxX,landmark.x)
                maxY=Math.max(maxY,landmark.y)
                ctx.beginPath()
                ctx.arc(landmark.x*canvas.current!.width,landmark.y*canvas.current!.height,2,0,Math.PI*2)
                ctx.fill()
              })
              const faceWidth=maxX-minX
              const faceHeight=maxY-minY
              const centerX=(maxX+minX)/2
              const centerY=(maxY+minY)/2
              // console.log(centerX,centerY)
              ctx.beginPath()
              ctx.strokeRect(minX*canvas.current!.width,minY*canvas.current!.height,faceWidth*canvas.current!.width,faceHeight*canvas.current!.height)
              ctx.beginPath()
              ctx.moveTo(minX*canvas.current!.width,centerY*canvas.current!.height)
              ctx.lineTo(maxX*canvas.current!.width,centerY*canvas.current!.height)
              ctx.stroke()
              ctx.beginPath()
              ctx.moveTo(centerX*canvas.current!.width,minY*canvas.current!.height)
              ctx.lineTo(centerX*canvas.current!.width,maxY*canvas.current!.height)
              ctx.stroke()
            }
            requestAnimationFrame(recogniseFace)
          }
          recogniseFace()
        });
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    }

    setupCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <main>
      <h1>MediaPipe Face Landmarker</h1>

      {error && <p>{error}</p>}
      <canvas ref={canvas}/>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        hidden
      />
    </main>
  );
}