import { useEffect, useRef } from 'react'

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum)

export default function IdentityPulseField() {
  const fieldRef = useRef(null)

  useEffect(() => {
    const field = fieldRef.current
    const origin = field?.parentElement
    if (!field || !origin) return undefined

    let frame = 0
    let pointer = { x: 0, y: 0 }

    const paint = () => {
      const writeLayer = (name, distance) => {
        origin.style.setProperty(`--${name}-x`, `${(pointer.x * distance).toFixed(1)}px`)
        origin.style.setProperty(`--${name}-y`, `${(pointer.y * distance).toFixed(1)}px`)
      }

      // The artwork remains still; the exterior layers open in the pointer direction.
      writeLayer('inner', 8)
      writeLayer('main', 20)
      writeLayer('orbit', 36)
      writeLayer('label', 13)
      writeLayer('pulse', 16)
      frame = 0
    }

    const move = (event) => {
      const bounds = origin.getBoundingClientRect()
      pointer = {
        x: clamp((event.clientX - bounds.left) / bounds.width, 0, 1) * 2 - 1,
        y: clamp((event.clientY - bounds.top) / bounds.height, 0, 1) * 2 - 1
      }
      origin.classList.add('is-pulse-hover')
      if (!frame) frame = requestAnimationFrame(paint)
    }

    const leave = () => {
      origin.classList.remove('is-pulse-hover')
      pointer = { x: 0, y: 0 }
      if (!frame) frame = requestAnimationFrame(paint)
    }

    origin.addEventListener('pointermove', move, { passive: true })
    origin.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      origin.removeEventListener('pointermove', move)
      origin.removeEventListener('pointerleave', leave)
    }
  }, [])

  return <div ref={fieldRef} className="identity-origin__pulse-field" aria-hidden="true"><i /><i /><i /></div>
}
