"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface TypingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "saffron"
  size?: "default" | "sm" | "lg" | "icon"
  waitDuration?: number
}

const TypingText = ({ text, waitDuration = 50 }: { text: string; waitDuration?: number }) => {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, waitDuration)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, waitDuration])

  return (
    <span className="inline-flex items-center">
      {displayedText}
      {currentIndex < text.length && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1, repeat: Infinity, repeatType: "reverse" }}
          className="ml-0.5 inline-block w-0.5 h-4 bg-current"
        />
      )}
    </span>
  )
}

export function TypingButton({ text, className, variant = "default", size = "default", waitDuration, ...props }: TypingButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Reset the effect on hover if desired, or just let it play once.
  // The user wanted "text that could be typed". 
  // I'll make it type on mount, and maybe pause/restart on hover if requested later.
  
  return (
    <Button
      variant={variant as any}
      size={size}
      className={cn("relative overflow-hidden group font-bold transition-all duration-300 active:scale-95", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <TypingText text={text} waitDuration={waitDuration} />
      
      {/* Premium hover effect gradient */}
      <motion.div
        className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"
        style={{ skewX: -20 }}
      />
    </Button>
  )
}
