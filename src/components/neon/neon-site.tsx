"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import { ReactLenis, useLenis } from "lenis/react"
import "lenis/dist/lenis.css"
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion"
import { ArrowDownRight, ArrowUpRight, Download, MessageCircle } from "lucide-react"
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react"
import SiteToggle from "@/components/site-toggle"
import { useChatContext } from "@/contexts/chat-context"
import { cn } from "@/lib/utils"
import { scrollState } from "./scroll-state"
import { cases, hero, links, method, opsNote, projects, sections, stats, timeline, toolbox, type CaseFile } from "./content"

const NeonScene = dynamic(() => import("./scene"), { ssr: false })

const ease = [0.16, 1, 0.3, 1] as const

const accentText: Record<CaseFile["accent"], string> = {
  pink: "neon-pink",
  cyan: "neon-cyan",
  amber: "neon-amber",
  violet: "neon-violet",
}
const accentBorder: Record<CaseFile["accent"], string> = {
  pink: "border-[#ff2a8a] shadow-[0_0_40px_-10px_#ff2a8a]",
  cyan: "border-[#19e6ff] shadow-[0_0_40px_-10px_#19e6ff]",
  amber: "border-[#ffb020] shadow-[0_0_40px_-10px_#ffb020]",
  violet: "border-[#8b5cff] shadow-[0_0_40px_-10px_#8b5cff]",
}

function ScrollSync() {
  useLenis(({ scroll, limit, velocity }) => {
    scrollState.progress = limit > 0 ? scroll / limit : 0
    scrollState.velocity = velocity
  })
  return null
}

function useScrollTo() {
  const lenis = useLenis()
  return (id: string) => {
    const target = id === "top" ? 0 : `#${id}`
    lenis?.scrollTo(target, { offset: id === "top" ? 0 : -24, duration: 1.8 })
  }
}

function Reveal({ children, className, delay = 0, y = 40 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 1.1, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

function MaskLine({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.span className="block overflow-hidden pb-[0.06em]" initial="hidden" whileInView="shown" viewport={{ once: true }}>
      <motion.span
        className={cn("block", className)}
        variants={{ hidden: { y: "110%" }, shown: { y: "0%" } }}
        transition={{ duration: 1.2, ease, delay }}
      >
        {children}
      </motion.span>
    </motion.span>
  )
}

/* ----------------------------------- Nav ---------------------------------- */

function Nav() {
  const scrollTo = useScrollTo()
  const [solid, setSolid] = useState(false)
  useLenis(({ scroll }) => setSolid(scroll > 40))
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 transition-all duration-500 sm:px-5 sm:py-4 md:px-10 lg:grid lg:grid-cols-[1fr_auto_1fr]",
          solid ? "bg-[#04030c]/70 backdrop-blur-md" : "bg-transparent"
        )}
      >
        <button onClick={() => scrollTo("top")} className="group flex items-center gap-3 justify-self-start">
          <span className="h-2 w-2 rounded-full bg-[#ff2a8a] shadow-[0_0_12px_#ff2a8a] group-hover:animate-ping" />
          <span className="font-display text-base font-extrabold uppercase tracking-[0.14em] sm:text-xl sm:tracking-[0.18em]">Akshit Dayal</span>
        </button>
        <nav className="hidden items-center gap-8 font-mono text-[11px] uppercase tracking-[0.25em] text-white/60 lg:flex">
          {sections.slice(1).map((s) => (
            <button key={s.id} onClick={() => scrollTo(s.id)} className="transition-colors hover:text-[#19e6ff]">
              {s.label}
            </button>
          ))}
        </nav>
        <SiteToggle className="justify-self-end" />
      </div>
      <motion.div style={{ scaleX: bar }} className="h-px origin-left bg-gradient-to-r from-[#ff2a8a] via-[#8b5cff] to-[#19e6ff]" />
    </header>
  )
}

function Rail() {
  const scrollTo = useScrollTo()
  const [active, setActive] = useState("top")

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -45% 0px" }
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <div className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-5 xl:flex">
      {sections.map((s) => (
        <button key={s.id} onClick={() => scrollTo(s.id)} className="group flex items-center gap-3" aria-label={s.label}>
          <span
            className={cn(
              "font-mono text-[10px] uppercase tracking-[0.25em] transition-all duration-500",
              "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
              active === s.id ? "text-white/80" : "text-white/40"
            )}
          >
            {s.label}
          </span>
          <span
            className={cn(
              "font-jp text-sm transition-all duration-500 [writing-mode:vertical-rl]",
              active === s.id ? "neon-pink scale-110" : "text-white/30 group-hover:text-white/70"
            )}
          >
            {s.kanji}
          </span>
        </button>
      ))}
    </div>
  )
}

/* ---------------------------------- Hero ---------------------------------- */

function Hero() {
  const scrollTo = useScrollTo()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section id="top" ref={ref} className="relative flex min-h-[100svh] items-end px-5 pb-28 pt-28 md:px-10 md:pt-32">
      <motion.div style={{ y, opacity }} className="w-full">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-[#19e6ff] md:text-xs"
        >
          <span className="mr-3 inline-block h-px w-10 translate-y-[-3px] bg-[#19e6ff]" />
          {hero.kicker}
        </motion.p>
        <h1 className="font-display text-[11.5vw] font-black uppercase leading-[0.84] tracking-[-0.01em] md:text-[10.5vw]">
          <MaskLine delay={0.2}>{hero.lines[0]}</MaskLine>
          <MaskLine delay={0.35} className="neon-pink flicker">
            {hero.lines[1]}
          </MaskLine>
        </h1>
        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease, delay: 0.9 }}
            className="max-w-xl text-base leading-relaxed text-white/75 sm:text-lg md:text-xl"
          >
            {hero.sub}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease, delay: 1.05 }}
            className="flex shrink-0 flex-wrap gap-3"
          >
            <button onClick={() => scrollTo("work")} className="btn-neon group">
              See the work <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </button>
            <a href={links.resume} target="_blank" rel="noreferrer" data-track="resume-hero" className="btn-ghost">
              Resume <Download className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </motion.div>
      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40">Scroll</span>
        <span className="h-10 w-px overflow-hidden bg-white/10">
          <span className="block h-1/2 w-full animate-[drip_1.8s_ease-in-out_infinite] bg-[#ff2a8a]" />
        </span>
      </div>
    </section>
  )
}

/* ---------------------------------- Stats --------------------------------- */

function Stats() {
  return (
    <section className="relative px-5 py-24 md:px-10">
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 md:grid-cols-3">
        {stats.map((s, i) => (
          <div key={s.label} className="bg-[#05040d]/85 p-6 md:p-10">
            <Reveal delay={i * 0.08}>
              <div className="neon-cyan font-display text-5xl font-black md:text-7xl">{s.value}</div>
              <p className="mt-3 max-w-[16rem] font-mono text-xs uppercase leading-relaxed tracking-[0.15em] text-white/55">{s.label}</p>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------- Work ---------------------------------- */

function SectionHead({ kanji, label, title, sub }: { kanji: string; label: string; title: ReactNode; sub?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const x = useTransform(scrollYProgress, [0, 1], ["8%", "-12%"])

  return (
    <div ref={ref} className="relative mb-12 md:mb-24">
      <motion.span
        style={{ x }}
        aria-hidden
        className="font-jp pointer-events-none absolute -top-10 right-0 select-none text-[28vw] font-black leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.07)] md:-top-24 md:text-[18vw]"
      >
        {kanji}
      </motion.span>
      <Reveal>
        <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.3em] text-[#ff2a8a]">
          <span className="font-jp mr-3 text-sm">{kanji}</span>
          {label}
        </p>
      </Reveal>
      <h2 className="relative text-balance font-display text-[13vw] font-black uppercase leading-[0.85] md:text-[7.5vw]">{title}</h2>
      {sub && (
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl text-lg text-white/60">{sub}</p>
        </Reveal>
      )}
    </div>
  )
}

function CaseCard({ c, i }: { c: CaseFile; i: number }) {
  const right = i % 2 === 1
  return (
    <div className={cn("flex items-center py-8 md:min-h-[85vh] md:py-10", right ? "md:justify-end" : "md:justify-start")}>
      <Reveal y={70} className="w-full md:w-[min(46rem,60%)]">
        <article className={cn("relative border-l-2 bg-[#05040d]/85 p-7 md:p-12", accentBorder[c.accent])}>
          <div className="mb-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div>
              <p className="font-mono text-xs tracking-[0.3em] text-white/40">CASE {c.index}</p>
              <h3 className="mt-3 text-balance font-display text-4xl font-black uppercase leading-none md:text-6xl">{c.title}</h3>
            </div>
            <div className="shrink-0 sm:text-right">
              <p className={cn("font-jp text-3xl font-black sm:text-4xl md:text-5xl", accentText[c.accent])}>{c.kanji}</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">{c.reading}</p>
            </div>
          </div>
          <dl className="space-y-6 text-base leading-relaxed md:text-lg">
            <div className="grid gap-1 md:grid-cols-[8rem_1fr] md:items-baseline md:gap-6">
              <dt className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">The ask</dt>
              <dd className="text-white/70">{c.ask}</dd>
            </div>
            <div className="grid gap-1 md:grid-cols-[8rem_1fr] md:items-baseline md:gap-6">
              <dt className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">What I did</dt>
              <dd className="text-white/90">{c.move}</dd>
            </div>
            <div className="grid gap-1 border-t border-white/10 pt-6 md:grid-cols-[8rem_1fr] md:items-baseline md:gap-6">
              <dt className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">What changed</dt>
              <dd className={cn("text-balance font-display text-3xl font-extrabold uppercase leading-tight md:text-4xl", accentText[c.accent])}>{c.result}</dd>
            </div>
          </dl>
        </article>
      </Reveal>
    </div>
  )
}

function Work() {
  return (
    <section id="work" className="relative px-5 pt-32 md:px-10">
      <SectionHead
        kanji="仕事"
        label="The work"
        title={
          <>
            <MaskLine>Work that</MaskLine>
            <MaskLine delay={0.1} className="neon-cyan">
              pays for itself
            </MaskLine>
          </>
        }
        sub="At FULLBEAUTY Brands in New York, I work directly with leadership on what gets built next. Here's the kind of work that comes out of it."
      />
      {cases.map((c, i) => (
        <CaseCard key={c.index} c={c} i={i} />
      ))}
      <Reveal className="mx-auto max-w-3xl pb-10 text-center font-mono text-xs uppercase leading-loose tracking-[0.18em] text-white/45">
        {opsNote}
      </Reveal>
    </section>
  )
}

/* --------------------------------- Method --------------------------------- */

function Method() {
  return (
    <section id="method" className="relative px-5 pt-28 md:px-10 md:pt-40">
      <SectionHead
        kanji="方法"
        label="How I work"
        title={
          <>
            <MaskLine>{method.headline[0]}</MaskLine>
            <MaskLine delay={0.1} className="neon-pink">
              {method.headline[1]}
            </MaskLine>
          </>
        }
      />
      <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2">
        {method.rules.map((r, i) => (
          <div key={r.title} className="group relative bg-[#05040d]/85 p-8 transition-colors duration-500 hover:bg-[#0b0718]/90 md:p-12">
            <Reveal delay={i * 0.08}>
              <span className="font-mono text-xs tracking-[0.3em] text-[#19e6ff]">0{i + 1}</span>
              <h3 className="mt-4 text-balance font-display text-3xl font-black uppercase md:text-4xl">{r.title}</h3>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-white/65">{r.body}</p>
            </Reveal>
            <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-[#ff2a8a] to-[#19e6ff] transition-all duration-700 group-hover:w-full" />
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------- Path ---------------------------------- */

function Path() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] })
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 30 })

  return (
    <section id="path" className="relative px-5 pt-28 md:px-10 md:pt-40">
      <SectionHead
        kanji="経歴"
        label="The path"
        title={
          <>
            <MaskLine>Six years.</MaskLine>
            <MaskLine delay={0.1} className="neon-amber">
              Startups to scale.
            </MaskLine>
          </>
        }
      />
      <ol ref={ref} className="relative ml-2 md:ml-[20%]">
        <span className="absolute left-0 top-0 h-full w-px bg-white/10" />
        <motion.span style={{ scaleY: fill }} className="absolute left-0 top-0 h-full w-px origin-top bg-gradient-to-b from-[#ff2a8a] via-[#8b5cff] to-[#19e6ff] shadow-[0_0_12px_#ff2a8a]" />
        {timeline.map((t, i) => (
          <li key={t.where} className="relative pb-16 pl-8 md:pl-14">
            <span className="absolute -left-[5px] top-[2.5px] h-[11px] w-[11px] rounded-full border border-[#ff2a8a] bg-[#04030c] shadow-[0_0_10px_#ff2a8a]" />
            <Reveal delay={i * 0.05}>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#19e6ff]">{t.when}</p>
              <h3 className="mt-2 text-balance font-display text-3xl font-black uppercase md:text-5xl">{t.where}</h3>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-white/45">{t.role}</p>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/70">{t.what}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* -------------------------------- Projects -------------------------------- */

function TiltCard({ p, i }: { p: (typeof projects)[number]; i: number }) {
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 150, damping: 15 })
  const sry = useSpring(ry, { stiffness: 150, damping: 15 })

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12)
  }

  return (
    <Reveal delay={i * 0.1} y={60} className="[perspective:1200px]">
      <motion.a
        href={p.url}
        target="_blank"
        rel="noreferrer"
        onMouseMove={onMove}
        onMouseLeave={() => {
          rx.set(0)
          ry.set(0)
        }}
        style={{ rotateX: srx, rotateY: sry }}
        className="group relative block overflow-hidden border border-white/10 bg-[#05040d]/90 transition-[border-color,box-shadow] duration-500 hover:border-[#19e6ff] hover:shadow-[0_0_50px_-12px_#19e6ff]"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={p.image}
            alt={p.title}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover opacity-70 grayscale transition-all duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05040d] via-transparent to-transparent" />
          <ArrowUpRight className="absolute right-4 top-4 h-6 w-6 text-white/60 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#19e6ff]" />
        </div>
        <div className="p-6 md:p-8">
          <h3 className="font-display text-3xl font-black uppercase">{p.title}</h3>
          <p className="mt-3 leading-relaxed text-white/65">{p.line}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {p.tools.map((t) => (
              <span key={t} className="border border-white/15 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.a>
    </Reveal>
  )
}

function Projects() {
  return (
    <section id="projects" className="relative px-5 pt-28 md:px-10 md:pt-40">
      <SectionHead
        kanji="作品"
        label="Side projects"
        title={
          <>
            <MaskLine>Built after hours,</MaskLine>
            <MaskLine delay={0.1} className="neon-cyan">
              because I wanted them.
            </MaskLine>
          </>
        }
      />
      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((p, i) => (
          <TiltCard key={p.title} p={p} i={i} />
        ))}
      </div>
      <Reveal className="mt-8 text-center">
        <a href={links.github} target="_blank" rel="noreferrer" className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 transition-colors hover:text-[#19e6ff]">
          More on GitHub ↗
        </a>
      </Reveal>
    </section>
  )
}

function Toolbox() {
  return (
    <section className="relative overflow-hidden py-32" aria-label="Tools">
      {toolbox.map((row, r) => (
        <div key={r} className="flex overflow-hidden py-3 [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
          <div className={cn("marquee flex shrink-0 gap-10 pr-10", r === 1 && "marquee-reverse")}>
            {[...row, ...row].map((t, i) => (
              <span
                key={i}
                className={cn(
                  "whitespace-nowrap font-display text-4xl font-black uppercase md:text-6xl",
                  i % 3 === 0 ? "text-white/85" : "text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.35)]"
                )}
              >
                {t}
                <span className="ml-10 text-[#ff2a8a]">／</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

/* --------------------------------- Contact -------------------------------- */

function Contact() {
  const { setIsOpen } = useChatContext()
  const [copied, setCopied] = useState(false)

  return (
    <section id="contact" className="relative flex min-h-[100svh] flex-col justify-center px-5 pt-32 md:px-10">
      <Reveal>
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-[#ff2a8a]">
          <span className="font-jp mr-3 text-sm">連絡</span>Contact
        </p>
      </Reveal>
      <h2 className="text-balance font-display text-[13vw] font-black uppercase leading-[0.85] md:text-[8vw]">
        <MaskLine>Got a problem</MaskLine>
        <MaskLine delay={0.1} className="neon-pink flicker">
          that won&apos;t go away?
        </MaskLine>
      </h2>
      <Reveal delay={0.2}>
        <p className="mt-8 max-w-xl text-xl text-white/70">Send it over. I like the messy ones.</p>
      </Reveal>
      <Reveal delay={0.3} className="mt-12">
        <button
          onClick={() => {
            navigator.clipboard?.writeText(links.email)
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
          }}
          className="group relative inline-block text-left"
        >
          <span className="break-all font-display text-[8.5vw] font-extrabold lowercase tracking-tight text-white transition-colors group-hover:text-[#19e6ff] sm:text-5xl md:text-6xl">
            {links.email}
          </span>
          <span className="absolute -bottom-2 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#19e6ff] shadow-[0_0_12px_#19e6ff] transition-transform duration-500 group-hover:scale-x-100" />
          <span className="mt-4 block font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
            {copied ? "Copied. Talk soon." : "Click to copy"}
          </span>
        </button>
      </Reveal>
      <Reveal delay={0.4} className="mt-14 flex flex-wrap gap-3">
        <a href={links.linkedin} target="_blank" rel="noreferrer" className="btn-ghost">
          LinkedIn <ArrowUpRight className="h-4 w-4" />
        </a>
        <a href={links.github} target="_blank" rel="noreferrer" className="btn-ghost">
          GitHub <ArrowUpRight className="h-4 w-4" />
        </a>
        <a href={links.x} target="_blank" rel="noreferrer" className="btn-ghost">
          X <ArrowUpRight className="h-4 w-4" />
        </a>
        <a href={links.resume} target="_blank" rel="noreferrer" data-track="resume-contact" className="btn-ghost">
          Resume <Download className="h-4 w-4" />
        </a>
        <button onClick={() => setIsOpen(true)} className="btn-neon">
          Check fit with a JD <MessageCircle className="h-4 w-4" />
        </button>
      </Reveal>
      <footer className="mt-32 flex flex-col gap-4 border-t border-white/10 py-8 font-mono text-[11px] uppercase tracking-[0.25em] text-white/35 md:grid md:pb-[34px] md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6">
        <span>© {new Date().getFullYear()} Akshit Dayal</span>
        <span className="text-balance md:text-center">Three.js, built with passion. Rain included.</span>
        <SiteToggle className="md:mr-20 md:justify-self-end" />
      </footer>
    </section>
  )
}

/* ---------------------------------- Site ---------------------------------- */

export default function NeonSite() {
  return (
    <ReactLenis root options={{ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true }}>
      <ScrollSync />
      <div className="neon-site relative min-h-screen overflow-x-clip bg-[#04030c] font-body text-white antialiased selection:bg-[#ff2a8a] selection:text-black">
        <NeonScene />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[1] bg-[linear-gradient(90deg,rgba(4,3,12,0.78)_0%,rgba(4,3,12,0.35)_45%,rgba(4,3,12,0)_70%)] md:bg-[linear-gradient(90deg,rgba(4,3,12,0.7)_0%,rgba(4,3,12,0.2)_50%,rgba(4,3,12,0)_75%)]"
        />
        <div aria-hidden className="scanlines pointer-events-none fixed inset-0 z-[2]" />
        <Nav />
        <Rail />
        <main className="relative z-10 mx-auto max-w-[1600px]">
          <Hero />
          <Stats />
          <Work />
          <Method />
          <Path />
          <Projects />
          <Toolbox />
          <Contact />
        </main>
      </div>
    </ReactLenis>
  )
}
