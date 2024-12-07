import React, { useState } from "react"
import { Bell, Star, Send, Globe } from "lucide-react"

export const FeedbackForm = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [rating, setRating] = useState(0)

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if (!name || !email || !message) {
            alert('Please complete all fields')
            return
        }

        console.log({ name, email, message, rating })
        
        setSubmitted(true)
        setTimeout(() => {
            setSubmitted(false)
            setName('')
            setEmail('')
            setMessage('')
            setRating(0)
        }, 3000)
    }

    return (
        <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-3xl p-10 mt-12 border-4 border-blue-100">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-blue-900 mb-4 flex items-center justify-center gap-3">
                    <Bell className="text-blue-500" />
                    Submit Your Feedback
                </h2>
                <p className="text-blue-600 max-w-md mx-auto">
                    Help us improve our services by sharing your experience
                </p>
            </div>

            {submitted ? (
                <div className="text-center py-12">
                    <Check 
                        size={72} 
                        className="mx-auto text-green-500 mb-6" 
                    />
                    <h3 className="text-2xl font-bold text-blue-900 mb-4">
                        Thank You!
                    </h3>
                    <p className="text-blue-700">
                        Your feedback means a lot to us
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center mb-6">
                        <p className="text-blue-800 mb-3">
                            How was your experience?
                        </p>
                        <div className="flex justify-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`
                                        ${rating >= star 
                                            ? 'text-yellow-500' 
                                            : 'text-gray-300'
                                        } 
                                        transition-colors duration-300
                                        hover:scale-110
                                    `}
                                >
                                    <Star 
                                        size={32} 
                                        fill={rating >= star ? 'currentColor' : 'transparent'} 
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label 
                                htmlFor="name" 
                                className="block text-sm font-medium text-blue-800 mb-2"
                            >
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 
                                focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                transition duration-300 bg-blue-50"
                            />
                        </div>

                        <div>
                            <label 
                                htmlFor="email" 
                                className="block text-sm font-medium text-blue-800 mb-2"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="email@example.com"
                                className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 
                                focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                transition duration-300 bg-blue-50"
                            />
                        </div>
                    </div>

                    <div>
                        <label 
                            htmlFor="message" 
                            className="block text-sm font-medium text-blue-800 mb-2"
                        >
                            Your Message
                        </label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            rows={5}
                            placeholder="Share your experience or suggestions"
                            className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 
                            focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                            transition duration-300 bg-blue-50"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-4 rounded-xl 
                        hover:bg-blue-700 transition duration-300 
                        flex items-center justify-center space-x-3 font-bold"
                    >
                        <Send size={20} />
                        <span>Submit Feedback</span>
                    </button>
                </form>
            )}

            <div className="mt-8 text-center border-t border-blue-100 pt-6">
                <div className="flex justify-center items-center space-x-3 text-blue-600">
                    <Globe size={20} />
                    <p className="text-sm">
                        Your data is protected and will not be shared
                    </p>
                </div>
            </div>
        </div>
    )
}
