"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ArrowUpRight } from "lucide-react"

export interface Project {
  title: string
  description: string
  year: string
  link: string
  image: string
}

const defaultProjects: Project[] = [
  {
    title: "WallVibe — Wallpaper App",
    description: "Full-featured wallpaper platform with Laravel backend, Cloudinary CDN, category filters, and high-res image scaling.",
    year: "2026",
    link: "https://www.wallvibe.co.in/",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "AI Property Manager",
    description: "Real estate and tenant automation platform with predictive property analytics and maintenance tracking.",
    year: "2026",
    link: "https://github.com/vaishnavicodinghouse/ai-property-manager",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Website Tools",
    description: "Online developer suite providing SEO analyzers, JSON formatters, meta tag generators, and web utilities.",
    year: "2026",
    link: "https://free-tools-two-phi.vercel.app/",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Jarvis AI Assistant",
    description: "Voice-activated AI automation assistant with natural speech recognition, task scheduling, and system control.",
    year: "2026",
    link: "https://github.com/deeppatel8176-debug",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Sidhatva Design Studio",
    description: "Architecture & interior design showcase platform featuring interactive project galleries and bespoke aesthetics.",
    year: "2026",
    link: "https://github.com/deeppatel8176-debug",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
]

interface ProjectShowcaseProps {
  customProjects?: Project[]
}

export function ProjectShowcase({ customProjects = defaultProjects }: ProjectShowcaseProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor
    }

    const animate = () => {
      setSmoothPosition((prev) => ({
        x: lerp(prev.x, mousePosition.x, 0.15),
        y: lerp(prev.y, mousePosition.y, 0.15),
      }))
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mousePosition])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index)
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
    setIsVisible(false)
  }

  const projects = customProjects

  return (
    <section ref={containerRef} onMouseMove={handleMouseMove} className="relative w-full max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-gray-400 text-xs font-mono font-medium tracking-widest uppercase">
          SELECTED WORK
        </h2>
        <span className="text-xs text-gray-500 font-mono hidden sm:inline-block">
          (HOVER TO PREVIEW)
        </span>
      </div>

      {/* Floating Hover Image Preview (Desktop) */}
      <div
        className="pointer-events-none fixed z-50 overflow-hidden rounded-xl shadow-2xl hidden md:block"
        style={{
          left: containerRef.current?.getBoundingClientRect().left ?? 0,
          top: containerRef.current?.getBoundingClientRect().top ?? 0,
          transform: `translate3d(${smoothPosition.x + 24}px, ${smoothPosition.y - 100}px, 0)`,
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.85,
          transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), scale 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="relative w-[320px] h-[200px] bg-gray-900 border border-gray-700/60 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          {projects.map((project, index) => (
            <img
              key={project.title}
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out"
              style={{
                opacity: hoveredIndex === index ? 1 : 0,
                transform: hoveredIndex === index ? "scale(1)" : "scale(1.1)",
                filter: hoveredIndex === index ? "none" : "blur(10px)",
              }}
            />
          ))}
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-0 border-t border-gray-800">
        {projects.map((project, index) => (
          <div key={project.title}>
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="group block relative"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative py-6 border-b border-gray-800/80 transition-all duration-300 ease-out">
                {/* Background highlight on hover */}
                <div
                  className={`
                    absolute inset-0 -mx-3 px-3 bg-white/[0.03] rounded-lg
                    transition-all duration-300 ease-out
                    ${hoveredIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-95"}
                  `}
                />

                <div className="relative flex items-baseline justify-between gap-4">
                  <div className="flex-1 min-w-0 pr-4">
                    {/* Title with animated underline */}
                    <div className="inline-flex items-center gap-2">
                      <h3 className="text-white font-medium text-xl sm:text-2xl tracking-tight">
                        <span className="relative">
                          {project.title}
                          {/* Animated underline */}
                          <span
                            className={`
                              absolute left-0 -bottom-1 h-[1.5px] bg-white
                              transition-all duration-300 ease-out
                              ${hoveredIndex === index ? "w-full" : "w-0"}
                            `}
                          />
                        </span>
                      </h3>

                      {/* Arrow that slides in */}
                      <ArrowUpRight
                        className={`
                          w-5 h-5 text-gray-400 group-hover:text-white
                          transition-all duration-300 ease-out
                          ${
                            hoveredIndex === index
                              ? "opacity-100 translate-x-0 translate-y-0"
                              : "opacity-40 -translate-x-1 translate-y-1"
                          }
                        `}
                      />
                    </div>

                    {/* Description */}
                    <p
                      className={`
                        text-sm sm:text-base mt-2 leading-relaxed font-light
                        transition-all duration-300 ease-out
                        ${hoveredIndex === index ? "text-gray-200" : "text-gray-400"}
                      `}
                    >
                      {project.description}
                    </p>
                  </div>

                  {/* Year badge */}
                  <span
                    className={`
                      text-sm font-mono text-gray-500 tabular-nums shrink-0
                      transition-all duration-300 ease-out
                      ${hoveredIndex === index ? "text-gray-300 font-semibold" : ""}
                    `}
                  >
                    {project.year}
                  </span>
                </div>

                {/* Mobile Preview Image Inline */}
                <div className="mt-4 md:hidden rounded-lg overflow-hidden border border-gray-800">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-44 object-cover"
                  />
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProjectShowcase
