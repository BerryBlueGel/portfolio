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
  {
    id: '01',
    title: '华北理工数字校园',
    subtitle: 'MapLibre · Three.js · PostGIS',
    image: '/projects/ncst-campus-poster.jpg',
    alt: '数字校园概念海报，斜俯视图书馆、校园中轴和环绕水系',
    description: '在同一校园场景中浏览二维地图、三维建筑与地标，并开展空间分析。',
    href: 'https://ncstgeo.cn/'
  },
  {
    id: '02',
    title: 'GeoSandbox',
    subtitle: 'React · MapLibre · CesiumJS',
    image: '/projects/geosandbox-poster.jpg',
    alt: 'GeoSandbox 概念海报，三个建筑模型与矢量、影像图层分层对齐',
    description: '导入空间数据、定位与装配三维模型，再将成果导出为可重开的项目包。',
    href: 'https://geosandbox.top/'
  },
  {
    id: '03',
    title: '武汉 GeoHub',
    subtitle: 'OpenLayers · Turf.js · PostGIS',
    image: '/projects/wuhan-geohub-poster.jpg',
    alt: '武汉 GeoHub 概念海报，蓝色缓冲圈覆盖江岸，橙色点表示示意 POI',
    description: '在武汉城市资源地图中筛选兴趣点，并同屏查看 Turf.js 与 PostGIS 的缓冲区分析结果。',
    href: 'https://github.com/BerryBlueGel/wuhan-geohub'
  }
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
          <dl><dt>方向</dt><dd>WebGIS / GIS Development</dd><dt>关注</dt><dd>Data · Map · Web</dd></dl>
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
        <div className="contact-copy">
          <p className="eyebrow">CONTACT / 05</p>
          <h2>从一个坐标点，<br />开始下一段合作。</h2>
          <dl className="contact-details" aria-label="GitHub 主页">
            <div><dt>GITHUB</dt><dd><a href="https://github.com/BerryBlueGel" target="_blank" rel="noopener noreferrer">github.com/BerryBlueGel <span aria-hidden="true">↗</span></a></dd></div>
          </dl>
          <SpecularButton onClick={() => setContactOpen((open) => !open)} ariaExpanded={contactOpen} ariaControls="contact-numbers">发起联系 <span aria-hidden="true">{contactOpen ? '−' : '↗'}</span></SpecularButton>
          <dl className="contact-details contact-details--numbers" id="contact-numbers" aria-label="QQ 和 QQ 邮箱" hidden={!contactOpen}>
            <div><dt>QQ</dt><dd>3554329421</dd></div>
            <div><dt>QQ 邮箱</dt><dd>3554329421@qq.com</dd></div>
          </dl>
        </div>
        <div className="contact-compass" aria-hidden="true"><Radar /><i /><i /><i /><b /></div>
        <footer>BerryBlueGel <span>·</span> WEBGIS / GIS <em>END OF INDEX / 05</em></footer>
      </div>
    </section>
  </main>
}
