import { useEffect, useState, useMemo, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface FlipFadeTextProps {
    /**
     * Array of words to cycle through, or a single phrase
     * @default ["LOADING", "COMPUTING", "SEARCHING", "RETRIEVING", "ASSEMBLING"]
     */
    words?: string[]
    /**
     * Interval between word changes in milliseconds
     * @default 2500
     */
    interval?: number
    /**
     * Whether to continuously cycle through words or animate once
     * @default words.length > 1
     */
    loop?: boolean
    /**
     * Whether to force uppercase text
     * @default false
     */
    uppercase?: boolean
    /**
     * Additional CSS classes for the container
     */
    className?: string
    /**
     * Additional CSS classes for the text
     */
    textClassName?: string
    /**
     * Animation duration for each letter in seconds
     * @default 0.5
     */
    letterDuration?: number
    /**
     * Stagger delay between letters on enter in seconds
     * @default 0.05
     */
    staggerDelay?: number
    /**
     * Stagger delay between letters on exit in seconds
     * @default 0.03
     */
    exitStaggerDelay?: number
}

const defaultWords = ["LOADING", "COMPUTING", "SEARCHING", "RETRIEVING", "ASSEMBLING"]

// Memoized Letter component for performance
const Letter = memo(function Letter({
    char,
    letterDuration
}: {
    char: string
    letterDuration: number
}) {
    return (
        <motion.span
            style={{ transformStyle: "preserve-3d" }}
            variants={{
                initial: {
                    rotateX: 90,
                    y: 12,
                    opacity: 0,
                    filter: "blur(6px)",
                },
                animate: {
                    rotateX: 0,
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: {
                        duration: letterDuration,
                        ease: [0.2, 0.65, 0.3, 0.9],
                    },
                },
                exit: {
                    rotateX: -90,
                    y: -12,
                    opacity: 0,
                    filter: "blur(6px)",
                    transition: {
                        duration: letterDuration * 0.67,
                        ease: "easeIn",
                    },
                },
            }}
            className="inline-block"
        >
            {char === " " ? "\u00A0" : char}
        </motion.span>
    )
})

// Memoized Word component for performance
const Word = memo(function Word({
    text,
    staggerDelay,
    exitStaggerDelay,
    letterDuration,
    textClassName,
    uppercase
}: {
    text: string
    staggerDelay: number
    exitStaggerDelay: number
    letterDuration: number
    textClassName?: string
    uppercase?: boolean
}) {
    const displayText = uppercase ? text.toUpperCase() : text
    const letters = useMemo(() => displayText.split(""), [displayText])

    return (
        <motion.div
            className={cn(
                "inline-flex flex-wrap items-center justify-center gap-[0.02em] font-bold tracking-tight",
                uppercase && "uppercase tracking-wider",
                textClassName
            )}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
                initial: { opacity: 1 },
                animate: {
                    opacity: 1,
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
                exit: {
                    opacity: 1,
                    transition: {
                        staggerChildren: exitStaggerDelay,
                    },
                },
            }}
        >
            {letters.map((char, i) => (
                <Letter
                    key={`${char}-${i}`}
                    char={char}
                    letterDuration={letterDuration}
                />
            ))}
        </motion.div>
    )
})

export function FlipFadeText({
    words = defaultWords,
    interval = 2500,
    loop,
    uppercase = false,
    className,
    textClassName,
    letterDuration = 0.5,
    staggerDelay = 0.05,
    exitStaggerDelay = 0.03,
}: FlipFadeTextProps) {
    const [index, setIndex] = useState(0)
    const shouldLoop = loop !== undefined ? loop : words.length > 1

    // Memoize the interval callback
    const updateIndex = useCallback(() => {
        if (!shouldLoop) return
        setIndex((prev) => (prev + 1) % words.length)
    }, [shouldLoop, words.length])

    useEffect(() => {
        if (!shouldLoop) return
        const timer = setInterval(updateIndex, interval)
        return () => clearInterval(timer)
    }, [shouldLoop, updateIndex, interval])

    // Memoize the current word
    const currentWord = useMemo(() => words[index] || words[0] || "", [words, index])

    return (
        <div className={cn("inline-flex items-center justify-center", className)}>
            <div className="relative inline-flex items-center justify-center" style={{ perspective: "1000px" }}>
                <AnimatePresence mode="wait">
                    <Word
                        key={currentWord}
                        text={currentWord}
                        staggerDelay={staggerDelay}
                        exitStaggerDelay={exitStaggerDelay}
                        letterDuration={letterDuration}
                        textClassName={textClassName}
                        uppercase={uppercase}
                    />
                </AnimatePresence>
            </div>
        </div>
    )
}

export default FlipFadeText
