import { useEffect, useRef, useState } from "react";

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (!videoRef.current) return;

        videoRef.current.srcObject = stream;
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