import { useEffect, useRef, useState } from "react";
import {FaceLandmarker,FilesetResolver} from '@mediapipe/tasks-vision'

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function setupCamera() {
      try {
        const vision=await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm")
        const faceLandmarker = await FaceLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath: "/models/face_landmarker.task"
          },
          runningMode:"VIDEO"
        });
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (!videoRef.current) return;

        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener("loadeddata", () => {
          function recogniseFace(){
            const result = faceLandmarker.detectForVideo(
              videoRef.current!,
              performance.now()
            )
            if(result.faceLandmarks.length===0){
              console.log('No face found')
            }else{
              console.log(result.faceLandmarks[0][0])
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

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
      />
    </main>
  );
}