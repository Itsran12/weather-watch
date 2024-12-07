import { Check, Star } from "lucide-react"
import { ScrollAnimationWrapper } from "../util/scrollAnimationWrape"
import { FeedbackForm } from "../util/feedback"
import { FeedbackStats } from "../util/feedbackStats"
import { motion } from 'framer-motion'
import { features } from "../util/features"
import { additionalFeatures } from "../util/additionalFeatures"
import { testimonials } from "../util/testimonials"

const Feature = () => {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-white py-16 overflow-hidden">
            <div className="container mx-auto px-4">
            
                <ScrollAnimationWrapper>
                    <div className="text-center mb-16">
                        <motion.h1 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ 
                                type: "spring", 
                                stiffness: 100,
                                duration: 0.8 
                            }}
                            className="text-5xl font-extrabold text-blue-900 mb-6"
                        >
                            WeatherPro
                        </motion.h1>
                        <p className="text-xl text-blue-700 max-w-2xl mx-auto">
                            The most advanced technology for the most accurate weather information
                        </p>
                    </div>
                </ScrollAnimationWrapper>

                <ScrollAnimationWrapper delay={0.2}>
                    <div className="grid md:grid-cols-4 gap-6 mb-16">
                        {features.map((feature, index) => (
                            <motion.div 
                                key={index}
                                whileHover={{ 
                                    scale: 1.05,
                                    rotate: 2,
                                    transition: { duration: 0.3 }
                                }}
                                className={`${feature.color} ${feature.hoverColor} 
                                p-6 rounded-2xl text-center 
                                transform transition duration-300 
                                hover:shadow-2xl`}
                            >
                                <div className="flex justify-center mb-4">{feature.icon}</div>
                                <h4 className="text-xl font-bold text-blue-800 mb-3">
                                    {feature.title}
                                </h4>
                                <p className="text-blue-600">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </ScrollAnimationWrapper>

                <ScrollAnimationWrapper delay={0.3}>
                    <div className="bg-white shadow-lg rounded-2xl p-8 mt-12">
                        <div className="grid md:grid-cols-3 gap-6">
                            {additionalFeatures.map((feature, index) => (
                                <motion.div 
                                    key={index} 
                                    whileHover={{ 
                                        scale: 1.05,
                                        transition: { duration: 0.3 }
                                    }}
                                    className="flex items-center space-x-4 bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition"
                                >
                                    <div>{feature.icon}</div>
                                    <div>
                                        <h5 className="font-bold text-blue-800">{feature.title}</h5>
                                        <p className="text-blue-600 text-sm">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </ScrollAnimationWrapper>

                <ScrollAnimationWrapper delay={0.4}>
                    <div className="bg-white shadow-lg rounded-2xl p-12">
                        <h3 className="text-3xl font-bold text-center text-blue-900 mb-12">
                            User Experiences
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ 
                                        scale: 1.05,
                                        transition: { duration: 0.3 }
                                    }}
                                    className="bg-blue-50 p-6 rounded-2xl hover:shadow-xl transition"
                                >
                                    <div className="flex items-center mb-4">
                                        <img 
                                            src={testimonial.avatar} 
                                            alt={testimonial.name} 
                                            className="w-16 h-16 rounded-full mr-4 object-cover"
                                        />
                                        <div>
                                            <h4 className="font-bold text-blue-900">
                                                {testimonial.name}
                                            </h4>
                                            <p className="text-blue-600">
                                                {testimonial.profession}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-500 mb-3">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} fill="currentColor" />
                                        ))}
                                    </div>
                                    <p className="text-blue-700 italic">
                                        "{testimonial.quote}"
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </ScrollAnimationWrapper>

                <ScrollAnimationWrapper delay={0.6}>
                    <motion.div 
                        className="mt-16 text-center bg-blue-100 p-12 rounded-2xl"
                        whileHover={{
                            scale: 1.02,
                            transition: { duration: 0.3 }
                        }}
                    >
                        <h3 className="text-4xl font-bold text-blue-900 mb-6">
                            Join Now!
                        </h3>
                        <motion.button
                            whileHover={{ 
                                scale: 1.1,
                                rotate: 3,
                                transition: { duration: 0.2 }
                            }}
                            className="bg-blue-600 text-white px-10 py-4 
                            rounded-full hover:bg-blue-700 
                            transition duration-300 
                            flex items-center mx-auto space-x-3"
                        >
                            <Check />
                            <span>Get the Free App</span>
                        </motion.button>
                    </motion.div>
                </ScrollAnimationWrapper>
                <FeedbackStats/>
                <FeedbackForm />
            </div>
        </div>
    )
}

export default Feature
