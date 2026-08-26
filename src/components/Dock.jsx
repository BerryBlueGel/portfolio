import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import './Dock.css'

function DockGlyph({ label }) {
  const glyphs = {
    HOME: <><path d="M3.5 10.5 12 3.5l8.5 7" /><path d="M5.5 9.5V20.5h13V9.5" /><path d="M9.5 20.5v-6h5v6" /></>,
    ABOUT: <><circle cx="12" cy="8.25" r="3.2" /><path d="M5 21c.85-4.2 3.15-6.25 7-6.25S18.15 16.8 19 21" /></>,
    PROJECT: <><path d="M4 7.5h6l1.4 2H20v9.75H4z" /><path d="M4 11.5h16" /></>,
    WORK: <><path d="M4 8h16v11H4z" /><path d="M8 8V5.5h8V8M4 12.5h16M9.5 12.5v2h5v-2" /></>,
    CONTACT: <><rect x="3.5" y="6.5" width="17" height="11" rx="1" /><path d="m4.5 8 7.5 5.25L19.5 8" /></>
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true">{glyphs[label]}</svg>
}

function DockLabel({ label, isHovered }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => isHovered.on('change', (value) => setVisible(value === 1)), [isHovered])
  return <AnimatePresence>{visible && <motion.span className="dock-label" role="tooltip" style={{ x: '-50%' }} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: .18 }}>{label}</motion.span>}</AnimatePresence>
}

function DockItem({ item, activeHref, mouseX, baseItemSize, magnification, distance }) {
  const ref = useRef(null)
  const isHovered = useMotionValue(0)
  const pointerDistance = useTransform(mouseX, (value) => {
    const rect = ref.current?.getBoundingClientRect() ?? { left: 0, width: baseItemSize }
    return value - rect.left - rect.width / 2
  })
  const targetSize = useTransform(pointerDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize])
  const size = useSpring(targetSize, { mass: .11, stiffness: 180, damping: 15 })
  const activateFromFocus = () => {
    const rect = ref.current?.getBoundingClientRect()
    if (rect) mouseX.set(rect.left + rect.width / 2)
    isHovered.set(1)
  }

  return <motion.a ref={ref} href={item.href} className={`dock-item ${activeHref === item.href ? 'is-active' : ''}`} style={{ width: size, height: size }} onHoverStart={() => isHovered.set(1)} onHoverEnd={() => isHovered.set(0)} onFocus={activateFromFocus} onBlur={() => isHovered.set(0)} aria-label={item.label} aria-current={activeHref === item.href ? 'page' : undefined}>
    <DockGlyph label={item.label} />
    <DockLabel label={item.label} isHovered={isHovered} />
  </motion.a>
}

export default function Dock({ items, activeHref }) {
  const mouseX = useMotionValue(Infinity)
  const panelRef = useRef(null)

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return undefined
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const tween = gsap.fromTo(panel, {
      autoAlpha: 0,
      y: reduced ? 0 : -34,
      scale: reduced ? 1 : .96
    }, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      delay: reduced ? 0 : .22,
      duration: reduced ? .18 : .78,
      ease: 'power3.out',
      clearProps: 'willChange'
    })
    return () => tween.kill()
  }, [])

  return <nav className="dock-nav" aria-label="主要导航">
    <div ref={panelRef} className="dock-panel" onPointerMove={(event) => mouseX.set(event.clientX)} onPointerLeave={() => mouseX.set(Infinity)}>
      {items.map((item) => <DockItem key={item.href} item={item} activeHref={activeHref} mouseX={mouseX} baseItemSize={68} magnification={84} distance={185} />)}
    </div>
  </nav>
}
