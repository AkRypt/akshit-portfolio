"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing"
import { PerformanceMonitor } from "@react-three/drei"
import { useLayoutEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { scrollState } from "./scroll-state"

const PINK = new THREE.Color("#ff2a8a")
const CYAN = new THREE.Color("#19e6ff")
const VIOLET = new THREE.Color("#8b5cff")
const AMBER = new THREE.Color("#ffb020")
const FOG = new THREE.Color("#07051a")
const FOG_DENSITY = 0.011

const CAM_START = 10
const CAM_END = -236

const shared = {
  uTime: { value: 0 },
  uCamZ: { value: CAM_START },
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Sign = {
  text: string
  color: THREE.Color
  x: number
  y: number
  z: number
  vertical?: boolean
  scale?: number
  flicker?: boolean
}

const SIGNS: Sign[] = [
  { text: "問題解決", color: PINK, x: -7.2, y: 7, z: -16, vertical: true, flicker: true },
  { text: "OPEN 24H", color: CYAN, x: 7.4, y: 4.2, z: -28 },
  { text: "売上", color: PINK, x: 7.2, y: 8, z: -52, vertical: true },
  { text: "+19%", color: PINK, x: -7.4, y: 4.6, z: -64 },
  { text: "人工知能", color: VIOLET, x: -7.2, y: 8.5, z: -90, vertical: true },
  { text: "AI", color: CYAN, x: 7.4, y: 5, z: -104 },
  { text: "接続", color: CYAN, x: 7.2, y: 9, z: -124, vertical: true, flicker: true },
  { text: "品質", color: AMBER, x: -7.2, y: 7.5, z: -150, vertical: true },
  { text: "作品", color: CYAN, x: -7.2, y: 8, z: -182, vertical: true },
  { text: "経歴", color: AMBER, x: 7.2, y: 9, z: -204, vertical: true, flicker: true },
  { text: "連絡 · SAY HI", color: PINK, x: 0, y: 9.5, z: -258, scale: 2.2 },
]

const FOG_GLSL = /* glsl */ `
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  vec3 applyFog(vec3 col, float depth) {
    float f = 1.0 - exp(-pow(depth * uFogDensity, 2.0));
    return mix(col, uFogColor, clamp(f, 0.0, 1.0));
  }
`

const HASH_GLSL = /* glsl */ `
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
`

/* ---------------------------------- City ---------------------------------- */

function City() {
  const ref = useRef<THREE.InstancedMesh>(null)

  const buildings = useMemo(() => {
    const rand = mulberry32(7)
    const items: { x: number; y: number; z: number; sx: number; sy: number; sz: number }[] = []
    for (const side of [-1, 1]) {
      for (let row = 0; row < 2; row++) {
        let z = 30
        while (z > -330) {
          const len = 5 + rand() * 9
          const depth = 6 + rand() * 8
          const height = row === 0 ? 6 + rand() * 22 : 20 + rand() * 48
          const x = side * (8 + row * 15 + depth / 2 + rand() * 1.5)
          const gap = 0.6 + rand() * 1.6
          items.push({ x, y: height / 2, z: z - len / 2, sx: depth, sy: height, sz: len - gap })
          z -= len + rand() * 1.2
        }
      }
    }
    return items
  }, [])

  const geometry = useMemo(() => {
    const g = new THREE.BoxGeometry(1, 1, 1)
    const rand = mulberry32(42)
    const r = new Float32Array(buildings.length).map(() => rand())
    g.setAttribute("aRand", new THREE.InstancedBufferAttribute(r, 1))
    return g
  }, [buildings])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: shared.uTime,
          uPink: { value: PINK },
          uCyan: { value: CYAN },
          uFogColor: { value: FOG },
          uFogDensity: { value: FOG_DENSITY },
        },
        vertexShader: /* glsl */ `
          attribute float aRand;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vScale;
          varying float vRand;
          varying float vDepth;
          void main() {
            vec4 world = modelMatrix * instanceMatrix * vec4(position, 1.0);
            vScale = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
            vUv = uv;
            vNormal = normal;
            vRand = aRand;
            vec4 mv = viewMatrix * world;
            vDepth = -mv.z;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform vec3 uPink;
          uniform vec3 uCyan;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vScale;
          varying float vRand;
          varying float vDepth;
          ${HASH_GLSL}
          ${FOG_GLSL}
          void main() {
            bool roof = abs(vNormal.y) > 0.5;
            vec2 size = abs(vNormal.x) > 0.5 ? vScale.zy : (abs(vNormal.z) > 0.5 ? vScale.xy : vScale.xz);
            vec2 p = vUv * size;
            vec2 ed = min(p, size - p);

            float edge = 1.0 - smoothstep(0.0, 0.07, min(ed.x, ed.y));
            float edgeOn = step(0.45, vRand);
            vec3 edgeCol = mix(uPink, uCyan, step(0.72, vRand));

            vec2 cell = vec2(1.1, 1.45);
            vec2 id = floor(p / cell);
            vec2 f = fract(p / cell);
            float win = step(0.22, f.x) * step(f.x, 0.78) * step(0.28, f.y) * step(f.y, 0.72);
            win *= step(0.7, ed.x) * step(1.2, ed.y) * (roof ? 0.0 : 1.0);
            float h = hash(id + vRand * 91.0);
            float lit = step(0.7, h);
            float flick = 0.75 + 0.25 * sin(uTime * (0.6 + h * 2.0) + h * 40.0);
            vec3 warm = vec3(1.0, 0.62, 0.32);
            vec3 cool = vec3(0.45, 0.75, 1.0);
            vec3 winCol = mix(warm, cool, step(0.55, hash(id.yx + vRand * 13.0)));

            float grad = clamp(p.y / max(size.y, 1.0), 0.0, 1.0);
            vec3 col = vec3(0.010, 0.011, 0.026) + vec3(0.02, 0.0, 0.05) * (1.0 - grad);
            col += win * lit * winCol * 0.55 * flick;
            col += edge * edgeOn * edgeCol * (roof ? 0.8 : 1.6);

            gl_FragColor = vec4(applyFog(col, vDepth), 1.0);
          }
        `,
      }),
    []
  )

  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const m = new THREE.Matrix4()
    buildings.forEach((b, i) => {
      m.compose(new THREE.Vector3(b.x, b.y, b.z), new THREE.Quaternion(), new THREE.Vector3(b.sx, b.sy, b.sz))
      mesh.setMatrixAt(i, m)
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [buildings])

  const beacons = useMemo(() => {
    const pts: number[] = []
    buildings.forEach((b, i) => {
      if (b.sy > 30 && i % 2 === 0) pts.push(b.x, b.sy + 0.6, b.z)
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3))
    return g
  }, [buildings])

  const beaconMat = useRef<THREE.PointsMaterial>(null)
  useFrame(({ clock }) => {
    if (beaconMat.current) beaconMat.current.opacity = 0.35 + 0.65 * (Math.sin(clock.elapsedTime * 2.2) * 0.5 + 0.5)
  })

  return (
    <>
      <instancedMesh ref={ref} args={[geometry, material, buildings.length]} frustumCulled={false} />
      <points geometry={beacons}>
        <pointsMaterial ref={beaconMat} color={[4, 0.3, 0.3]} size={0.5} sizeAttenuation transparent toneMapped={false} depthWrite={false} />
      </points>
    </>
  )
}

/* --------------------------------- Ground --------------------------------- */

function Ground() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: shared.uTime,
          uSignPos: { value: SIGNS.map((s) => new THREE.Vector3(s.x, s.y, s.z)) },
          uSignCol: { value: SIGNS.map((s) => s.color) },
          uFogColor: { value: FOG },
          uFogDensity: { value: FOG_DENSITY },
        },
        vertexShader: /* glsl */ `
          varying vec3 vWorld;
          varying float vDepth;
          void main() {
            vec4 world = modelMatrix * vec4(position, 1.0);
            vWorld = world.xyz;
            vec4 mv = viewMatrix * world;
            vDepth = -mv.z;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          #define N ${SIGNS.length}
          uniform float uTime;
          uniform vec3 uSignPos[N];
          uniform vec3 uSignCol[N];
          varying vec3 vWorld;
          varying float vDepth;
          ${HASH_GLSL}
          ${FOG_GLSL}
          void main() {
            vec2 xz = vWorld.xz;
            float puddle = smoothstep(0.35, 0.75, noise(xz * 0.18) * 0.7 + noise(xz * 0.9) * 0.3);

            vec3 col = vec3(0.008, 0.009, 0.02);

            vec2 g = xz / 2.0;
            vec2 gl = abs(fract(g - 0.5) - 0.5) / fwidth(g);
            float line = 1.0 - min(min(gl.x, gl.y), 1.0);
            col += line * vec3(0.18, 0.04, 0.3) * 0.5;

            float dash = (1.0 - smoothstep(0.04, 0.07, abs(xz.x))) * step(0.6, fract(xz.y / 5.0));
            col += dash * vec3(0.06, 0.07, 0.09);
            float curb = (1.0 - smoothstep(0.0, 0.12, abs(abs(xz.x) - 7.6)));
            col += curb * vec3(0.1, 0.5, 0.6) * 0.6;

            vec3 refl = vec3(0.0);
            for (int i = 0; i < N; i++) {
              vec3 sp = uSignPos[i];
              float dx = xz.x - sp.x;
              float dz = xz.y - sp.z;
              float spread = 0.5 + sp.y * 0.08;
              refl += uSignCol[i] * exp(-dx * dx / spread) * exp(-dz * dz * 0.008) ;
            }
            float ripple = 0.85 + 0.15 * sin(xz.y * 3.0 + uTime * 2.0 + noise(xz * 2.0) * 6.0);
            col += refl * (0.12 + puddle * 0.9) * ripple;

            gl_FragColor = vec4(applyFog(col, vDepth), 1.0);
          }
        `,
      }),
    []
  )

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, -140]} material={material}>
      <planeGeometry args={[90, 460, 1, 1]} />
    </mesh>
  )
}

/* ---------------------------------- Rain ---------------------------------- */

function Rain({ count }: { count: number }) {
  const geometry = useMemo(() => {
    const rand = mulberry32(3)
    const pos = new Float32Array(count * 6)
    const tip = new Float32Array(count * 2)
    for (let i = 0; i < count; i++) {
      const x = (rand() - 0.5) * 44
      const y = rand() * 30
      const z = rand() * 70
      pos.set([x, y, z, x, y, z], i * 6)
      tip.set([0, 1], i * 2)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    g.setAttribute("aTip", new THREE.BufferAttribute(tip, 1))
    return g
  }, [count])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: shared.uTime, uCamZ: shared.uCamZ },
        vertexShader: /* glsl */ `
          uniform float uTime;
          uniform float uCamZ;
          attribute float aTip;
          varying float vTip;
          void main() {
            float D = 70.0;
            float H = 30.0;
            float speed = 22.0 + fract(position.x * 13.7) * 8.0;
            float y = mod(position.y - uTime * speed, H);
            float rz = mod(position.z - uCamZ, D) - D * 0.85;
            vec3 p = vec3(position.x + aTip * 0.06, y + aTip * 0.7, uCamZ + rz);
            vTip = aTip;
            gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vTip;
          void main() {
            gl_FragColor = vec4(vec3(0.55, 0.7, 1.0) * 0.55, vTip * 0.6);
          }
        `,
      }),
    []
  )

  return <lineSegments geometry={geometry} material={material} frustumCulled={false} />
}

/* ---------------------------------- Signs --------------------------------- */

function makeSignTexture(text: string, vertical: boolean) {
  const font = (s: number) => `900 ${s}px "Yu Gothic", "Hiragino Sans", "Noto Sans JP", "Meiryo", system-ui, sans-serif`
  const size = 150
  const pad = 46
  const chars = vertical ? Array.from(text) : [text]
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!
  ctx.font = font(size)
  const width = vertical ? size + pad * 2 : Math.ceil(ctx.measureText(text).width) + pad * 2.6
  const height = vertical ? chars.length * size * 1.08 + pad * 2 : size + pad * 2
  canvas.width = width
  canvas.height = height

  ctx.fillStyle = "#07060d"
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = "#ffffff"
  ctx.shadowColor = "#ffffff"
  ctx.lineWidth = 7
  ctx.shadowBlur = 18
  ctx.strokeRect(16, 16, width - 32, height - 32)

  ctx.font = font(size)
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillStyle = "#ffffff"
  for (let pass = 0; pass < 2; pass++) {
    ctx.shadowBlur = pass === 0 ? 36 : 8
    chars.forEach((c, i) => {
      const y = vertical ? pad + size * 1.08 * (i + 0.5) : height / 2 + size * 0.04
      ctx.fillText(c, width / 2, y)
    })
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return { tex, aspect: width / height, rows: chars.length }
}

function NeonSign({ sign }: { sign: Sign }) {
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  const { tex, aspect, rows } = useMemo(() => makeSignTexture(sign.text, !!sign.vertical), [sign])
  const base = useMemo(() => sign.color.clone().multiplyScalar(2.4), [sign])
  const side = Math.sign(sign.x)
  const h = (sign.vertical ? rows * 1.25 + 0.8 : side !== 0 ? 0.9 : 1.5) * (sign.scale ?? 1)
  const w = h * aspect
  const x = side !== 0 && !sign.vertical ? side * (7.9 - w / 2) : sign.x
  const seed = useMemo(() => Math.random() * 100, [])

  useFrame(({ clock }) => {
    if (!sign.flicker || !mat.current) return
    const t = clock.elapsedTime + seed
    const drop = Math.sin(t * 17.0) * Math.sin(t * 5.3) * Math.sin(t * 1.1) > 0.55
    mat.current.color.copy(base).multiplyScalar(drop ? 0.18 : 1)
  })

  return (
    <group position={[x, sign.y, sign.z]}>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial ref={mat} map={tex} color={base} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      {side !== 0 && (
        <mesh position={[side * (w / 2 + 0.4), h / 2 - 0.3, -0.05]}>
          <boxGeometry args={[0.8, 0.08, 0.08]} />
          <meshBasicMaterial color="#111" />
        </mesh>
      )}
    </group>
  )
}

/* --------------------------------- Horizon -------------------------------- */

function Horizon() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        fog: false,
        uniforms: { uTime: shared.uTime, uPink: { value: PINK }, uViolet: { value: VIOLET }, uAmber: { value: AMBER } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform vec3 uPink;
          uniform vec3 uViolet;
          uniform vec3 uAmber;
          varying vec2 vUv;
          void main() {
            vec2 p = vUv - vec2(0.5, 0.1);
            p.x *= 520.0 / 150.0;
            float r = length(p);
            float glow = exp(-pow(vUv.y - 0.08, 2.0) * 18.0);
            float pulse = 0.9 + 0.1 * sin(uTime * 0.5);
            vec3 col = mix(uViolet, uPink, glow) * glow * 0.45 * pulse;
            col += mix(uPink, uAmber, 0.25) * exp(-r * 3.2) * 0.35 * pulse;

            float a = clamp(max(max(col.r, col.g), col.b), 0.0, 1.0);
            gl_FragColor = vec4(col, a);
          }
        `,
      }),
    []
  )
  return (
    <mesh position={[0, 28, -360]} material={material}>
      <planeGeometry args={[520, 150]} />
    </mesh>
  )
}

function Sun() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        fog: false,
        uniforms: { uTime: shared.uTime },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            vec2 p = (vUv - 0.5) * 2.0;
            float r = length(p);
            float R = 0.62;
            float disc = 1.0 - smoothstep(R - 0.006, R, r);

            float y = p.y / R;
            float band = fract(y * 7.0 + uTime * 0.04);
            float gap = clamp((0.2 - y) * 0.42, 0.0, 0.6);
            float slits = smoothstep(gap - 0.02, gap + 0.02, band);

            float t = clamp(y * 0.5 + 0.5, 0.0, 1.0);
            vec3 bottom = vec3(0.75, 0.04, 0.52);
            vec3 mid = vec3(1.0, 0.16, 0.54);
            vec3 top = vec3(1.0, 0.72, 0.62);
            vec3 sun = t < 0.55 ? mix(bottom, mid, t / 0.55) : mix(mid, top, (t - 0.55) / 0.45);

            float halo = exp(-max(r - R, 0.0) * 5.0) * (1.0 - disc) * 0.4;
            vec3 col = sun * disc * slits * 0.95 + vec3(1.0, 0.18, 0.55) * halo;
            float a = clamp(disc * slits + halo, 0.0, 1.0);
            gl_FragColor = vec4(col, a);
          }
        `,
      }),
    []
  )
  return (
    <mesh position={[0, 58, -385]} material={material}>
      <planeGeometry args={[170, 170]} />
    </mesh>
  )
}

/* ----------------------------------- Rig ---------------------------------- */

function Rig() {
  const { camera, size } = useThree()
  const s = useRef({ p: 0, mx: 0, my: 0 })
  const look = useMemo(() => new THREE.Vector3(), [])

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    cam.fov = size.width / size.height < 0.8 ? 78 : size.width / size.height < 1.2 ? 70 : 62
    cam.updateProjectionMatrix()
  }, [camera, size])

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05)
    const st = s.current
    st.p = THREE.MathUtils.damp(st.p, scrollState.progress, 5, d)
    st.mx = THREE.MathUtils.damp(st.mx, state.pointer.x, 2.5, d)
    st.my = THREE.MathUtils.damp(st.my, state.pointer.y, 2.5, d)

    const t = st.p
    const z = THREE.MathUtils.lerp(CAM_START, CAM_END, t)
    const x = Math.sin(t * Math.PI * 3) * 1.1 + st.mx * 0.5
    const y = 2.3 + Math.sin(t * Math.PI) * 2.4 + st.my * 0.35 + Math.sin(state.clock.elapsedTime * 0.8) * 0.06

    camera.position.set(x, y, z)
    look.set(x * 0.35 + st.mx * 2.2, y + 1.1 + st.my * 1.0, z - 20)
    camera.lookAt(look)
    camera.rotateZ(-Math.cos(t * Math.PI * 3) * 0.035 - st.mx * 0.02)

    shared.uTime.value = state.clock.elapsedTime
    shared.uCamZ.value = z
  })
  return null
}

/* ---------------------------------- Scene --------------------------------- */

export default function NeonScene() {
  const mobile = useMemo(() => typeof window !== "undefined" && window.innerWidth < 768, [])
  const maxDpr = mobile ? 1.25 : 1.5
  const [dpr, setDpr] = useState(maxDpr)
  const [ready, setReady] = useState(false)
  const rainCount = mobile ? 1200 : 3200

  return (
    <div
      className="fixed inset-x-0 top-0 z-0 h-[100lvh] transition-opacity duration-[1600ms] ease-out"
      style={{ opacity: ready ? 1 : 0 }}
      aria-hidden
    >
      <Canvas
        dpr={dpr}
        gl={{ antialias: false, powerPreference: "high-performance", stencil: false }}
        camera={{ fov: 62, near: 0.1, far: 520, position: [0, 2.3, CAM_START] }}
        onCreated={() => requestAnimationFrame(() => setReady(true))}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(maxDpr)} />
        <color attach="background" args={["#04030c"]} />
        <fogExp2 attach="fog" args={[FOG, FOG_DENSITY]} />
        <Rig />
        <Sun />
        <Horizon />
        <City />
        <Ground />
        {SIGNS.map((s) => (
          <NeonSign key={s.text} sign={s} />
        ))}
        <Rain count={rainCount} />
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.45} luminanceSmoothing={0.25} radius={0.72} />
          <Noise opacity={0.045} />
          <Vignette offset={0.28} darkness={0.85} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
