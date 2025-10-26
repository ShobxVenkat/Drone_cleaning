import { motion, AnimatePresence } from 'framer-motion'
import { Play, Square, CheckCircle, Wind } from 'lucide-react'

function DroneControls({ onClean, status, hasDetections }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'cleaning':
        return {
          icon: Wind,
          text: 'Drone Cleaning in Progress...',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/20 backdrop-blur-md',
          buttonText: 'Stop Cleaning',
          buttonIcon: Square,
          buttonVariant: 'bg-red-500 hover:bg-red-600 shadow-red-400/50'
        }
      case 'completed':
        return {
          icon: CheckCircle,
          text: 'Cleaning Completed!',
          color: 'text-green-400',
          bgColor: 'bg-green-500/20 backdrop-blur-md',
          buttonText: 'Start New Cleaning',
          buttonIcon: Play,
          buttonVariant: 'bg-green-500 hover:bg-green-600 shadow-green-400/50'
        }
      default:
        return {
          icon: Play,
          text: 'Ready for Cleaning',
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/20 backdrop-blur-md',
          buttonText: 'Start Cleaning',
          buttonIcon: Play,
          buttonVariant: 'bg-emerald-500 hover:bg-emerald-600 shadow-cyan-400/50'
        }
    }
  }

  const config = getStatusConfig()
  const StatusIcon = config.icon
  const ButtonIcon = config.buttonIcon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <AnimatePresence>
        {status === 'cleaning' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center mb-4"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.15, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-6xl text-cyan-400 drop-shadow-lg"
            >
              🚁
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`flex items-center justify-center gap-3 p-4 rounded-lg mb-4 ${config.bgColor} shadow-lg`}>
        <StatusIcon className={`w-6 h-6 ${config.color} drop-shadow`} />
        <span className={`font-semibold ${config.color}`}>
          {config.text}
        </span>
      </div>

      <motion.button
        whileHover={{ scale: hasDetections ? 1.07 : 1, boxShadow: hasDetections ? '0 0 20px rgba(0,255,255,0.5)' : '' }}
        whileTap={{ scale: hasDetections ? 0.95 : 1 }}
        onClick={onClean}
        disabled={!hasDetections && status === 'idle'}
        className={`flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 mx-auto ${
          hasDetections || status !== 'idle' 
            ? `${config.buttonVariant} shadow-lg`
            : 'bg-gray-400 cursor-not-allowed shadow-inner'
        }`}
      >
        <ButtonIcon className="w-5 h-5" />
        {config.buttonText}
      </motion.button>

      {!hasDetections && status === 'idle' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/60 text-sm mt-3"
        >
          Upload an image with dust detection to enable cleaning
        </motion.p>
      )}
    </motion.div>
  )
}

export default DroneControls
