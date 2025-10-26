import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import UploadImage from "./components/UploadImage";
import DetectionViewer from "./components/DetectionViewer";
import DroneControls from "./components/DroneControls";

function App() {
  const [image, setImage] = useState(null);
  const [detections, setDetections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cleaningStatus, setCleaningStatus] = useState("idle");

  const handleUpload = async (imgData) => {
    console.log("🖼️ Image uploaded");
    setImage(imgData);
    setIsLoading(true);

    try {
      const base64Data = imgData.split(",")[1];

      console.log("📡 Calling Roboflow API...");
      console.log(
        "🔑 Using API Key:",
        import.meta.env.VITE_ROBOFLOW_API_KEY ? "✅ Loaded" : "❌ Missing"
      );

      const response = await axios({
        method: "POST",
        url: "https://serverless.roboflow.com/dust-detection-x0svo/1",
        params: {
          api_key: import.meta.env.VITE_ROBOFLOW_API_KEY,
        },
        data: base64Data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log("✅ API Response:", response.data);
      setDetections(response.data.predictions || []);
    } catch (error) {
      console.error("❌ Detection failed:", error);
      console.error("Error details:", error.response?.data || error.message);
      alert(
        `Detection failed: ${error.response?.data?.error || error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClean = () => {
    setCleaningStatus("cleaning");
    setTimeout(() => {
      setCleaningStatus("completed");
      setDetections([]);
      setTimeout(() => setCleaningStatus("idle"), 2000);
    }, 3000);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Optional: floating neon particles */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl font-extrabold text-cyan-400 drop-shadow-lg mb-2"
          >
            🚁 Drone Solar Panel Cleaner
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/80 text-lg tracking-wide"
          >
            AI-powered dust detection & automated cleaning simulation
          </motion.p>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            y: -5,
            boxShadow: "0 0 40px rgba(0,255,255,0.4)",
          }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_0_20px_rgba(0,255,255,0.2)] border border-cyan-500/20"
        >
          {/* Upload */}
          <UploadImage onUpload={handleUpload} isLoading={isLoading} />

          {/* Detection Viewer */}
          {image && (
            <DetectionViewer
              image={image}
              predictions={detections}
              isLoading={isLoading}
              cleaningStatus={cleaningStatus}
            />
          )}

          {/* Drone Controls */}
          <DroneControls
            onClean={handleClean}
            status={cleaningStatus}
            hasDetections={detections.length > 0}
          />
        </motion.div>
      </motion.div>

      {/* Optional floating glow elements */}
      <motion.div
        animate={{ x: [0, 20, -20, 0], y: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute w-1 h-1 bg-cyan-400 rounded-full top-10 left-10 opacity-50"
      />
      <motion.div
        animate={{ x: [0, -20, 20, 0], y: [0, -10, 10, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute w-1 h-1 bg-purple-400 rounded-full top-1/2 right-20 opacity-50"
      />
    </div>
  );
}

export default App;
