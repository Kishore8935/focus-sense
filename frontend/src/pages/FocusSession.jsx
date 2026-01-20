import { useEffect, useRef, useState } from "react";
import { FaceDetection } from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
import Timer from "../components/Timer";
import FocusStatus from "../components/FocusStatus";
import Toast from "../components/Toast";
import { useNavigate, useSearchParams } from "react-router-dom";

import { FaceMesh } from "@mediapipe/face_mesh";


export default function FocusSession() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const cameraRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const stateBufferRef = useRef([]);
  const BUFFER_SIZE = 10; // Increased for more stable detection (reduces jittery changes)

  const [status, setStatus] = useState("away");
  const [sessionId, setSessionId] = useState(null);
  const [ending, setEnding] = useState(false);

  const [searchParams] = useSearchParams();
  const paramSessionId = searchParams.get("sessionId");

  const [time, setTime] = useState({
    focused: 0,
    distracted: 0,
    away: 0
  });
  const [distractedStreak, setDistractedStreak] = useState(0);
  const [alertShown, setAlertShown] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [cameraRetry, setCameraRetry] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const canvasRef = useRef(null);
  const faceMeshRef = useRef(null);

  // Timer logic (unchanged)
  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(() => {
      // Update UI timer
      setTime(prev => ({
        ...prev,
        [status]: prev[status] + 1
      }));

      // Update distracted streak
      if (status === "distracted") {
        setDistractedStreak(prev => prev + 1);
      } else {
        setDistractedStreak(0);
        setAlertShown(false);
      }

      // Send batch update to backend
      fetch("http://localhost:5000/api/session/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          focused: status === "focused" ? 1 : 0,
          distracted: status === "distracted" ? 1 : 0,
          away: status === "away" ? 1 : 0
        })
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionId, status]);


  // Alert logic
  useEffect(() => {
    const ALERT_THRESHOLD = 20;

    if (distractedStreak >= ALERT_THRESHOLD && !alertShown) {
      setShowToast(true);
      setAlertShown(true);

      const audio = new Audio("/alert.mp3");
      audio.play().catch(() => { });
    }
  }, [distractedStreak, alertShown]);



  // Initialize FaceMesh
  useEffect(() => {
    if (faceMeshRef.current) return; // Already initialized

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      selfieMode: true,
      minDetectionConfidence: 0.35,
      minTrackingConfidence: 0.5
    });

    faceMesh.onResults((results) => {
      let newState = "away";
      const landmarks = results.multiFaceLandmarks && results.multiFaceLandmarks[0];

      // If no face detected at all, user is away
      if (!landmarks) {
        setFaceDetected(false);
        newState = "away";
      } else {
        // Face is detected - determine if focused or distracted
        setFaceDetected(true);

        // Key landmarks for head pose estimation
        // Using reliable MediaPipe FaceMesh landmark indices
        const noseTip = landmarks[1];
        const leftEyeInner = landmarks[133];   // Left eye inner corner
        const rightEyeInner = landmarks[362];  // Right eye inner corner
        const leftEyeOuter = landmarks[33];    // Left eye outer corner
        const rightEyeOuter = landmarks[263];  // Right eye outer corner
        const leftMouth = landmarks[61];       // Left mouth corner
        const rightMouth = landmarks[291];     // Right mouth corner
        const chin = landmarks[18];            // Chin center
        const forehead = landmarks[10];        // Forehead center

        // Calculate eye midpoint (using inner corners for better stability)
        const eyeMidX = (leftEyeInner.x + rightEyeInner.x) / 2;
        const eyeMidY = (leftEyeInner.y + rightEyeInner.y) / 2;

        // Calculate eye width for normalization
        const eyeWidth = Math.abs(rightEyeInner.x - leftEyeInner.x);

        // Calculate mouth midpoint
        const mouthMidX = (leftMouth.x + rightMouth.x) / 2;
        const mouthMidY = (leftMouth.y + rightMouth.y) / 2;

        // Calculate face center (vertical midpoint between eyes and mouth)
        const faceCenterY = (eyeMidY + mouthMidY) / 2;
        const faceCenterX = (eyeMidX + mouthMidX) / 2;

        // 1. Check horizontal head rotation (left/right turn)
        // Normalize by eye width to account for different face sizes/distances
        const horizontalOffset = (noseTip.x - eyeMidX) / (eyeWidth || 0.1);
        const horizontalDeviation = Math.abs(horizontalOffset);

        // 2. Check vertical head rotation (looking up/down or slouching)
        // Normalize by face height (eye to mouth distance)
        const faceHeight = Math.abs(mouthMidY - eyeMidY) || 0.1;
        const verticalOffset = (noseTip.y - faceCenterY) / faceHeight;
        const verticalDeviation = Math.abs(verticalOffset);

        // 3. Check if head is tilted significantly (rotation around vertical axis)
        // Compare alignment of eyes and mouth
        const eyeLineAngle = Math.atan2(
          rightEyeInner.y - leftEyeInner.y,
          rightEyeInner.x - leftEyeInner.x
        ) * (180 / Math.PI);
        const mouthLineAngle = Math.atan2(
          rightMouth.y - leftMouth.y,
          rightMouth.x - leftMouth.x
        ) * (180 / Math.PI);
        const headTilt = Math.abs(eyeLineAngle - mouthLineAngle);

        // 4. Check if face is too turned away (using eye-to-mouth width ratio)
        const mouthWidth = Math.abs(rightMouth.x - leftMouth.x);
        const widthRatio = eyeWidth > 0 ? mouthWidth / eyeWidth : 1;
        // When head is turned, mouth appears narrower than eyes (perspective)

        // Thresholds for "focused" state (looking straight at screen)
        // Made more lenient to allow natural head movements - only detect significant turns as distracted
        const HORIZONTAL_THRESHOLD = 0.25;   // Allow moderate left/right head movement (increased from 0.12)
        const VERTICAL_THRESHOLD = 0.25;     // Allow moderate up/down head movement (increased from 0.15)
        const HEAD_TILT_THRESHOLD = 15;      // Allow up to 15 degrees of head tilt (increased from 8)
        const FACE_TURN_THRESHOLD = 0.6;     // Face can be somewhat turned but still facing camera (relaxed from 0.75)

        // Determine if looking straight (focused) or turned (distracted)
        // Only mark as distracted if head movement is SIGNIFICANT
        const isLookingStraight =
          horizontalDeviation < HORIZONTAL_THRESHOLD &&
          verticalDeviation < VERTICAL_THRESHOLD &&
          headTilt < HEAD_TILT_THRESHOLD &&
          widthRatio > FACE_TURN_THRESHOLD;  // Face should face camera (not turned away)

        // Additional check: even if thresholds are slightly exceeded, 
        // if the deviation is minor, still consider it focused
        const isMinorDeviation =
          horizontalDeviation < HORIZONTAL_THRESHOLD * 1.3 &&  // 30% more lenient
          verticalDeviation < VERTICAL_THRESHOLD * 1.3 &&
          widthRatio > FACE_TURN_THRESHOLD * 0.9; // 10% more lenient for face turn

        // Use the more lenient check for final determination
        const finalIsFocused = isLookingStraight || isMinorDeviation;

        // State determination with priority:
        // 1. Away (no face)
        // 2. Distracted (head turned)
        // 3. Focused (head forward)
        if (finalIsFocused) {
          newState = "focused";
        } else {
          // Face is detected but head is significantly turned, slouching, or tilted away
          newState = "distracted";
        }
      }

      // Smoothing buffer
      const buffer = stateBufferRef.current;
      buffer.push(newState);
      if (buffer.length > BUFFER_SIZE) buffer.shift();

      const counts = buffer.reduce((acc, s) => {
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      }, {});

      const smoothed = Object.keys(counts).reduce((a, b) =>
        counts[a] > counts[b] ? a : b
      );

      setStatus(smoothed);

      // Draw landmarks on canvas for debugging (hidden)
      const canvas = canvasRef.current;
      const videoEl = videoRef.current;
      if (canvas && videoEl && videoEl.videoWidth > 0) {
        const ctx = canvas.getContext("2d");
        const w = videoEl.videoWidth;
        const h = videoEl.videoHeight;
        canvas.width = w;
        canvas.height = h;
        ctx.clearRect(0, 0, w, h);

        if (landmarks) {
          ctx.fillStyle = "rgba(0,255,0,0.9)";
          for (const pt of landmarks) {
            ctx.fillRect(pt.x * w - 2, pt.y * h - 2, 4, 4);
          }
        }
      }
    });

    faceMeshRef.current = faceMesh;
  }, []);

  // Camera initialization with explicit permission request
  useEffect(() => {
    if (!videoRef.current || !faceMeshRef.current) return;

    const video = videoRef.current;
    let cancelled = false;

    const requestCameraPermission = async () => {
      try {
        // Check if browser supports mediaDevices API
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Your browser doesn't support camera access. Please use a modern browser like Chrome, Firefox, or Edge.");
        }

        // Explicitly request camera permission first
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          },
          audio: false
        });

        // Set the stream to the video element
        video.srcObject = stream;
        mediaStreamRef.current = stream;

        // Wait for video to be ready
        await new Promise((resolve, reject) => {
          video.onloadedmetadata = () => {
            video.play()
              .then(resolve)
              .catch(reject);
          };
          video.onerror = reject;
        });

        setPermissionRequested(true);

        // Now initialize MediaPipe Camera
        if (cancelled) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        const camera = new Camera(video, {
          onFrame: async () => {
            if (cancelled || video.videoWidth === 0 || video.videoHeight === 0) return;
            try {
              await faceMeshRef.current.send({ image: video });
            } catch (err) {
              console.error("FaceMesh processing error:", err);
            }
          },
          width: 640,
          height: 480
        });

        cameraRef.current = camera;
        camera.start();

        // Wait for frames
        const waitForFrame = () =>
          new Promise((resolve, reject) => {
            const start = Date.now();
            const check = () => {
              if (video.videoWidth > 0 && video.videoHeight > 0) {
                resolve();
              } else if (Date.now() - start > 5000) {
                reject(new Error("Timeout waiting for video frames"));
              } else {
                setTimeout(check, 100);
              }
            };
            check();
          });

        await waitForFrame();

        if (!cancelled) {
          setCameraStarted(true);
          setCameraError(null);
        }
      } catch (err) {
        console.error("Camera initialization error:", err);
        if (!cancelled) {
          let errorMessage = "Failed to access camera";

          if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
            errorMessage = "Camera permission denied. Please allow camera access and try again.";
          } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
            errorMessage = "No camera found. Please connect a camera and try again.";
          } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
            errorMessage = "Camera is already in use by another application.";
          } else if (err.name === "OverconstrainedError" || err.name === "ConstraintNotSatisfiedError") {
            errorMessage = "Camera doesn't support the required settings.";
          } else if (err.message) {
            errorMessage = err.message;
          }

          setCameraError(errorMessage);
          setCameraStarted(false);
        }
      }
    };

    requestCameraPermission();

    return () => {
      cancelled = true;
      // Cleanup camera resources
      try {
        cameraRef.current?.stop();
      } catch (e) {
        console.warn("Error stopping camera:", e);
      }

      try {
        const stream = mediaStreamRef.current || video.srcObject;
        if (stream && stream.getTracks) {
          stream.getTracks().forEach((track) => {
            try {
              track.stop();
            } catch (e) {
              console.warn("Error stopping track:", e);
            }
          });
        }
      } catch (e) {
        console.warn("Error cleaning up stream:", e);
      }

      try {
        if (video) {
          video.srcObject = null;
          video.pause();
        }
      } catch (e) {
        console.warn("Error cleaning up video:", e);
      }

      cameraRef.current = null;
      mediaStreamRef.current = null;
      setCameraStarted(false);
      setFaceDetected(false);
    };
  }, [cameraRetry]);

  useEffect(() => {
    if (paramSessionId) setSessionId(paramSessionId);
  }, [paramSessionId]);


  // Start session fallback (if user opened /session directly)
  const handleStart = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/session/start", {
        method: "POST"
      });
      const data = await res.json();
      setSessionId(data._id);
      navigate(`/session?sessionId=${data._id}`, { replace: true });
    } catch (e) {
      // ignore for now; user can retry
    }
  };

  // End session triggered by user
  const stopCamera = () => {
    try {
      cameraRef.current?.stop();
    } catch (e) { }

    try {
      const stream = videoRef.current?.srcObject || mediaStreamRef.current;
      if (stream && stream.getTracks) {
        stream.getTracks().forEach((t) => {
          try { t.stop(); } catch (e) { }
        });
      }
    } catch (e) { }

    try {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.pause();
      }
    } catch (e) { }

    cameraRef.current = null;
    mediaStreamRef.current = null;
    setCameraStarted(false);
    setFaceDetected(false);
  };

  const handleEnd = async () => {
    if (!sessionId || ending) return;
    setEnding(true);

    try {
      const res = await fetch("http://localhost:5000/api/session/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      });
      const data = await res.json();

      // stop camera before navigating away
      try { stopCamera(); } catch (e) { }

      // navigate to summary with session id
      navigate(`/summary?sessionId=${sessionId}`);
    } catch (e) {
      // even on error, stop camera and navigate so user can see something
      try { stopCamera(); } catch (e) { }
      navigate(`/summary?sessionId=${sessionId}`);
    } finally {
      setEnding(false);
      setSessionId(null);
    }
  };

  // Snapshot for debugging — draw current video frame to the canvas
  const handleSnapshot = () => {
    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c) return;
    if (v.videoWidth === 0 || v.videoHeight === 0) {
      setCameraError("No video frames available to snapshot");
      return;
    }
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d");
    ctx.drawImage(v, 0, 0, c.width, c.height);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-4xl font-bold mb-2 gradient-text">Focus Session</h2>
          <p className="text-gray-400">Stay focused and track your productivity</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 animate-slide-up">
          {/* Webcam */}
          <div className="glass p-6 rounded-2xl border-2 border-gray-700 hover:border-gray-600 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center space-x-2">
                <span>📹</span>
                <span>Webcam Preview</span>
              </h3>
              {cameraStarted && (
                <div className={`flex items-center space-x-2 ${faceDetected ? "text-green-400" : "text-yellow-400"}`}>
                  <div className={`w-2 h-2 rounded-full ${faceDetected ? "bg-green-400 animate-pulse" : "bg-yellow-400"}`}></div>
                  <span className="text-sm">{faceDetected ? "Face Detected" : "Searching..."}</span>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="relative rounded-xl overflow-hidden bg-black shadow-2xl border-2 border-gray-700">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-auto max-h-96 object-cover"
                />

                {/* Loading overlay */}
                {!cameraStarted && !cameraError && (
                  <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="text-gray-400">Starting camera...</p>
                    </div>
                  </div>
                )}

                {/* Error overlay */}
                {cameraError && (
                  <div className="absolute inset-0 bg-red-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-10">
                    <div className="text-center max-w-md">
                      <div className="text-4xl mb-2">⚠️</div>
                      <p className="text-red-400 mb-2 font-semibold">{cameraError}</p>
                      {cameraError.includes("permission") && (
                        <p className="text-sm text-gray-300 mb-4">
                          Click the lock icon in your browser's address bar to manage camera permissions.
                        </p>
                      )}
                      <button
                        onClick={() => {
                          setCameraError(null);
                          setCameraRetry((n) => n + 1);
                        }}
                        className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-semibold transition-colors"
                      >
                        🔄 Retry Camera
                      </button>
                    </div>
                  </div>
                )}

                {/* Permission prompt overlay */}
                {!permissionRequested && !cameraStarted && !cameraError && (
                  <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-10">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📹</div>
                      <p className="text-gray-300 mb-4">Requesting camera access...</p>
                      <p className="text-sm text-gray-400">Please allow camera access when prompted</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Landmarks overlay canvas (hidden by default, can be toggled) */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Camera controls */}
              {cameraStarted && (
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={handleSnapshot}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    📸 Snapshot
                  </button>
                  <button
                    onClick={() => {
                      setCameraError(null);
                      setCameraRetry((n) => n + 1);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    🔄 Refresh
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Status & Timer */}
          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl border-2 border-gray-700">
              <FocusStatus status={status} />
              <Timer {...time} />
            </div>

            {/* Session controls */}
            <div className="glass p-6 rounded-2xl border-2 border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Session Controls</h3>
              {!sessionId ? (
                <button
                  onClick={handleStart}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 px-6 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>▶</span>
                  <span>Start Session</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-green-400 mb-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Session Active</span>
                  </div>
                  <button
                    onClick={handleEnd}
                    disabled={ending}
                    className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:from-red-700 disabled:to-rose-700 px-6 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-red-500/50 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    {ending ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Ending...</span>
                      </>
                    ) : (
                      <>
                        <span>⏹</span>
                        <span>End Session</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <Toast
          message="You've been distracted for a while. Let's get back on track."
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
