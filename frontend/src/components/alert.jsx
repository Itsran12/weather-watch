import React from "react"
import { XCircle, CheckCircle } from "lucide-react"

const CardAlert = ({ type, message, onClose }) => {
  const isError = type === "error"
  const iconClass = isError ? "text-red-500" : "text-green-500"
  const title = isError ? "Terjadi Kesalahan" : "Berhasil"

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full relative text-center animate-fadeIn scale-100 transition-transform duration-500 hover:scale-105">
      <div className="flex justify-center mb-4">
        {isError ? (
          <XCircle
            size={64}
            className={`${iconClass} animate-pulse drop-shadow-lg`}
          />
        ) : (
          <CheckCircle
            size={64}
            className={`${iconClass} animate-pulse drop-shadow-lg`}
          />
        )}
      </div>

      <h2 className={`text-2xl font-extrabold ${iconClass}`}>
        {title}
      </h2>
      <p className="text-gray-600 mt-4 text-lg">{message}</p>

      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-transform duration-300 hover:scale-125"
        onClick={onClose}
      >
        ✕
      </button>
    </div>
  )
}

export default CardAlert
