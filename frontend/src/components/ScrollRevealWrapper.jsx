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
      el.style.transitionDelay = el.classList.contains("gallery-tile")
        ? "0ms"
        : `${Math.min((index % 6) * 70, 350)}ms`
    })

    const galleryElements = elements.filter((el) => el.classList.contains("gallery-tile"))

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.top <= window.innerHeight * 0.9) {
        el.classList.add("reveal-visible")
      }
    })

    const updateGalleryProgress = () => {
      const viewportCenter = window.innerHeight / 2
      const activationRange = Math.max(window.innerHeight * 0.34, 220)

      galleryElements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const elementCenter = rect.top + rect.height / 2
        const distance = Math.abs(elementCenter - viewportCenter)
        const progress = Math.max(0, Math.min(1, 1 - distance / activationRange))
        el.style.setProperty("--reveal-progress", progress.toFixed(3))

        if (progress > 0.02) {
          el.classList.add("reveal-visible")
        } else {
          el.classList.remove("reveal-visible")
        }
      })
    }

    updateGalleryProgress()
    window.addEventListener("scroll", updateGalleryProgress, { passive: true })
    window.addEventListener("resize", updateGalleryProgress)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible")
          } else {
            entry.target.classList.remove("reveal-visible")
          }
        })
      },
      {
        threshold: [0, 0.12],
        rootMargin: "0px 0px -4% 0px",
      }
    )

    elements
      .filter((el) => !el.classList.contains("gallery-tile"))
      .forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", updateGalleryProgress)
      window.removeEventListener("resize", updateGalleryProgress)
    }
  }, [pathname])

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  )
}
