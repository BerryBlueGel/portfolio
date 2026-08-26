import { useEffect, useRef } from 'react'
import { Mesh, Program, Renderer, Triangle } from 'ogl'
import './Topography.css'

const vertex = `attribute vec2 position; void main(){ gl_Position=vec4(position,0.,1.); }`
const fragment = `precision highp float;
uniform vec2 uResolution; uniform vec2 uMouse; uniform float uMouseActive; uniform float uTime; uniform float uOpacity;
float field(vec2 p){ return sin(p.x*1.16+sin(p.y*.78))*.48 + cos(p.y*1.34-p.x*.42)*.34 + sin((p.x+p.y)*.72)*.23; }
void main(){
  vec2 uv=gl_FragCoord.xy/uResolution; vec2 p=(uv-.5)*5.4; p.x*=uResolution.x/uResolution.y;
  vec2 cursor=(uMouse-.5)*5.4; cursor.x*=uResolution.x/uResolution.y;
  float distanceToCursor=length(p-cursor);
  float disturbance=exp(-distanceToCursor*distanceToCursor*3.7)*uMouseActive;
  float elevation=field(p+vec2(uTime*.022,-uTime*.014));
  elevation+=disturbance*(.75+sin(distanceToCursor*13.-uTime*1.8)*.17);
  float band=abs(fract(elevation*4.7)-.5);
  float antialias=.006;
  float contour=1.-smoothstep(.018-antialias,.018+antialias,band);
  float halo=1.-smoothstep(.045,.10,band);
  float edge=1.-smoothstep(.56,1.22,length((uv-vec2(.58,.46))*vec2(1.15,.92)));
  float localGlow=disturbance*.34;
  vec3 ink=mix(vec3(.38,.64,.93),vec3(.13,.42,1.),smoothstep(.25,.86,uv.x));
  float alpha=(contour*.68+halo*.09+localGlow)*edge*uOpacity;
  gl_FragColor=vec4(ink,alpha);
}`

export default function Topography({ className = '', passive = false }) {
  const host = useRef(null)
  useEffect(() => {
    const element = host.current
    if (!element) return undefined
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio || 1, 2) })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    element.appendChild(gl.canvas)
    const program = new Program(gl, { vertex, fragment, uniforms: { uResolution: { value: [1, 1] }, uMouse: { value: [.5, .5] }, uMouseActive: { value: 0 }, uTime: { value: 0 }, uOpacity: { value: passive ? .08 : .18 } } })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })
    const resize = () => { const box = element.getBoundingClientRect(); renderer.setSize(Math.max(1, box.width), Math.max(1, box.height)); program.uniforms.uResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight] }
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    resize()
    const targetMouse = [.5, .5]
    const currentMouse = [.5, .5]
    let targetActive = 0
    let active = 0
    const move = (event) => {
      if (passive) return
      const box = element.getBoundingClientRect()
      const inside = event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom
      targetActive = inside ? 1 : 0
      if (inside) { targetMouse[0] = (event.clientX - box.left) / box.width; targetMouse[1] = 1 - (event.clientY - box.top) / box.height }
    }
    window.addEventListener('pointermove', move, { passive: true })
    const leave = () => { targetActive = 0 }
    window.addEventListener('blur', leave)
    let frame = 0
    let visible = true
    const render = (time) => {
      currentMouse[0] += (targetMouse[0] - currentMouse[0]) * .075
      currentMouse[1] += (targetMouse[1] - currentMouse[1]) * .075
      active += (targetActive - active) * .08
      program.uniforms.uMouse.value = currentMouse
      program.uniforms.uMouseActive.value = active
      program.uniforms.uTime.value = reducedMotion ? 0 : time / 1000
      renderer.render({ scene: mesh })
      if (!reducedMotion && visible) frame = requestAnimationFrame(render)
      else frame = 0
    }
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible && !frame && !reducedMotion) frame = requestAnimationFrame(render) }, { threshold: 0 })
    intersection.observe(element)
    render(0)
    return () => { cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect(); window.removeEventListener('pointermove', move); window.removeEventListener('blur', leave); gl.getExtension('WEBGL_lose_context')?.loseContext(); gl.canvas.remove() }
  }, [passive])
  return <div className={`topography ${className}`} ref={host} aria-hidden="true" />
}
