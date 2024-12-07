import { Link } from "react-router-dom"

const Hero = () => {
    return (
        <div className="container mx-auto px-4 py-16 flex-1 flex flex-col justify-center items-center text-center">
            <h2 className="text-5xl font-extrabold text-blue-900 mb-6">
            Monitor Weather <br /> Anywhere
            </h2>
            <p className="text-xl text-blue-700 mb-8">
            WeatherWatch provides accurate and easy-to-understand real-time weather information.
            </p>
            <div className="flex space-x-4">
            <Link to="/location" className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition duration-300">
                Start Now
            </Link >
            </div>
        </div>
    )
}

export default Hero