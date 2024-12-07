import { Thermometer, Wind, Droplet, Cloud } from "lucide-react"

export const features = [
    {
        icon: <Thermometer size={48} className="text-blue-500" />,
        title: 'Accurate Temperature Information',
        description: 'Monitor real-time temperature with high precision.',
        color: 'bg-blue-50',
        hoverColor: 'hover:bg-blue-100'
    },
    {
        icon: <Wind size={48} className="text-green-500" />,
        title: 'Wind Speed Analysis',
        description: 'Comprehensive detection of wind movements.',
        color: 'bg-green-50',
        hoverColor: 'hover:bg-green-100'
    },
    {
        icon: <Droplet size={48} className="text-indigo-500" />,
        title: 'Rainfall Prediction',
        description: 'Highly accurate rainfall forecasts.',
        color: 'bg-indigo-50',
        hoverColor: 'hover:bg-indigo-100'
    },
    {
        icon: <Cloud size={48} className="text-purple-500" />,
        title: 'In-depth Weather Patterns',
        description: 'In-depth analysis of global weather patterns.',
        color: 'bg-purple-50',
        hoverColor: 'hover:bg-purple-100'
    }
]
