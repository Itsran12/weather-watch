import { Radar, MapPin, Smartphone } from "lucide-react"

export const additionalFeatures = [
    {
        icon: <Radar size={32} className="text-orange-500" />,
        title: 'Advanced Weather Radar',
        description: 'The latest radar technology for weather monitoring.'
    },
    {
        icon: <MapPin size={32} className="text-red-500" />,
        title: 'Precise Location',
        description: 'Accurate location with state-of-the-art GPS technology.'
    },
    {
        icon: <Smartphone size={32} className="text-teal-500" />,
        title: 'Instant Notifications',
        description: 'Weather alerts delivered straight to your phone.'
    }
]
