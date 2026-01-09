// components/SmoothScrollProvider.jsx
'use client'

import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'

export default function SmoothScrollProvider({ children }) {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
    
    // Check if ScrollSmoother already exists to avoid duplicates
    if (!ScrollSmoother.get()) {
      ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.2,
        effects: true,
        normalizeScroll: true,
        ignoreMobileResize: true,
      })
    }

    return () => {
      ScrollSmoother.get()?.kill()
    }
  }, [])

  return children
}