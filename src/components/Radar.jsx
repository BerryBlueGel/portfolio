import { Mesh, Program, Renderer, Triangle } from 'ogl'
import { useEffect, useRef } from 'react'
import './Radar.css'

const hexToVec3 = (hex) => {
  const value = hex.replace('#', '')
  return [parseInt(value.slice(0, 2), 16) / 255, parseInt(value.slice(2, 4), 16) / 255, parseInt(value.slice(4, 6), 16) / 255]
}

const vertex = `attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}`
const fragment = `precision highp float;
uniform float uTime; uniform vec3 uResolution; uniform float uSpeed; uniform float uScale; uniform float uRingCount; uniform float uSpokeCount; uniform float uRingThickness; uniform float uSpokeThickness; uniform float uSweepSpeed; uniform float uSweepWidth; uniform vec3 uColor; uniform vec3 uHighlightColor; uniform vec3 uTrailColor; uniform float uBrightness; uniform vec2 uMouse; uniform float uMouseInfluence; uniform float uMouseEnabled;
#define TAU 6.28318530718
void main(){
  vec2 p=gl_FragCoord.xy/uResolution.xy*2.-1.; p.x*=uResolution.x/uResolution.y;
  vec2 mouse=(uMouse*2.-1.); mouse.x*=uResolution.x/uResolution.y;
  p-=mouse*uMouseInfluence*uMouseEnabled; p*=uScale;
  float distanceToCenter=length(p); float angle=atan(p.y,p.x); float time=uTime*uSpeed;
  float rings=1.-smoothstep(0.,uRingThickness,abs(fract(distanceToCenter*uRingCount-time*.14)-.5));
  float spokeAngle=abs(fract(angle*uSpokeCount/TAU+.5)-.5)*TAU/uSpokeCount;
  float spokes=(1.-smoothstep(0.,uSpokeThickness,spokeAngle*distanceToCenter))*smoothstep(.05,.14,distanceToCenter);
  float sweep=pow(max(.5*sin(angle+time*uSweepSpeed)+.5,0.),uSweepWidth);
  float edge=(1.-smoothstep(.62,1.10,distanceToCenter))*pow(max(1.-distanceToCenter,0.),.55);
  float structure=clamp(rings*.78+spokes*.22,0.,1.);
  float intensity=clamp((rings*.62+spokes*.18+sweep*.32)*edge*uBrightness,0.,.48);
  vec3 radarColor=mix(uTrailColor,uColor,structure);
  radarColor=mix(radarColor,uHighlightColor,sweep*.82);
  gl_FragColor=vec4(radarColor,intensity);
}`

export default function Radar({ speed = 1, scale = .7, ringCount = 4, spokeCount = 4, ringThickness = .045, spokeThickness = .012, sweepSpeed = .55, sweepWidth = 6, color = '#78b6ff', highlightColor = '#226bff', trailColor = '#d9ecff', brightness = .36, mouseInfluence = .055 }) {
  const host = useRef(null)

  useEffect(() => {
    const element = host.current
    if (!element) return undefined
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio || 1, 2) })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    element.appendChild(gl.canvas)

    const program = new Program(gl, { vertex, fragment, uniforms: {
      uTime: { value: 0 }, uResolution: { value: [1, 1, 1] }, uSpeed: { value: speed }, uScale: { value: scale }, uRingCount: { value: ringCount }, uSpokeCount: { value: spokeCount }, uRingThickness: { value: ringThickness }, uSpokeThickness: { value: spokeThickness }, uSweepSpeed: { value: sweepSpeed }, uSweepWidth: { value: sweepWidth }, uColor: { value: hexToVec3(color) }, uHighlightColor: { value: hexToVec3(highlightColor) }, uTrailColor: { value: hexToVec3(trailColor) }, uBrightness: { value: brightness }, uMouse: { value: [.5, .5] }, uMouseInfluence: { value: mouseInfluence }, uMouseEnabled: { value: reduced ? 0 : 1 }
    } })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })
    const resize = () => { const box = element.getBoundingClientRect(); renderer.setSize(Math.max(1, box.width), Math.max(1, box.height)); program.uniforms.uResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight, gl.drawingBufferWidth / gl.drawingBufferHeight] }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(element)
    resize()

    const interactionHost = element.parentElement ?? element
    const targetMouse = [.5, .5]
    const currentMouse = [.5, .5]
    const move = (event) => { const box = element.getBoundingClientRect(); targetMouse[0] = (event.clientX - box.left) / box.width; targetMouse[1] = 1 - (event.clientY - box.top) / box.height }
    const leave = () => { targetMouse[0] = .5; targetMouse[1] = .5 }
    interactionHost.addEventListener('pointermove', move, { passive: true })
    interactionHost.addEventListener('pointerleave', leave, { passive: true })

    let frame = 0
    let visible = true
    const render = (time) => {
      currentMouse[0] += (targetMouse[0] - currentMouse[0]) * .055
      currentMouse[1] += (targetMouse[1] - currentMouse[1]) * .055
      program.uniforms.uMouse.value = currentMouse
      program.uniforms.uTime.value = reduced ? 0 : time / 1000
      renderer.render({ scene: mesh })
      if (!reduced && visible) frame = requestAnimationFrame(render)
      else frame = 0
    }
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible && !frame && !reduced) frame = requestAnimationFrame(render) }, { threshold: 0 })
    intersection.observe(element)
    render(0)

    return () => { cancelAnimationFrame(frame); resizeObserver.disconnect(); intersection.disconnect(); interactionHost.removeEventListener('pointermove', move); interactionHost.removeEventListener('pointerleave', leave); gl.getExtension('WEBGL_lose_context')?.loseContext(); gl.canvas.remove() }
  }, [speed, scale, ringCount, spokeCount, ringThickness, spokeThickness, sweepSpeed, sweepWidth, color, highlightColor, trailColor, brightness, mouseInfluence])

  return <div ref={host} className="radar-container" aria-hidden="true" />
}
