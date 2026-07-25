'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three-stdlib';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, PerformanceMonitor, Text } from '@react-three/drei';

// ---------------------------------------------------------------------------
// Brand metaphor: the cube starts loosely scrambled ("scattered ideas") and
// only locks into a polished, glowing, labeled state while the visitor is
// actively engaging with it ("structured growth"). Losing focus lets a little
// entropy back in, so the "organize it" moment is something you can repeat,
// not a one-shot intro animation.
// ---------------------------------------------------------------------------

// Curated premium palette. "obsidian" is the neutral glass-shell tone that
// every cubelet's outer shell shares; the other five are the vivid accent
// tones distributed across the inner "core" inserts and the six face labels.
const PALETTE = {
  obsidian: '#0B0D12',
  deepCyan: '#0E7C86',
  electricIndigo: '#6C4BFF',
  neonTeal: '#28E0C4',
  softRoseCoral: '#FF8F79',
  brightViolet: '#A64BFF',
} as const;

const ACCENT_COLORS = [
  PALETTE.deepCyan,
  PALETTE.electricIndigo,
  PALETTE.neonTeal,
  PALETTE.softRoseCoral,
  PALETTE.brightViolet,
] as const;

const SPACING = 1.05;
const CUBELET_SIZE = 0.92;
const CORE_SIZE = CUBELET_SIZE * 0.52; // inner PBR insert, peeking through the frosted shell
const MOVE_DURATION = 380; // ms per quarter-turn
const MOVE_GAP = 90; // ms between moves within a batch
const SETTLE_PAUSE = 650; // ms pause after a batch completes
const AMBIENT_SHUFFLE_DELAY = 2600; // ms between idle "scattered" nudges while resting unsolved
const RESCRAMBLE_DELAY = 1100; // ms after losing hover before entropy creeps back in
const CUBE_SCALE = 0.72;
const FACE_LABEL_OFFSET = SPACING * 2.05; // distance of each label plane from the cube's center

type Axis = 'x' | 'y' | 'z';
type Move = { axis: Axis; layer: 1 | -1; dir: 1 | -1 };
type Stage = 'scrambled' | 'solving' | 'solved';

// The 6 core services, fixed to the 6 faces of the cube. Order matters: it
// maps 1:1 to FACE_DEFS below. The parent only needs to supply a label (and
// optionally an icon glyph) per id -- it doesn't need to know which face
// anything lands on.
export const SERVICE_FACE_ORDER = [
  'smm',
  'seo',
  'aiSystems',
  'growthStrategy',
  'webDesign',
  'graphicDesign',
] as const;

export type ServiceId = (typeof SERVICE_FACE_ORDER)[number];

export type CubeService = {
  label: string;
  glyph?: string; // short symbol/initial rendered on the face, e.g. "AI", "SEO"
};

type FaceDef = {
  serviceId: ServiceId;
  axis: Axis;
  sign: 1 | -1;
  rotation: [number, number, number];
  glowColor: string;
};

const FACE_DEFS: FaceDef[] = [
  { serviceId: 'smm', axis: 'x', sign: 1, rotation: [0, Math.PI / 2, 0], glowColor: PALETTE.deepCyan },
  { serviceId: 'seo', axis: 'x', sign: -1, rotation: [0, -Math.PI / 2, 0], glowColor: PALETTE.electricIndigo },
  { serviceId: 'aiSystems', axis: 'y', sign: 1, rotation: [-Math.PI / 2, 0, 0], glowColor: PALETTE.neonTeal },
  { serviceId: 'growthStrategy', axis: 'y', sign: -1, rotation: [Math.PI / 2, 0, 0], glowColor: PALETTE.softRoseCoral },
  { serviceId: 'webDesign', axis: 'z', sign: 1, rotation: [0, 0, 0], glowColor: PALETTE.brightViolet },
  { serviceId: 'graphicDesign', axis: 'z', sign: -1, rotation: [0, Math.PI, 0], glowColor: PALETTE.deepCyan },
];

function randomMove(): Move {
  const axes: Axis[] = ['x', 'y', 'z'];
  return {
    axis: axes[Math.floor(Math.random() * 3)],
    layer: Math.random() < 0.5 ? 1 : -1,
    dir: Math.random() < 0.5 ? 1 : -1,
  };
}

// Reversing direction undoes a single quarter-turn. Reversing the ORDER of a
// whole sequence too (done by the caller) is what makes multi-move undo
// correct -- face turns don't commute, so undoing "m1, m2, m3" requires
// "inverse(m3), inverse(m2), inverse(m1)".
function invertMove(move: Move): Move {
  return { axis: move.axis, layer: move.layer, dir: move.dir === 1 ? -1 : 1 };
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function getAxis(v: THREE.Vector3, axis: Axis): number {
  return axis === 'x' ? v.x : axis === 'y' ? v.y : v.z;
}

function setEulerAxis(e: THREE.Euler, axis: Axis, value: number) {
  if (axis === 'x') e.x = value;
  else if (axis === 'y') e.y = value;
  else e.z = value;
}

function buildGridCoords(): [number, number, number][] {
  const coords: [number, number, number][] = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        coords.push([x, y, z]);
      }
    }
  }
  return coords;
}

function randomScramble(): Move[] {
  return Array.from({ length: 8 + Math.floor(Math.random() * 4) }, randomMove);
}

type Cubelet = { group: THREE.Group; coreMaterial: THREE.MeshPhysicalMaterial };

function RubiksCube({
  pointerFine,
  isEngaged,
  services,
  onActiveServiceChange,
}: {
  pointerFine: boolean;
  isEngaged: boolean;
  services: Record<ServiceId, CubeService>;
  onActiveServiceChange: (id: ServiceId) => void;
}) {
  const { camera } = useThree();
  const cubeGroupRef = useRef<THREE.Group>(null);
  const rotationGroupRef = useRef<THREE.Group>(null);
  const pivotRef = useRef(new THREE.Object3D());
  const coreGlowRef = useRef<THREE.PointLight>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const labelRefs = useRef<Map<ServiceId, { text: any; glow: THREE.Mesh | null }>>(new Map());

  // Shared resources -- geometry and materials are each created once and
  // reused across all 27 cubelets (5 core-color variants for the inner
  // inserts), rather than allocating 27+ separate materials.
  const shared = useMemo(() => {
    // Rounded/chamfered geometry reads as premium instead of the flat-edged
    // box the original cube used. Segments kept low (2) since this shape is
    // instantiated 27 times -- higher segment counts would multiply the
    // vertex cost for a bevel nobody will get close enough to see get
    // sharper.
    const shellGeometry = new RoundedBoxGeometry(CUBELET_SIZE, CUBELET_SIZE, CUBELET_SIZE, 2, 0.08);
    const coreGeometry = new RoundedBoxGeometry(CORE_SIZE, CORE_SIZE, CORE_SIZE, 2, 0.05);
    const edgesGeometry = new THREE.EdgesGeometry(shellGeometry);

    // Outer frosted shell: a single shared material. This is the fake-glass
    // approach (MeshPhysicalMaterial + transmission) rather than drei's
    // MeshTransmissionMaterial -- true transmission renders an extra
    // offscreen buffer per frame, which isn't worth the cost for a
    // decorative hero element running on visitors' arbitrary hardware. This
    // gets ~90% of the frosted-glass look for a fraction of the GPU budget.
    const shellMaterial = new THREE.MeshPhysicalMaterial({
      color: PALETTE.obsidian,
      metalness: 0.6,
      roughness: 0.15,
      transmission: 0.6,
      thickness: 0.65,
      ior: 1.45,
      clearcoat: 0.5,
      clearcoatRoughness: 0.12,
      emissive: new THREE.Color(PALETTE.electricIndigo),
      emissiveIntensity: 0.05,
    });

    // One shared PBR "core" material per accent color -- this is what
    // actually carries the curated palette with the requested
    // metalness/roughness finish, since it's a proper lit mesh insert
    // rather than an unlit line. Each cubelet picks one of these five by
    // index, so we still only pay for 5 materials total, not 27.
    const coreMaterials = ACCENT_COLORS.map(
      (color) =>
        new THREE.MeshPhysicalMaterial({
          color,
          metalness: 0.6,
          roughness: 0.15,
          emissive: new THREE.Color(color),
          emissiveIntensity: 0.35,
          clearcoat: 0.3,
        })
    );

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: '#3A3F52',
      transparent: true,
      opacity: 0.5,
    });

    return { shellGeometry, coreGeometry, edgesGeometry, shellMaterial, coreMaterials, edgeMaterial };
  }, []);

  const cubelets = useMemo<Cubelet[]>(() => {
    return buildGridCoords().map(([x, y, z]) => {
      const group = new THREE.Group();
      group.position.set(x * SPACING, y * SPACING, z * SPACING);

      const shellMesh = new THREE.Mesh(shared.shellGeometry, shared.shellMaterial);
      const accentIndex = Math.abs(x + y * 2 + z * 3) % shared.coreMaterials.length;
      const coreMaterial = shared.coreMaterials[accentIndex];
      const coreMesh = new THREE.Mesh(shared.coreGeometry, coreMaterial);
      const edges = new THREE.LineSegments(shared.edgesGeometry, shared.edgeMaterial);

      group.add(shellMesh, coreMesh, edges);

      return { group, coreMaterial };
    });
  }, [shared]);

  useEffect(() => {
    const cubeGroup = cubeGroupRef.current;
    if (!cubeGroup) return;

    cubelets.forEach((c) => cubeGroup.add(c.group));
    cubeGroup.add(pivotRef.current);

    return () => {
      cubelets.forEach((c) => cubeGroup.remove(c.group));
      cubeGroup.remove(pivotRef.current);
      shared.shellGeometry.dispose();
      shared.coreGeometry.dispose();
      shared.edgesGeometry.dispose();
      shared.shellMaterial.dispose();
      shared.coreMaterials.forEach((m) => m.dispose());
      shared.edgeMaterial.dispose();
    };
  }, [cubelets, shared]);

  // --- State machine ---
  // historyRef accumulates every move applied since the cube was last fully
  // solved. When engagement starts, we solve by replaying that history
  // inverted and reversed -- so hovering mid-shuffle still resolves cleanly
  // back to a solved cube, not just back to the last scramble batch.
  const stageRef = useRef<Stage>('scrambled');
  const historyRef = useRef<Move[]>([]);
  const queueRef = useRef<Move[] | null>(null);
  const activeMoveRef = useRef<{ move: Move; affected: Cubelet[]; elapsed: number } | null>(null);
  const pauseRef = useRef(0);
  const idleTimerRef = useRef(0);
  const solveProgressRef = useRef(0); // 0 = raw/scrambled look, 1 = polished/solved/glowing
  const lastFacingRef = useRef<ServiceId | null>(null);

  // Seed the initial scrambled state on mount.
  useEffect(() => {
    const seq = randomScramble();
    historyRef.current = seq;
    queueRef.current = [...seq];
  }, []);

  useFrame((state, delta) => {
    const dtMs = delta * 1000;
    const pivot = pivotRef.current;
    const cubeGroup = cubeGroupRef.current;
    if (!cubeGroup) return;

    // Kick off solving the moment the visitor engages.
    if (isEngaged && stageRef.current !== 'solving' && stageRef.current !== 'solved') {
      if (historyRef.current.length > 0 && !activeMoveRef.current && queueRef.current === null) {
        queueRef.current = [...historyRef.current].reverse().map(invertMove);
        historyRef.current = [];
        stageRef.current = 'solving';
        pauseRef.current = 0;
      } else if (historyRef.current.length === 0) {
        stageRef.current = 'solved';
      }
    }

    // Let entropy creep back in after the visitor looks away.
    if (!isEngaged && stageRef.current === 'solved' && !activeMoveRef.current && queueRef.current === null) {
      idleTimerRef.current += dtMs;
      if (idleTimerRef.current > RESCRAMBLE_DELAY) {
        idleTimerRef.current = 0;
        const seq = randomScramble();
        historyRef.current = seq;
        queueRef.current = [...seq];
        stageRef.current = 'scrambled';
      }
    }

    // Small ambient nudges while resting scrambled and unengaged -- keeps the
    // "scattered" state visibly alive rather than a static frozen mess.
    if (!isEngaged && stageRef.current === 'scrambled' && !activeMoveRef.current && queueRef.current === null) {
      idleTimerRef.current += dtMs;
      if (idleTimerRef.current > AMBIENT_SHUFFLE_DELAY) {
        idleTimerRef.current = 0;
        const m = randomMove();
        historyRef.current.push(m);
        queueRef.current = [m];
      }
    }

    // Process the active quarter-turn, if any.
    if (activeMoveRef.current) {
      const active = activeMoveRef.current;
      active.elapsed += dtMs;
      const progress = Math.min(1, active.elapsed / MOVE_DURATION);
      const eased = easeInOutCubic(progress);
      pivot.rotation.set(0, 0, 0);
      setEulerAxis(pivot.rotation, active.move.axis, active.move.dir * (Math.PI / 2) * eased);

      if (progress >= 1) {
        active.affected.forEach((c) => cubeGroup.attach(c.group));
        pivot.rotation.set(0, 0, 0);
        active.affected.forEach((c) => {
          c.group.position.set(
            Math.round(c.group.position.x / SPACING) * SPACING,
            Math.round(c.group.position.y / SPACING) * SPACING,
            Math.round(c.group.position.z / SPACING) * SPACING
          );
          c.group.quaternion.normalize();
        });
        activeMoveRef.current = null;
        pauseRef.current = MOVE_GAP;

        if (queueRef.current && queueRef.current.length === 0) {
          queueRef.current = null;
          pauseRef.current = SETTLE_PAUSE;
          if (stageRef.current === 'solving') stageRef.current = 'solved';
        }
      }
    } else if (pauseRef.current > 0) {
      pauseRef.current -= dtMs;
    } else if (queueRef.current && queueRef.current.length > 0) {
      const move = queueRef.current.shift()!;
      const affected = cubelets.filter(
        (c) => Math.round(getAxis(c.group.position, move.axis) / SPACING) === move.layer
      );
      affected.forEach((c) => pivot.attach(c.group));
      activeMoveRef.current = { move, affected, elapsed: 0 };
    }

    // Lerp the "polish" of the cube toward solved/unsolved: clearcoat and
    // emissive strength ramp up on solve, giving the payoff moment an actual
    // glow-up rather than just stopping in place. Base metalness/roughness
    // stay fixed at the requested 0.6 / 0.15 satin finish at all times.
    const target = stageRef.current === 'solved' ? 1 : 0;
    solveProgressRef.current += (target - solveProgressRef.current) * Math.min(1, delta * 2.2);
    const p = solveProgressRef.current;

    shared.shellMaterial.clearcoat = THREE.MathUtils.lerp(0.5, 1, p);
    shared.shellMaterial.emissiveIntensity = THREE.MathUtils.lerp(0.05, 0.22, p);
    shared.coreMaterials.forEach((m) => {
      m.emissiveIntensity = THREE.MathUtils.lerp(0.35, 0.9, p);
    });
    shared.edgeMaterial.opacity = THREE.MathUtils.lerp(0.4, 0.75, p);

    // Central inner glow -- a soft light source at the cube's core, visible
    // through the frosted shells and brightest once solved, like the
    // structure itself is what's generating the light.
    if (coreGlowRef.current) {
      coreGlowRef.current.intensity = THREE.MathUtils.lerp(0.6, 2.4, p);
    }
    if (coreMeshRef.current) {
      const mat = coreMeshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(0.35, 0.85, p);
      coreMeshRef.current.rotation.y += delta * 0.15;
      coreMeshRef.current.rotation.x += delta * 0.08;
    }

    // Fade in face labels only once the cube is meaningfully solved, and
    // only on the face currently turned toward the camera.
    if (rotationGroupRef.current) {
      const toCamera = camera.position.clone().normalize();
      let bestId: ServiceId | null = null;
      let bestDot = -Infinity;
      const normal = new THREE.Vector3();
      FACE_DEFS.forEach((f) => {
        normal.set(f.axis === 'x' ? f.sign : 0, f.axis === 'y' ? f.sign : 0, f.axis === 'z' ? f.sign : 0);
        normal.applyQuaternion(rotationGroupRef.current!.quaternion);
        const dot = normal.dot(toCamera);
        if (dot > bestDot) {
          bestDot = dot;
          bestId = f.serviceId;
        }
      });

      FACE_DEFS.forEach((f) => {
        const refs = labelRefs.current.get(f.serviceId);
        if (!refs) return;
        const isFacing = f.serviceId === bestId && bestDot > 0.35;
        const targetOpacity = p > 0.6 && isFacing ? 1 : 0;
        if (refs.text) {
          refs.text.fillOpacity = THREE.MathUtils.lerp(refs.text.fillOpacity ?? 0, targetOpacity, 0.15);
        }
        if (refs.glow) {
          const mat = refs.glow.material as THREE.MeshBasicMaterial;
          mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity * 0.5, 0.15);
        }
      });

      if (bestId && bestId !== lastFacingRef.current && p > 0.6 && bestDot > 0.35) {
        lastFacingRef.current = bestId;
        onActiveServiceChange(bestId);
      }
    }

    // Cursor parallax / idle spin on the whole assembly. Smoothing factor
    // lowered (delta * 2 instead of delta * 3) for a softer, more
    // deliberate glide rather than a snappy follow.
    if (rotationGroupRef.current) {
      if (pointerFine) {
        const targetRotY = state.pointer.x * 0.5;
        const targetRotX = -state.pointer.y * 0.3;
        rotationGroupRef.current.rotation.y +=
          (targetRotY - rotationGroupRef.current.rotation.y) * Math.min(1, delta * 2);
        rotationGroupRef.current.rotation.x +=
          (targetRotX - rotationGroupRef.current.rotation.x) * Math.min(1, delta * 2);
      } else {
        rotationGroupRef.current.rotation.y += delta * 0.1;
      }
    }
  });

  return (
    <group ref={rotationGroupRef} scale={CUBE_SCALE}>
      <group ref={cubeGroupRef}>
        {/* Central glow: a soft point light plus a faint unlit core mesh,
            visible through the gaps between cubelets and glowing brighter
            through the translucent shells once the cube resolves. */}
        <pointLight ref={coreGlowRef} color={PALETTE.neonTeal} intensity={0.6} distance={4} decay={2} />
        <mesh ref={coreMeshRef}>
          <icosahedronGeometry args={[0.34, 1]} />
          <meshBasicMaterial color={PALETTE.electricIndigo} transparent opacity={0.35} />
        </mesh>
      </group>

      {FACE_DEFS.map((f) => {
        const position: [number, number, number] = [
          f.axis === 'x' ? f.sign * FACE_LABEL_OFFSET : 0,
          f.axis === 'y' ? f.sign * FACE_LABEL_OFFSET : 0,
          f.axis === 'z' ? f.sign * FACE_LABEL_OFFSET : 0,
        ];
        const service = services[f.serviceId];

        return (
          <group key={f.serviceId} position={position} rotation={f.rotation}>
            {/* Invisible hit target -- clicking/tapping a face jumps the
                active-service badge straight to that service. */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onActiveServiceChange(f.serviceId);
              }}
              onPointerOver={() => {
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'auto';
              }}
            >
              <planeGeometry args={[2.6, 2.6]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>

            <mesh
              position={[0, 0, -0.02]}
              ref={(el) => {
                const entry = labelRefs.current.get(f.serviceId) ?? { text: null, glow: null };
                entry.glow = el;
                labelRefs.current.set(f.serviceId, entry);
              }}
            >
              <circleGeometry args={[0.62, 32]} />
              <meshBasicMaterial color={f.glowColor} transparent opacity={0} depthWrite={false} />
            </mesh>

            <Text
              ref={(el: any) => {
                const entry = labelRefs.current.get(f.serviceId) ?? { text: null, glow: null };
                entry.text = el;
                labelRefs.current.set(f.serviceId, entry);
              }}
              fontSize={0.3}
              color="#F4F1EA"
              fillOpacity={0}
              anchorX="center"
              anchorY="middle"
              font={undefined}
              maxWidth={1.8}
              textAlign="center"
            >
              {service.glyph ?? service.label}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

export function HeroCube({
  services,
  onActiveServiceChange,
}: {
  services: Record<ServiceId, CubeService>;
  onActiveServiceChange?: (id: ServiceId) => void;
}) {
  const [pointerFine, setPointerFine] = useState(false);
  const [isEngaged, setIsEngaged] = useState(false);
  const [dpr, setDpr] = useState<[number, number]>([1, 1.25]);

  // Bumped whenever the WebGL context is lost and later restored. Changing a
  // component's `key` forces React to unmount and remount it from scratch --
  // that's the only reliable way to get a fresh GL context and re-upload all
  // geometry/materials, since neither three.js nor R3F automatically replays
  // lost GPU resources on "webglcontextrestored".
  const [canvasKey, setCanvasKey] = useState(0);

  useEffect(() => {
    setPointerFine(window.matchMedia('(pointer: fine)').matches);
  }, []);

  const handleActiveServiceChange = (id: ServiceId) => {
    onActiveServiceChange?.(id);
  };

  return (
    <div
      className="h-full w-full"
      style={{ width: '100%', height: '100%' }}
      // Touch devices have no hover; a tap engages the cube the same way a
      // mouseenter does on desktop, and it settles back to scrambled on its
      // own via RESCRAMBLE_DELAY rather than waiting for a "leave" event.
      onMouseEnter={() => setIsEngaged(true)}
      onMouseLeave={() => setIsEngaged(false)}
      onTouchStart={() => setIsEngaged(true)}
    >
      <Canvas
        key={canvasKey}
        dpr={dpr}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
        camera={{ position: [3.6, 3, 4.8], fov: 45 }}
        onCreated={({ gl }) => {
          const canvas = gl.domElement;

          // Without this listener, a context-loss event runs the browser's
          // default teardown and the canvas goes permanently blank. Calling
          // preventDefault() here tells the browser we intend to handle
          // recovery ourselves, via the "restored" listener below.
          const handleLost = (event: Event) => {
            event.preventDefault();
            console.warn('[HeroCube] WebGL context lost -- will remount on restore.');
          };

          const handleRestored = () => {
            console.warn('[HeroCube] WebGL context restored -- remounting Canvas.');
            setCanvasKey((k) => k + 1);
          };

          canvas.addEventListener('webglcontextlost', handleLost, false);
          canvas.addEventListener('webglcontextrestored', handleRestored, false);
        }}
      >
        <PerformanceMonitor onIncline={() => setDpr([1, 1.75])} onDecline={() => setDpr([1, 1])} />

        {/* Studio-style lighting: cool key light, warm-neutral fill, and a
            dedicated rim light from behind to catch the bevels in silhouette
            -- this is what makes the chamfered edges actually read as
            "sleek" rather than just rounded. */}
        <ambientLight intensity={0.32} />
        <pointLight position={[3, 3, 3]} intensity={0.7} color={PALETTE.electricIndigo} />
        <pointLight position={[-3, -2, -2]} intensity={0.55} color={PALETTE.neonTeal} />
        <directionalLight position={[2, 4, 2]} intensity={0.3} />
        <directionalLight position={[-2.5, 1.5, -4]} intensity={0.9} color="#CFE8FF" />

        {/* Reflections only -- background stays transparent so the cube
            still sits on the page's own gradient rather than a visible
            skybox. */}
        <Environment preset="city" background={false} />

        <Float speed={1.1} rotationIntensity={0} floatIntensity={0.55} floatingRange={[-0.14, 0.14]}>
          <RubiksCube
            pointerFine={pointerFine}
            isEngaged={isEngaged}
            services={services}
            onActiveServiceChange={handleActiveServiceChange}
          />
        </Float>
      </Canvas>
    </div>
  );
}
