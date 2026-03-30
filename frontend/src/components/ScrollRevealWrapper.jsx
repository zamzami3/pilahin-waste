"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export default function ScrollRevealWrapper({ children, className = "" }) {
  const rootRef = useRef(null)
  const pathname = usePathname()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const candidates = Array.from(root.querySelectorAll("section, article, [data-reveal], .reveal-item"))
    const elements = candidates.length > 0 ? candidates : Array.from(root.children)

    if (prefersReducedMotion) {
      elements.forEach((el) => el.classList.add("reveal-visible"))
      return
    }

    elements.forEach((el, index) => {
      el.classList.remove("reveal-visible")
      el.classList.add("scroll-reveal")
      el.style.transitionDelay = `${Math.min((index % 6) * 70, 350)}ms`
    })

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.top <= window.innerHeight * 0.9) {
        el.classList.add("reveal-visible")
      }
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [pathname])

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  )
}
