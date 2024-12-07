import { motion } from 'framer-motion'
import { ScrollAnimationWrapper } from './scrollAnimationWrape'
import { Star } from 'lucide-react'

export const FeedbackStats = () => {
    return (
        <ScrollAnimationWrapper>
            <motion.div 
                className="bg-blue-50 rounded-2xl p-8 mt-12 max-w-4xl mx-auto"
                whileHover={{ scale: 1.02 }}
            >
                <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div>
                        <motion.div 
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="text-4xl font-bold text-blue-800 mb-3"
                        >
                            4.8/5
                        </motion.div>
                        <div className="flex justify-center text-yellow-500 mb-2">
                            {[1,2,3,4,5].map((_, index) => (
                                <Star key={index} fill="currentColor" size={24} />
                            ))}
                        </div>
                        <p className="text-blue-600">
                            Average User Satisfaction
                        </p>
                    </div>

                    <div>
                        <motion.div 
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="text-4xl font-bold text-blue-800 mb-3"
                        >
                            +5000
                        </motion.div>
                        <p className="text-blue-600">
                            Total Feedback Received
                        </p>
                    </div>

                    <div>
                        <motion.div 
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="text-4xl font-bold text-blue-800 mb-3"
                        >
                            95%
                        </motion.div>
                        <p className="text-blue-600">
                            Feedback Addressed
                        </p>
                    </div>
                </div>
            </motion.div>
        </ScrollAnimationWrapper>
    )
}
