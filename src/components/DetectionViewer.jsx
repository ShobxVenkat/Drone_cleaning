import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle } from 'lucide-react'

function DetectionViewer({ image, predictions, isLoading, cleaningStatus }) {
  const getDustLevel = () => {
    if (predictions.length === 0) return 'clean'
    const avgConfidence = predictions.reduce((acc, pred) => acc + pred.confidence, 0) / predictions.length
    return avgConfidence > 0.7 ? 'high' : 'moderate'
  }

  const dustLevel = getDustLevel()

  // -----------------------------
  // Drone Animation Logic
  // -----------------------------
  const [currentTarget, setCurrentTarget] = useState(-1)

  useEffect(() => {
    if (cleaningStatus === 'cleaning' && predictions.length > 0) {
      let i = 0
      const interval = setInterval(() => {
        setCurrentTarget(i)
        i++
        if (i >= predictions.length) clearInterval(interval)
      }, 1000) // 1s per detection
      return () => clearInterval(interval)
    } else {
      setCurrentTarget(-1)
    }
  }, [cleaningStatus, predictions])

  const target = predictions[currentTarget] || { x: 0, y: 0 }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 relative">
      {/* Status Indicator */}
      <AnimatePresence>
        {predictions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center justify-center gap-2 p-3 rounded-lg mb-4 ${
              dustLevel === 'high' ? 'bg-red-500/20 text-red-200' : 'bg-yellow-500/20 text-yellow-200'
            }`}
          >
            {dustLevel === 'high' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span className="font-semibold">
              {predictions.length} dust spot(s) detected - {dustLevel.toUpperCase()} level
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image with Detections */}
      <div className="relative rounded-xl overflow-hidden bg-black/20">
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
            />
          </div>
        )}

        <img src={image} alt="Solar panel detection" className="w-full max-h-96 object-contain" />

        {/* Bounding Boxes */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {predictions.map((prediction, index) => (
            <motion.rect
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              x={prediction.x - prediction.width / 2}
              y={prediction.y - prediction.height / 2}
              width={prediction.width}
              height={prediction.height}
              stroke={prediction.confidence > 0.7 ? '#ef4444' : '#f59e0b'}
              strokeWidth="2"
              fill="transparent"
              rx="4"
            />
          ))}
        </svg>

        {/* Detection Labels */}
        {predictions.map((prediction, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="absolute px-2 py-1 text-xs font-semibold text-white rounded-md"
            style={{
              left: `${prediction.x - prediction.width / 2}px`,
              top: `${prediction.y - prediction.height / 2 - 25}px`,
              backgroundColor: prediction.confidence > 0.7 ? '#ef4444' : '#f59e0b'
            }}
          >
            {Math.round(prediction.confidence * 100)}%
          </motion.div>
        ))}

        {/* Drone Animation */}
        {currentTarget >= 0 && (
          <motion.div
            className="absolute text-4xl"
            animate={{ x: target.x - 16, y: target.y - 32 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            🚁
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default DetectionViewer
