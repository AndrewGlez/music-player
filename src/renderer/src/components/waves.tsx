'use client'

import { motion } from 'framer-motion'

interface WaveDotsProps {
    count?: number
    color?: string
    size?: number
    speed?: number
    maxScale?: number
}

export default function WaveDots({
    count = 3,
    color = 'bg-green-500',
    size = 10,
    speed = 1.5,
    maxScale = 1,
}: WaveDotsProps) {
    return (
        <div className="flex items-center space-x-2" role="status" aria-label="Loading">
            {[...Array(count)].map((_, i) => (
                <motion.div
                    key={i}
                    className={`rounded-full ${color}`}
                    style={{ width: size, height: size }}
                    animate={{
                        scale: [1, maxScale, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: speed,
                        repeat: Infinity,
                        delay: i * (speed / count),
                        ease: "easeInOut",
                    }}
                />
            ))}
            <span className="sr-only">Loading...</span>
        </div>
    )
}

