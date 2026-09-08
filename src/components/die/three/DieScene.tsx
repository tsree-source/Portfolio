import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { dieRegions, type DieRegionId } from '../../../data/content'
import { C } from '../../system/palette'
import {
  CORE,
  OVERVIEW,
  PACKAGE,
  REGIONS,
  SILHOUETTE,
  SPINE,
  SURFACE_Y,
  regionView,
  tapPath,
} from './dieLayout'

/**
 * The Hardware Engineer die, in three dimensions.
 *
 * This is the one place on the site where 3D earns its keep: a floorplan is a
 * spatial object, and depth is what makes "these are regions of one piece of
 * silicon" legible in a way a flat diagram cannot manage. Everything else —
 * headings, annotations, region names, the capability index — stays in the DOM.
 *
 * The camera never orbits on its own and never follows the pointer freely. It
 * moves between framings that the scroll state machine chooses, damped, and
 * reverses cleanly when the reader scrolls back.
 */

export type DieSceneProps = {
  /** Scroll state from the pinned scene. */
  state: number
  active: DieRegionId | null
  onActivate: (id: DieRegionId | null) => void
  onSelect: (id: DieRegionId) => void
  reduced: boolean
  /** Render only while the scene is on screen. */
  inView: boolean
}

/* State machine, shared with DieSection:
   0 silhouette · 1 die reveal · 2 interconnect · 3–8 each region · 9 whole die */
const FIRST_REGION_STATE = 3

export default function DieScene(props: DieSceneProps) {
  const dpr = useMemo<[number, number]>(
    () => [1, Math.min(1.75, typeof window === 'undefined' ? 1 : window.devicePixelRatio)],
    [],
  )

  return (
    <Canvas
      // Frames are only rendered while the die is on screen. Off screen the
      // loop stops entirely rather than idling.
      frameloop={props.inView ? 'always' : 'never'}
      dpr={dpr}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
      camera={{ fov: 32, near: 0.1, far: 60, position: [...SILHOUETTE.position] }}
      style={{ width: '100%', height: '100%' }}
    >
      <SceneContents {...props} />
    </Canvas>
  )
}

function SceneContents({ state, active, onActivate, onSelect, reduced }: DieSceneProps) {
  return (
    <>
      <Lighting state={state} />
      <CameraRig state={state} active={active} reduced={reduced} />

      <group position={[0, -0.2, 0]}>
        <Package />
        <Core reveal={state >= 1} />
        <IoPerimeter />
        <Interconnect live={state >= 2} active={active} reduced={reduced} />
        {dieRegions.map((region) => (
          <Region
            key={region.id}
            id={region.id}
            active={active === region.id}
            dimmed={active !== null && active !== region.id}
            revealed={state >= 1}
            onActivate={onActivate}
            onSelect={onSelect}
          />
        ))}
        <MemoryArray live={state >= 2} active={active === 'current'} />
      </group>
    </>
  )
}

/* ---------------------------------------------------------------------------
 * Lighting — warm key, jade fill, nothing else.
 * -------------------------------------------------------------------------*/
function Lighting({ state }: { state: number }) {
  const key = useRef<THREE.DirectionalLight>(null)
  const target = state === 0 ? 0.35 : 1

  useFrame((_, delta) => {
    if (!key.current) return
    key.current.intensity = THREE.MathUtils.damp(key.current.intensity, 3.4 * target, 3, delta)
  })

  return (
    <>
      <ambientLight intensity={0.14} color="#0b171b" />
      {/* Sunrise key, from the same direction as the light in the opening. */}
      <directionalLight ref={key} position={[6, 9, 4]} intensity={0.4} color="#ffd9a0" />
      {/* Jade bounce, so the shadowed side is not dead. */}
      <directionalLight position={[-7, 3, -5]} intensity={0.16} color={C.flow} />
      {/* A cool rim to separate the package from the background. */}
      <directionalLight position={[0, 2, -9]} intensity={0.22} color="#8fb6ff" />
    </>
  )
}

/* ---------------------------------------------------------------------------
 * Camera — moved by state, never by the pointer alone.
 * -------------------------------------------------------------------------*/
function CameraRig({
  state,
  active,
  reduced,
}: {
  state: number
  active: DieRegionId | null
  reduced: boolean
}) {
  const { camera, size } = useThree()
  const look = useRef(new THREE.Vector3(...OVERVIEW.target))
  const pointer = useRef({ x: 0, y: 0 })

  // Very small pointer parallax — enough to feel physical, never enough to
  // become a control. Disabled entirely for reduced motion and touch.
  useEffect(() => {
    if (reduced) return
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2
      pointer.current.y = (event.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced])

  const framing = useMemo(() => {
    if (state === 0) return SILHOUETTE
    if (state >= FIRST_REGION_STATE && active) return regionView(active)
    return OVERVIEW
  }, [state, active])

  useFrame((_, delta) => {
    // Narrow viewports need the camera further back to keep the die framed.
    const pull = size.width < 900 ? 1.34 : size.width < 1300 ? 1.12 : 1

    const px = reduced ? 0 : pointer.current.x * 0.35
    const py = reduced ? 0 : -pointer.current.y * 0.22

    const targetPos = new THREE.Vector3(
      framing.position[0] * pull + px,
      framing.position[1] * (pull * 0.55 + 0.45) + py,
      framing.position[2] * pull,
    )

    // Reduced motion still changes framing — it just arrives almost at once,
    // so no large movement is animated across the screen.
    const lambda = reduced ? 14 : 2.4
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPos.x, lambda, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPos.y, lambda, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPos.z, lambda, delta)

    look.current.x = THREE.MathUtils.damp(look.current.x, framing.target[0], lambda, delta)
    look.current.y = THREE.MathUtils.damp(look.current.y, framing.target[1], lambda, delta)
    look.current.z = THREE.MathUtils.damp(look.current.z, framing.target[2], lambda, delta)
    camera.lookAt(look.current)
  })

  return null
}

/* ---------------------------------------------------------------------------
 * The package and die
 * -------------------------------------------------------------------------*/
function Package() {
  return (
    <mesh position={[0, 0, 0]} receiveShadow>
      <boxGeometry args={[PACKAGE.w, PACKAGE.h, PACKAGE.d]} />
      <meshStandardMaterial color="#080e11" roughness={0.88} metalness={0.16} />
    </mesh>
  )
}

function Core({ reveal }: { reveal: boolean }) {
  const material = useRef<THREE.MeshStandardMaterial>(null)

  useFrame((_, delta) => {
    if (!material.current) return
    material.current.emissiveIntensity = THREE.MathUtils.damp(
      material.current.emissiveIntensity,
      reveal ? 0.04 : 0.008,
      3,
      delta,
    )
  })

  return (
    <mesh position={[0, PACKAGE.h / 2 + CORE.h / 2, 0]}>
      <boxGeometry args={[CORE.w, CORE.h, CORE.d]} />
      <meshStandardMaterial
        ref={material}
        color="#050a0c"
        roughness={0.34}
        metalness={0.68}
        emissive={C.flow}
        emissiveIntensity={0.02}
      />
    </mesh>
  )
}

/** I/O pads around the package edge, instanced. */
function IoPerimeter() {
  const mesh = useRef<THREE.InstancedMesh>(null)

  const pads = useMemo(() => {
    const out: { x: number; z: number; rot: number }[] = []
    const halfW = PACKAGE.w / 2 - 0.34
    const halfD = PACKAGE.d / 2 - 0.34
    for (let x = -halfW; x <= halfW; x += 0.42) {
      out.push({ x, z: -halfD, rot: 0 })
      out.push({ x, z: halfD, rot: 0 })
    }
    for (let z = -halfD + 0.5; z <= halfD - 0.5; z += 0.42) {
      out.push({ x: -halfW, z, rot: Math.PI / 2 })
      out.push({ x: halfW, z, rot: Math.PI / 2 })
    }
    return out
  }, [])

  useEffect(() => {
    if (!mesh.current) return
    const dummy = new THREE.Object3D()
    pads.forEach((pad, i) => {
      dummy.position.set(pad.x, PACKAGE.h / 2 + 0.012, pad.z)
      dummy.rotation.set(0, pad.rot, 0)
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  }, [pads])

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, pads.length]}>
      <boxGeometry args={[0.26, 0.03, 0.1]} />
      <meshStandardMaterial color="#243c44" roughness={0.34} metalness={0.9} />
    </instancedMesh>
  )
}

/* ---------------------------------------------------------------------------
 * Interconnect — the spine, the taps, and the signals running them
 * -------------------------------------------------------------------------*/
function Interconnect({
  live,
  active,
  reduced,
}: {
  live: boolean
  active: DieRegionId | null
  reduced: boolean
}) {
  const y = SURFACE_Y + 0.008

  return (
    <group>
      {/* Spine lanes */}
      {SPINE.lanes.map((offset, index) => (
        <Trace
          key={offset}
          from={[SPINE.x0, y, SPINE.z + offset]}
          to={[SPINE.x1, y, SPINE.z + offset]}
          width={index === 1 ? 0.05 : 0.03}
          live={live}
          highlight={active !== null}
        />
      ))}

      {/* Each region's tap into the spine */}
      {dieRegions.map((region) => {
        const tap = tapPath(region.id)
        return (
          <Trace
            key={region.id}
            from={[tap.x, y, tap.z0]}
            to={[tap.x, y, tap.z1]}
            width={active === region.id ? 0.07 : 0.035}
            live={live}
            highlight={active === region.id}
            dim={active !== null && active !== region.id}
          />
        )
      })}

      {live && !reduced && <SignalPulses active={active} />}
    </group>
  )
}

/** An etched conductor. Flat boxes rather than lines, so they catch the key light. */
function Trace({
  from,
  to,
  width,
  live,
  highlight = false,
  dim = false,
}: {
  from: [number, number, number]
  to: [number, number, number]
  width: number
  live: boolean
  highlight?: boolean
  dim?: boolean
}) {
  const material = useRef<THREE.MeshStandardMaterial>(null)

  const { position, scale, rotation } = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const mid = a.clone().add(b).multiplyScalar(0.5)
    const length = a.distanceTo(b)
    const alongX = Math.abs(b.x - a.x) > Math.abs(b.z - a.z)
    return {
      position: mid.toArray() as [number, number, number],
      scale: (alongX ? [length, 1, width] : [width, 1, length]) as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
    }
  }, [from, to, width])

  useFrame((_, delta) => {
    if (!material.current) return
    const target = !live ? 0.015 : highlight ? 0.85 : dim ? 0.05 : 0.2
    material.current.emissiveIntensity = THREE.MathUtils.damp(
      material.current.emissiveIntensity,
      target,
      3.5,
      delta,
    )
    const colour = new THREE.Color(highlight ? C.active : C.flow)
    material.current.emissive.lerp(colour, 1 - Math.exp(-4 * delta))
  })

  return (
    <mesh position={position} scale={scale} rotation={rotation}>
      <boxGeometry args={[1, 0.016, 1]} />
      <meshStandardMaterial
        ref={material}
        color="#0e1c21"
        roughness={0.3}
        metalness={0.85}
        emissive={C.flow}
        emissiveIntensity={0.02}
      />
    </mesh>
  )
}

/** A few packets travelling the spine. Gold when a region is selected. */
function SignalPulses({ active }: { active: DieRegionId | null }) {
  const group = useRef<THREE.Group>(null)
  const count = 3

  useFrame((clock) => {
    if (!group.current) return
    const t = clock.clock.elapsedTime
    group.current.children.forEach((child, i) => {
      const phase = (t * 0.24 + i / count) % 1
      child.position.x = THREE.MathUtils.lerp(SPINE.x0, SPINE.x1, phase)
      const fade = Math.sin(phase * Math.PI)
      ;(child as THREE.Mesh).scale.setScalar(0.6 + fade * 0.7)
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
      material.opacity = fade * 0.85
    })
  })

  return (
    <group ref={group}>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i} position={[0, SURFACE_Y + 0.03, SPINE.z]}>
          <boxGeometry args={[0.34, 0.02, 0.07]} />
          <meshBasicMaterial color={active ? C.active : C.flow} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  )
}

/* ---------------------------------------------------------------------------
 * A functional region
 * -------------------------------------------------------------------------*/
function Region({
  id,
  active,
  dimmed,
  revealed,
  onActivate,
  onSelect,
}: {
  id: DieRegionId
  active: boolean
  dimmed: boolean
  revealed: boolean
  onActivate: (id: DieRegionId | null) => void
  onSelect: (id: DieRegionId) => void
}) {
  const r = REGIONS[id]
  const mesh = useRef<THREE.Mesh>(null)
  const material = useRef<THREE.MeshStandardMaterial>(null)

  useFrame((_, delta) => {
    if (!mesh.current || !material.current) return

    // The live region lifts very slightly off the surface.
    const lift = active ? 0.12 : 0
    mesh.current.position.y = THREE.MathUtils.damp(
      mesh.current.position.y,
      SURFACE_Y + r.h / 2 + lift,
      4,
      delta,
    )

    const target = !revealed ? 0.015 : active ? 0.34 : dimmed ? 0.02 : 0.07
    material.current.emissiveIntensity = THREE.MathUtils.damp(
      material.current.emissiveIntensity,
      target,
      4,
      delta,
    )
    material.current.emissive.lerp(
      new THREE.Color(active ? C.active : C.flow),
      1 - Math.exp(-5 * delta),
    )
  })

  return (
    <mesh
      ref={mesh}
      position={[r.x, SURFACE_Y + r.h / 2, r.z]}
      onPointerOver={(e) => {
        e.stopPropagation()
        onActivate(id)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        onActivate(null)
        document.body.style.cursor = ''
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(id)
      }}
    >
      <boxGeometry args={[r.w, r.h, r.d]} />
      <meshStandardMaterial
        ref={material}
        color={active ? '#12171a' : '#080d10'}
        roughness={0.3}
        metalness={0.74}
        emissive={C.flow}
        emissiveIntensity={0.02}
      />

      {/* The region name is real DOM, anchored to the block it belongs to.
          Nothing readable is drawn into the WebGL surface. */}
      {revealed && <RegionLabel id={id} active={active} dimmed={dimmed} />}
    </mesh>
  )
}

/**
 * Just the region name, centred on its block.
 *
 * An earlier version also printed the sub-title here. Six names plus six
 * sub-titles projected onto an obliquely-viewed floorplan collided into an
 * unreadable pile — and the sub-title is already in the annotation column,
 * where there is room for it. On a drawing, the label on the part is the part
 * number; the description lives in the margin.
 */
function RegionLabel({
  id,
  active,
  dimmed,
}: {
  id: DieRegionId
  active: boolean
  dimmed: boolean
}) {
  const region = dieRegions.find((r) => r.id === id)!
  const r = REGIONS[id]

  return (
    <Html
      position={[0, r.h / 2 + 0.02, 0]}
      center
      pointerEvents="none"
      zIndexRange={[10, 0]}
      style={{ pointerEvents: 'none', userSelect: 'none' }}
    >
      <span
        className="block whitespace-nowrap font-mono text-[0.625rem] tracking-[0.22em] transition-all duration-500"
        style={{
          color: active ? C.active : C.parchment,
          opacity: dimmed ? 0.28 : active ? 1 : 0.7,
        }}
      >
        {region.name}
      </span>
    </Html>
  )
}

/**
 * A memory-array texture on the CURRENT region — the block that is actually
 * about a 64 × 24-bit memory. Instanced, so the pattern costs one draw call.
 */
function MemoryArray({ live, active }: { live: boolean; active: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const material = useRef<THREE.MeshStandardMaterial>(null)
  const r = REGIONS.current

  const cells = useMemo(() => {
    const out: [number, number][] = []
    const cols = 8
    const rows = 5
    const padX = 0.2
    const padZ = 0.2
    const stepX = (r.w - padX * 2) / cols
    const stepZ = (r.d - padZ * 2 - 0.34) / rows
    for (let c = 0; c < cols; c += 1) {
      for (let row = 0; row < rows; row += 1) {
        out.push([
          r.x - r.w / 2 + padX + stepX * (c + 0.5),
          r.z - r.d / 2 + padZ + 0.34 + stepZ * (row + 0.5),
        ])
      }
    }
    return out
  }, [r])

  useEffect(() => {
    if (!mesh.current) return
    const dummy = new THREE.Object3D()
    cells.forEach(([x, z], i) => {
      dummy.position.set(x, SURFACE_Y + r.h + 0.012, z)
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  }, [cells, r.h])

  useFrame((_, delta) => {
    if (!material.current) return
    material.current.emissiveIntensity = THREE.MathUtils.damp(
      material.current.emissiveIntensity,
      !live ? 0 : active ? 0.6 : 0.12,
      4,
      delta,
    )
    material.current.emissive.lerp(
      new THREE.Color(active ? C.active : C.flow),
      1 - Math.exp(-5 * delta),
    )
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, cells.length]}>
      <boxGeometry args={[0.16, 0.02, 0.14]} />
      <meshStandardMaterial
        ref={material}
        color="#0c1518"
        roughness={0.4}
        metalness={0.7}
        emissive={C.flow}
        emissiveIntensity={0}
      />
    </instancedMesh>
  )
}
