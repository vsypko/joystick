import React, { useState, useEffect, useCallback } from 'react'

interface Position {
  x: number
  y: number
}

const Joystick: React.FC = () => {
  const [position, setPosition] = useState<Position>({ x: 80, y: 80 }) // Initially centered in a 160x160 parent
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [parentRect, setParentRect] = useState<DOMRect | null>(null)

  // Return the stick to the center slowly
  const returnToCenter = useCallback(() => {
    const centerX = 80 // Center x position for a 160x160 parent
    const centerY = 80 // Center y position for a 160x160 parent

    const animateReturn = () => {
      // Calculate the difference between current position and center
      const dx = centerX - position.x
      const dy = centerY - position.y

      // Calculate distance to the center
      const distance = Math.sqrt(dx * dx + dy * dy)

      // If stick is close to the center, stop animation
      if (distance < 1) {
        setPosition({ x: centerX, y: centerY })
        return // Stop the animation
      }

      // Move towards the center at a constant speed
      const speed = 2 // You can adjust this speed value

      // Calculate the movement step
      const moveX = (dx / distance) * speed // Normalize dx to get direction
      const moveY = (dy / distance) * speed // Normalize dy to get direction

      setPosition((prev) => ({
        x: prev.x + moveX,
        y: prev.y + moveY,
      }))

      // Request the next frame
      requestAnimationFrame(animateReturn)
    }

    // Start the animation
    requestAnimationFrame(animateReturn)
  }, [position])

  // Function to handle pointer movement
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (isDragging && parentRect) {
        const stickRadius = 20 // Joystick stick has 40px size, so half is 20px
        const radius = parentRect.width / 2 // Radius of the parent (w-40 => 160px)

        // Get pointer position relative to the center of the parent div
        const newX = e.clientX - parentRect.left - radius
        const newY = e.clientY - parentRect.top - radius

        // Calculate distance from the center of the parent div
        const distanceFromCenter = Math.sqrt(newX * newX + newY * newY)

        // Update position even if the pointer is outside the parent div, but restrict movement to the boundary
        if (distanceFromCenter <= radius - stickRadius) {
          setPosition({
            x: newX + radius,
            y: newY + radius,
          })
        } else {
          // If outside the boundary, limit to the edge of the boundary
          const angle = Math.atan2(newY, newX)
          setPosition({
            x: Math.cos(angle) * (radius - stickRadius) + radius,
            y: Math.sin(angle) * (radius - stickRadius) + radius,
          })
        }
      }
    },
    [isDragging, parentRect]
  )

  // Handle pointer down to start dragging
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true)
    setParentRect(e.currentTarget.getBoundingClientRect())
  }, [])

  // Handle pointer up to stop dragging and return to center
  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
    returnToCenter()
  }, [returnToCenter])

  // Add event listeners on the window to handle pointermove and pointerup globally
  useEffect(() => {
    if (isDragging) {
      // Use the native PointerEvent type for global event listeners
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
    } else {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    // Cleanup when component unmounts or dragging stops
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [isDragging, handlePointerMove, handlePointerUp])

  return (
    <div className="relative w-40 h-40 bg-gray-200 rounded-full" onPointerDown={handlePointerDown}>
      {/* Joystick Stick */}
      <div
        className="absolute w-10 h-10 bg-blue-500 rounded-full"
        style={{
          // Translate in pixels instead of percentages
          left: `${position.x - 20}px`,
          top: `${position.y - 20}px`,
        }}
      />
    </div>
  )
}

export default Joystick
