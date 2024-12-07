import { motion, useAnimation, useInView } from 'framer-motion'
import React, { useRef } from 'react'

export const ScrollAnimationWrapper = ({ children, delay = 0 }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    const mainControls = useAnimation()

    React.useEffect(() => {
        if (isInView) {
            mainControls.start("visible")
        }
    }, [isInView])

    return (
        <div ref={ref} style={{ position: 'relative', overflow: 'hidden' }}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 75 },
                    visible: { opacity: 1, y: 0 }
                }}
                initial="hidden"
                animate={mainControls}
                transition={{ 
                    duration: 0.5, 
                    delay: delay || 0 
                }}
            >
                {children}
            </motion.div>
        </div>
    )
}