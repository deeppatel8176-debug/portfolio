"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { ShieldCheck, ArrowRight, MapPin } from "lucide-react"

interface IdCardProps {
  onOpenDetails: () => void
  name?: string
  role?: string
  modelId?: string
  experience?: string
  status?: string
}

export function IdCard({
  onOpenDetails,
  name = "Deep Patel",
  role = "Full Stack Developer at Coding House",
  modelId = "DEEPPATEL8176-DEBUG",
  experience = "SCET Surat // Full Stack",
  status = "Active / Available",
}: IdCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  // Drag state
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isReturning, setIsReturning] = useState(false)
  const dragStart = useRef({ mouseX: 0, mouseY: 0, cardX: 0, cardY: 0 })
  const didDrag = useRef(false)

  // ── Mouse tilt (only when not dragging) ──────────────────────────
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setRotate({ x: -(y / (rect.height / 2)) * 8, y: (x / (rect.width / 2)) * 8 })
  }

  const handleMouseLeave = () => {
    if (!isDragging) {
      setRotate({ x: 0, y: 0 })
      setIsHovered(false)
    }
  }

  // ── Drag handlers ─────────────────────────────────────────────────
  const startDrag = useCallback((clientX: number, clientY: number) => {
    didDrag.current = false
    setIsDragging(true)
    setIsReturning(false)
    dragStart.current = {
      mouseX: clientX,
      mouseY: clientY,
      cardX: drag.x,
      cardY: drag.y,
    }
  }, [drag.x, drag.y])

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    startDrag(e.clientX, e.clientY)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    startDrag(t.clientX, t.clientY)
  }

  const moveDrag = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return
    const dx = clientX - dragStart.current.mouseX
    const dy = clientY - dragStart.current.mouseY
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag.current = true
    setDrag({
      x: dragStart.current.cardX + dx,
      y: dragStart.current.cardY + dy,
    })
  }, [isDragging])

  const endDrag = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    setIsReturning(true)
    setRotate({ x: 0, y: 0 })
    // Snap back to 0,0 (CSS transition handles the spring)
    setDrag({ x: 0, y: 0 })
    setTimeout(() => setIsReturning(false), 600)
  }, [isDragging])

  // Global mouse/touch move + up (so drag works if cursor leaves card)
  useEffect(() => {
    if (!isDragging) return
    const onMove = (e: MouseEvent) => moveDrag(e.clientX, e.clientY)
    const onTMove = (e: TouchEvent) => moveDrag(e.touches[0].clientX, e.touches[0].clientY)
    const onUp = () => endDrag()
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    window.addEventListener("touchmove", onTMove)
    window.addEventListener("touchend", onUp)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
      window.removeEventListener("touchmove", onTMove)
      window.removeEventListener("touchend", onUp)
    }
  }, [isDragging, moveDrag, endDrag])

  const handleClick = () => {
    // Only fire click if it wasn't a drag
    if (!didDrag.current) onOpenDetails()
  }

  return (
    <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[280px] h-[280px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      {/* The 3D Draggable ID Card */}
      <div
        className="perspective-1000 z-10 group"
        style={{
          transform: `translate(${drag.x}px, ${drag.y}px)`,
          transition: isReturning
            ? "transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)"
            : isDragging
            ? "none"
            : "transform 0.3s ease",
          cursor: isDragging ? "grabbing" : "grab",
          willChange: "transform",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onClick={handleClick}
      >
        <div
          className="relative w-[280px] sm:w-[300px] bg-gradient-to-b from-[#ffffff] via-[#fafafa] to-[#f0f0f3] text-gray-900 rounded-[28px] p-6 pt-7 shadow-[0_30px_70px_rgba(0,0,0,0.8),0_10px_25px_rgba(0,0,0,0.5)] border border-white/60"
          style={{
            transform: isDragging
              ? `rotateX(0deg) rotateY(0deg) scale(1.05)`
              : `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${isHovered ? "scale(1.03)" : "scale(1)"}`,
            transformStyle: "preserve-3d",
            transition: isDragging ? "transform 0.1s ease" : "transform 0.3s ease-out",
            boxShadow: isDragging
              ? "0 50px_100px_rgba(0,0,0,0.9), 0 20px 40px rgba(0,0,0,0.6)"
              : undefined,
          }}
        >

          {/* Hologram security pill */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-[9px] font-mono tracking-widest uppercase text-gray-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3 h-3 text-blue-600" /> SURAT, GUJARAT, IN
            </span>
            <span className="text-[9px] font-mono tracking-wider bg-gray-200/80 text-gray-700 px-2 py-0.5 rounded-full font-bold">
              ID: #DP-8176
            </span>
          </div>

          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#e3edf7] via-[#ebf3fa] to-[#d8e5f2] p-1 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.08),inset_-4px_-4px_8px_rgba(255,255,255,0.9),0_8px_16px_rgba(0,0,0,0.06)] flex items-center justify-center overflow-hidden">
                <img
                  src="/avatar.png"
                  alt={name}
                  className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
            </div>
          </div>

          {/* Name & Role */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-serif tracking-tight text-gray-950 font-medium">
              {name}
            </h1>
            <p className="text-[10px] font-mono tracking-wider text-blue-600 font-semibold mt-1 uppercase">
              {role}
            </p>
            <p className="text-[10px] font-mono text-gray-500 mt-0.5 flex items-center justify-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-gray-400" />
              Surat, Gujarat, India
            </p>
          </div>

          {/* Meta details */}
          <div className="space-y-2.5 my-3 py-3 border-y border-gray-200/80">
            <div className="text-center">
              <div className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">GITHUB / DEV ID</div>
              <div className="text-xs font-mono text-gray-800 font-semibold mt-0.5">{modelId}</div>
            </div>
            <div className="text-center">
              <div className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">EDUCATION</div>
              <div className="text-[11px] font-mono text-gray-800 font-medium mt-0.5">
                Sarvajanik University // MCA
              </div>
            </div>
            <div className="text-center">
              <div className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">EMAIL</div>
              <div className="text-[11px] font-mono text-gray-900 font-semibold mt-0.5">pateldeep1783@gmail.com</div>
            </div>
            <div className="text-center">
              <div className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">AVAILABILITY</div>
              <div className="text-[11px] font-mono text-emerald-600 font-semibold mt-0.5 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                {status}
              </div>
            </div>
          </div>




          {/* Click hint */}
          <div className="mt-4 pt-2.5 border-t border-gray-200/60 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
            <span>{isDragging ? "Release to snap back" : "Click to enter portfolio"}</span>
            {!isDragging && <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />}
          </div>
        </div>
      </div>

      {/* Drag hint label */}
      <p className="absolute bottom-8 text-[11px] font-mono text-gray-600 tracking-widest pointer-events-none">
        DRAG THE CARD · CLICK TO OPEN
      </p>
    </div>
  )
}

export default IdCard
