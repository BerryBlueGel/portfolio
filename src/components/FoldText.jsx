import { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import './FoldText.css'

const HINGE_CONFIG = {
  top: { origin: '50% 0%', rotateX: -92, rotateY: 0 },
  bottom: { origin: '50% 100%', rotateX: 92, rotateY: 0 },
  left: { origin: '0% 50%', rotateX: 0, rotateY: 92 },
  right: { origin: '100% 50%', rotateX: 0, rotateY: -92 }
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

export default function FoldText({
  text,
  splitBy = 'char',
  hinge = 'top',
  duration = .62,
  stagger = .035,
  ease = 'power3.out',
  perspective = 760,
  creaseShading = .42,
  delay = 0,
  fontSize = 'inherit',
  fontWeight = 'inherit',
  color = 'currentColor',
  className = '',
  style = {}
}) {
  const rootRef = useRef(null)
  const hingeConfig = HINGE_CONFIG[hinge] ?? HINGE_CONFIG.top
  const safePerspective = Math.max(120, perspective)
  const safeCrease = clamp(creaseShading, 0, 1)

  const segments = useMemo(() => {
    if (splitBy === 'line') {
      return text.split('\n').map((line, index) => <span className="fold-text-line" key={`line-${index}`}><span className="fold-text-segment" style={{ '--fold-perspective': `${safePerspective}px` }}><span className="fold-text-piece" data-fold-hinge={hinge} style={{ transformOrigin: hingeConfig.origin }}>{line || '\u00a0'}</span></span></span>)
    }

    const values = splitBy === 'word' ? text.split(/(\s+)/) : Array.from(text)
    return values.map((value, index) => {
      if (!value) return null
      if (value === '\n') return <br key={`break-${index}`} />
      if (splitBy === 'word' && /^\s+$/.test(value)) return <span className="fold-text-whitespace" key={`space-${index}`}>{value.replace(/ /g, '\u00a0')}</span>
      return <span className="fold-text-segment" key={`segment-${index}`} style={{ '--fold-perspective': `${safePerspective}px` }}><span className="fold-text-piece" data-fold-hinge={hinge} style={{ transformOrigin: hingeConfig.origin }}>{value === ' ' ? '\u00a0' : value}</span></span>
    })
  }, [text, splitBy, hinge, hingeConfig.origin, safePerspective])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const pieces = Array.from(root.querySelectorAll('.fold-text-piece'))
    if (!pieces.length) return undefined

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const tween = gsap.fromTo(pieces, {
      opacity: 0,
      rotateX: reduced ? 0 : hingeConfig.rotateX,
      rotateY: reduced ? 0 : hingeConfig.rotateY,
      '--fold-crease': reduced ? 0 : safeCrease,
      transformOrigin: hingeConfig.origin,
      force3D: true
    }, {
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      '--fold-crease': 0,
      duration: reduced ? Math.min(duration, .22) : duration,
      delay: reduced ? 0 : delay,
      ease: reduced ? 'power1.out' : ease,
      stagger: reduced ? Math.min(stagger, .02) : stagger,
      clearProps: 'willChange'
    })

    return () => {
      tween.kill()
      gsap.killTweensOf(pieces)
    }
  }, [duration, stagger, ease, delay, hingeConfig.origin, hingeConfig.rotateX, hingeConfig.rotateY, safeCrease])

  return <span ref={rootRef} className={`fold-text ${className}`.trim()} style={{ '--fold-text-font-size': fontSize, '--fold-text-font-weight': fontWeight, '--fold-text-color': color, ...style }}><span className="fold-text-sr-only">{text}</span><span className="fold-text-visual" aria-hidden="true">{segments}</span></span>
}
