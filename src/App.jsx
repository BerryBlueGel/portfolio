import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Dock from './components/Dock'
import FoldText from './components/FoldText'
import IdentityPulseField from './components/IdentityPulseField'
import ProjectAccordion from './components/ProjectAccordion'
import Radar from './components/Radar'
import SpecularButton from './components/SpecularButton'
import Topography from './components/Topography'

const navigation = [
  { label: 'HOME', href: '#home' },
  { label: 'ABOUT', href: '#about' },
  { label: 'PROJECT', href: '#project' },
  { label: 'WORK', href: '#work' },
  { label: 'CONTACT', href: '#contact' }
]

const projects = [
  { id: '01', title: '空间查询与分析', subtitle: 'Vue 3 · OpenLayers · GeoJSON', image: '/projects/spatial-query.png', alt: '蓝白色空间查询地图视觉', description: '通过图层、筛选与基础空间分析组织可读的地图交互。' },
  { id: '02', title: '数据处理与服务发布', subtitle: 'QGIS · GeoServer · WMS/WFS', image: '/projects/data-layers.png', alt: '蓝白色空间数据图层转换视觉', description: '梳理从空间数据处理、格式转换到在线地图服务的工作流。' },
  { id: '03', title: '前端交互练习', subtitle: 'Vue 3 · TypeScript', image: '/projects/frontend-practice.png', alt: '蓝白色前端应用交互视觉', description: '持续练习组件化、状态组织和清晰的信息表达。' }
]

const methods = [
  ['01', '空间数据处理', '整理 · 转换 · 规范化', 'layers'],
  ['02', '地图交互表达', '图层 · 查询 · 分析', 'target'],
  ['03', '前端工程实现', '组件 · 状态 · 接口', 'brackets'],
  ['04', '持续学习与交付', '说明 · 验证 · 迭代', 'route']
]

gsap.registerPlugin(ScrollTrigger)

function IdentityRail() {
  return <aside className="identity-rail" aria-label="BerryBlueGel 品牌标识">
    <a className="identity-rail__avatar" href="#home"><img src="/berrybluegel.png" alt="BerryBlueGel 蓝色人物图标" /></a>
    <span className="identity-rail__name">BerryBlueGel</span>
    <span className="identity-rail__axis" aria-hidden="true"><i /><i /><i /></span>
  </aside>
}

function SectionMark({ number, label }) {
  return <div className="section-mark"><span>{number}</span><i /><em>{label}</em></div>
}

export default function App() {
  const [active, setActive] = useState('#home')
  const [contactOpen, setContactOpen] = useState(false)
  const siteRef = useRef(null)

  useEffect(() => {
    const sections = [...document.querySelectorAll('[data-section]')]
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(`#${entry.target.id}`)),
      { rootMargin: '-42% 0px -48% 0px' }
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const root = siteRef.current
    if (!root || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined

    const context = gsap.context(() => {
      gsap.utils.toArray('.scroll-reveal').forEach((section) => {
        gsap.fromTo(section, { autoAlpha: 0, y: 48 }, {
          autoAlpha: 1,
          y: 0,
          duration: .82,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 80%', once: true }
        })
      })

      gsap.fromTo('.method-row', { autoAlpha: 0, x: -24 }, {
        autoAlpha: 1,
        x: 0,
        duration: .5,
        stagger: .09,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.method-map', start: 'top 78%', once: true }
      })
    }, root)

    return () => context.revert()
  }, [])

  return <main className="atlas-site" ref={siteRef}>
    <IdentityRail />
    <Dock items={navigation} activeHref={active} />

    <section className="atlas-hero" id="home" data-section>
      <Topography className="hero-topography" />
      <div className="atlas-grid" aria-hidden="true" />
      <div className="hero-node hero-node--one">01</div>
      <div className="hero-node hero-node--two">02</div>
      <div className="hero-node hero-node--three">03</div>
      <div className="atlas-content hero-content">
        <p className="eyebrow">WEBGIS / GIS</p>
        <h1><FoldText text="把空间数据，" delay={.12} style={{ display: 'block', letterSpacing: '-.105em' }} /><FoldText text="组织成有秩序的" delay={.32} style={{ display: 'block', letterSpacing: '-.105em' }} /><FoldText text="体验。" delay={.52} color="#226bff" style={{ display: 'block', letterSpacing: '-.105em' }} /></h1>
        <p className="hero-summary">以 GIS 基础为起点，持续探索空间数据处理、数字地图与前端交互表达。</p>
        <div className="hero-action"><SpecularButton onClick={() => document.getElementById('project')?.scrollIntoView({ behavior: 'smooth' })}>打开项目索引 <span>↗</span></SpecularButton></div>
      </div>
      <div className="hero-index" aria-label="项目索引"><span>PROJECT INDEX</span>{projects.map((project) => <a href="#project" key={project.id}><b>{project.id}</b><i /></a>)}</div>
    </section>

    <section className="about-section atlas-section" id="about" data-section>
      <div className="atlas-content atlas-content--wide about-layout scroll-reveal">
        <SectionMark number="02" label="IDENTITY ORIGIN" />
        <div className="identity-origin"><div className="identity-origin__orbit" /><IdentityPulseField /><img src="/berrybluegel.png" alt="BerryBlueGel 个人图标" /><span>IDENTITY<br />ORIGIN</span></div>
        <article className="about-copy">
          <p className="eyebrow">ABOUT / WEBGIS · GIS</p>
          <h2>从 GIS 基础，<br />走向数字地图。</h2>
          <p>我关注空间数据的整理、表达与交互，让地图不只呈现位置，也能支持理解与决策。目前正沿着 WebGIS / GIS 开发方向持续学习与实践。</p>
          <dl><dt>方向</dt><dd>WebGIS / GIS Development</dd><dt>关注</dt><dd>Data · Map · Web</dd><dt>状态</dt><dd>寻找学习与实践机会</dd></dl>
        </article>
        <div className="data-route" aria-label="技能路径"><span>DATA</span><i /><span>MAP</span><i /><span>WEB</span></div>
      </div>
    </section>

    <section className="projects-section atlas-section" id="project" data-section>
      <div className="atlas-content scroll-reveal"><div className="section-heading"><div><p className="eyebrow">SELECTED LAYERS</p><h2>项目图层索引</h2></div><SectionMark number="03" label="PROJECT INDEX" /></div><ProjectAccordion projects={projects} /></div>
    </section>

    <section className="methods-section atlas-section" id="work" data-section>
      <div className="atlas-content atlas-content--wide scroll-reveal"><div className="section-heading"><div><p className="eyebrow">METHOD / 04</p><h2>工作方法</h2></div><SectionMark number="04" label="CAPABILITIES" /></div><div className="method-map">{methods.map(([id, title, detail, type]) => <article className="method-row" key={id}><span>{id}</span><h3>{title}</h3><p>{detail}</p><i className={`method-icon method-icon--${type}`} aria-hidden="true" /><b aria-hidden="true" /></article>)}</div></div>
    </section>

    <section className="contact-section atlas-section" id="contact" data-section>
      <Topography className="contact-topography" passive />
      <div className="atlas-content contact-layout scroll-reveal">
        <SectionMark number="05" label="END OF INDEX" />
        <div><p className="eyebrow">CONTACT / 05</p><h2>从一个坐标点，<br />开始下一段合作。</h2><p className="contact-intro">期待 WebGIS / GIS 方向的学习、协作与实践机会。</p><SpecularButton onClick={() => setContactOpen((open) => !open)} ariaExpanded={contactOpen}>发起联系 <span>↗</span></SpecularButton><div className={`contact-options ${contactOpen ? 'is-open' : ''}`} id="contact-options"><span>EMAIL <em>待补充</em></span><span>GITHUB <em>待补充</em></span><span>WECHAT <em>待补充</em></span></div></div>
        <div className="contact-compass" aria-hidden="true"><Radar /><i /><i /><i /><b /></div>
        <footer>BerryBlueGel <span>·</span> WEBGIS / GIS <em>END OF INDEX / 05</em></footer>
      </div>
    </section>
  </main>
}
