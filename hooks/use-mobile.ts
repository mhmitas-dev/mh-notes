"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0
      const userAgent = navigator.userAgent.toLowerCase()

      // Check for mobile user agents
      const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)

      // Consider it mobile if:
      // 1. Width is less than 1024px, OR
      // 2. It's a touch device with width less than 1280px, OR
      // 3. It has a mobile user agent, OR
      // 4. It's in portrait mode with small width
      const isPortrait = height > width
      const isMobileWidth = width < 1024
      const isTouchMobile = isTouchDevice && width < 1280
      const isSmallPortrait = isPortrait && width < 768

      setIsMobile(isMobileWidth || isTouchMobile || isMobileUserAgent || isSmallPortrait)
    }

    // Initial check
    checkMobile()

    // Listen for resize events
    window.addEventListener("resize", checkMobile)

    // Listen for orientation changes
    window.addEventListener("orientationchange", () => {
      // Delay to allow for orientation change to complete
      setTimeout(checkMobile, 100)
    })

    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("orientationchange", checkMobile)
    }
  }, [])

  return isMobile
}
