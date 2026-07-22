'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerformanceMonitor } from '@react-three/drei';

const ACCENT_COLORS = ['#8B5CF6', '#3B82F6', '#06B6D4'] as const;
const SPACING = 1.05;
const CUBELET_SIZE = 0.92;
const MOVE_DURATION = 380; // ms per quarter-turn
const MOVE_GAP = 90; // ms between moves within a scramble/solve batch
const SETTLE_PAUSE = 650; // ms pause when the cube is fully scrambled or solved

// Scales the whole assembly down so it has margin on every side and never
// clips against the canvas edge while rotating/tilting toward the cursor.
const CUBE_SCALE = 0.72;

type Axis = 'x' | 'y' | 'z';
type Move = { axis: Axis; layer: 1 | -1; dir: 1 | -1 };

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
// correct -- Rubik's-cube face turns don't commute in general, so undoing
// "m1, m2, m3" requires "inverse(m3), inverse(m2), inverse(m1)", not the
// same order with directions flipped.
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

type Cubelet = {
  group: THREE.Group;
};

function RubiksCube({ pointerFine }: { pointerFine: boolean }) {
  const cubeGroupRef = useRef<THREE.Group>(null);
  const rotationGroupRef = useRef<THREE.Group>(null);
  const pivotRef = useRef(new THREE.Object3D());

  // Shared geometry/materials -- one instance each, reused across all 27
  // cubelets rather than duplicated 27 times.
  const shared = useMemo(() => {
    const boxGeometry = new THREE.BoxGeometry(CUBELET_SIZE, CUBELET_SIZE, CUBELET_SIZE);
    const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: '#12131a',
      metalness: 0.6,
      roughness: 0.25,
      transmission: 0.55,
      thickness: 0.6,
      ior: 1.4,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
    });
    const accentMaterials = ACCENT_COLORS.map(
      (color) => new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.85 })
    );
    return { boxGeometry, edgesGeometry, glassMaterial, accentMaterials };
  }, []);

  const cubelets = useMemo<Cubelet[]>(() => {
    return buildGridCoords().map(([x, y, z]) => {
      const group = new THREE.Group();
      group.position.set(x * SPACING, y * SPACING, z * SPACING);

      const mesh = new THREE.Mesh(shared.boxGeometry, shared.glassMaterial);
      const accentIndex = Math.abs(x + y * 2 + z * 3) % shared.accentMaterials.length;
      const edges = new THREE.LineSegments(shared.edgesGeometry, shared.accentMaterials[accentIndex]);
      group.add(mesh, edges);

      return { group };
    });
  }, [shared]);

  // Mount cubelets into the scene graph once; dispose shared resources on unmount.
  useEffect(() => {
    const cubeGroup = cubeGroupRef.current;
    if (!cubeGroup) return;

    cubelets.forEach((c) => cubeGroup.add(c.group));
    cubeGroup.add(pivotRef.current);

    return () => {
      cubelets.forEach((c) => cubeGroup.remove(c.group));
      cubeGroup.remove(pivotRef.current);
      shared.boxGeometry.dispose();
      shared.edgesGeometry.dispose();
      shared.glassMaterial.dispose();
      shared.accentMaterials.forEach((m) => m.dispose());
    };
  }, [cubelets, shared]);

  // --- Scramble/solve state machine ---
  // Note: which cubelets belong to a face at move time is read directly off
  // their CURRENT position, not a separate permutation model -- pieces
  // naturally migrate between layers as the cube turns, exactly like a real
  // cube, so the scene graph itself is the state.
  const stageRef = useRef<'scrambling' | 'solving'>('scrambling');
  const queueRef = useRef<Move[] | null>(null);
  const lastScrambleRef = useRef<Move[]>([]);
  const activeMoveRef = useRef<{ move: Move; affected: Cubelet[]; elapsed: number } | null>(null);
  const pauseRef = useRef(0);

  useFrame((_, delta) => {
    const dtMs = delta * 1000;
    const pivot = pivotRef.current;
    const cubeGroup = cubeGroupRef.current;
    if (!cubeGroup) return;

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
      }
      return;
    }

    if (pauseRef.current > 0) {
      pauseRef.current -= dtMs;
      return;
    }

    if (queueRef.current === null) {
      if (stageRef.current === 'scrambling') {
        const sequence = Array.from({ length: 10 + Math.floor(Math.random() * 4) }, randomMove);
        lastScrambleRef.current = sequence;
        queueRef.current = sequence;
      } else {
        queueRef.current = [...lastScrambleRef.current].reverse().map(invertMove);
      }
      pauseRef.current = SETTLE_PAUSE;
      return;
    }

    if (queueRef.current.length === 0) {
      stageRef.current = stageRef.current === 'scrambling' ? 'solving' : 'scrambling';
      queueRef.current = null;
      pauseRef.current = SETTLE_PAUSE;
      return;
    }

    const move = queueRef.current.shift()!;
    const affected = cubelets.filter(
      (c) => Math.round(getAxis(c.group.position, move.axis) / SPACING) === move.layer
    );
    affected.forEach((c) => pivot.attach(c.group));
    activeMoveRef.current = { move, affected, elapsed: 0 };
  });

  // Cursor tracking / idle spin on the whole assembly -- the cube always
  // stays a solid, rigid unit here; nothing separates on hover anymore.
  useFrame((state, delta) => {
    if (!rotationGroupRef.current) return;
    if (pointerFine) {
      const targetRotY = state.pointer.x * 0.5;
      const targetRotX = -state.pointer.y * 0.3;
      rotationGroupRef.current.rotation.y +=
        (targetRotY - rotationGroupRef.current.rotation.y) * Math.min(1, delta * 3);
      rotationGroupRef.current.rotation.x +=
        (targetRotX - rotationGroupRef.current.rotation.x) * Math.min(1, delta * 3);
    } else {
      rotationGroupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={rotationGroupRef} scale={CUBE_SCALE}>
      <group ref={cubeGroupRef} />
    </group>
  );
}

export function HeroCube() {
  const [pointerFine, setPointerFine] = useState(false);
  const [dpr, setDpr] = useState<[number, number]>([1, 1.25]);

  useEffect(() => {
    setPointerFine(window.matchMedia('(pointer: fine)').matches);
  }, []);

  return (
    <div className="h-full w-full">
      <Canvas
        dpr={dpr}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
        // Pulled back slightly and widened vs. the original framing so the
        // cube has visible margin at every rotation angle instead of
        // brushing the canvas edge at the corners.
        camera={{ position: [3.6, 3, 4.8], fov: 45 }}
      >
        <PerformanceMonitor onIncline={() => setDpr([1, 1.75])} onDecline={() => setDpr([1, 1])} />
        <ambientLight intensity={0.4} />
        <pointLight position={[3, 3, 3]} intensity={0.6} color="#8B5CF6" />
        <pointLight position={[-3, -2, -2]} intensity={0.5} color="#06B6D4" />
        <directionalLight position={[2, 4, 2]} intensity={0.3} />

        <Float speed={1.2} rotationIntensity={0} floatIntensity={0.5} floatingRange={[-0.12, 0.12]}>
          <RubiksCube pointerFine={pointerFine} />
        </Float>
      </Canvas>
    </div>
  );
}
