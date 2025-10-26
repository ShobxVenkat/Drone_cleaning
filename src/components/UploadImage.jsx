import { motion } from 'framer-motion'
import { Upload, Loader } from 'lucide-react'

function UploadImage({ onUpload, isLoading }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      onUpload(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <label
        className="flex flex-col items-center justify-center w-full h-32
                   border-2 border-dashed border-cyan-400/50 rounded-xl
                   cursor-pointer bg-white/5 backdrop-blur-lg
                   hover:bg-white/10 hover:scale-105
                   transition-all duration-300 shadow-lg"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <Loader className="w-8 h-8 mb-2 text-cyan-400 animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
            >
              <Upload className="w-8 h-8 mb-2 text-cyan-400" />
            </motion.div>
          )}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-2 text-sm text-white text-center"
          >
            <span className="font-semibold">Click to upload</span> or drag and drop
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs text-white/60"
          >
            PNG, JPG, JPEG (Max: 5MB)
          </motion.p>
        </div>
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
          disabled={isLoading}
        />
      </label>
    </motion.div>
  )
}

export default UploadImage
