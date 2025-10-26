import * as THREE from "three";
import React, {
  useRef,
  useState,
  useLayoutEffect,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import { useFrame } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";

export type RotatorHandle = {
  cursorPos: React.RefObject<{ x: number; y: number }>;
  tilt: React.RefObject<{ x: number; y: number }>;
  width: number;
  height: number;
};

type RotatorProps = {
  disabled?: boolean;
  flipped?: boolean;
  setFlipped?: (flipped: boolean) => void;
  reversed?: boolean;
  initialFlipped?: boolean;
  children: React.ReactNode;
  onClick?: (e: React.PointerEvent) => void;
};

const Rotator = forwardRef<RotatorHandle, RotatorProps>((
  {
    disabled = false,
    flipped,
    setFlipped,
    reversed = false,
    initialFlipped = false,
    children,
    onClick
  },
  ref
) => {
  const [hovered, setHovered] = useState(false);
  const [bounds, setBounds] = useState({ width: 1, height: 1 });

  const cardRef = useRef<THREE.Group>(null);

  const baseRotationZ = reversed ? Math.PI : 0;
  const currentRotY = useRef(flipped ? Math.PI : 0);
  const targetRotY = useRef(flipped ? Math.PI : 0);

  const currentTilt = useRef({ x: 0, y: 0 });
  const targetTilt = useRef({ x: 0, y: 0 });

  const cursorPos = useRef({ x: 0, y: 0 });

  useCursor(hovered);

  // 🧭 Compute actual group bounds
  useLayoutEffect(() => {
    if (!cardRef.current) return;
    const box = new THREE.Box3().setFromObject(cardRef.current);
    const size = new THREE.Vector3();
    box.getSize(size);
    setBounds({ width: size.x, height: size.y });
  }, []);

  // 🔄 Update rotation and tilt each frame
  useFrame(() => {
    if (!cardRef.current) return;

    currentRotY.current = THREE.MathUtils.lerp(
      currentRotY.current,
      targetRotY.current,
      0.15
    );

    currentTilt.current.x = THREE.MathUtils.lerp(
      currentTilt.current.x,
      targetTilt.current.x,
      0.15
    );
    currentTilt.current.y = THREE.MathUtils.lerp(
      currentTilt.current.y,
      targetTilt.current.y,
      0.15
    );

    cardRef.current.rotation.z = baseRotationZ;
    cardRef.current.rotation.x = currentTilt.current.x * (reversed ? 1 : -1);
    cardRef.current.rotation.y =
      (currentRotY.current + currentTilt.current.y) * (reversed ? 1 : -1);
  });

  // 🧠 Pointer tracking
  const handlePointerMove = (e: any) => {
    if (!cardRef.current || disabled) return;
    e.stopPropagation();

    const local = cardRef.current.worldToLocal(e.point.clone());
    const x = THREE.MathUtils.clamp(local.x / (bounds.width / 2), -1, 1);
    const y = THREE.MathUtils.clamp(local.y / (bounds.height / 2), -1, 1);

    targetTilt.current = { x: -y * 0.25, y: (flipped ? -x : x) * 0.25 };
    cursorPos.current = { x: flipped ? -x : x, y };
  };

  const handlePointerOut = () => {
    if (disabled) return;
    setHovered(false);
    targetTilt.current = { x: 0, y: 0 };
    cursorPos.current = { x: 0, y: 0 };
  };

  const handleClick = (e: any) => {
    if (disabled) return;
    if (onClick) onClick(e);
  };

  // 🎯 Expose live data via forwarded ref
  useImperativeHandle(ref, () => ({
    cursorPos: cursorPos,
    tilt: currentTilt,
    width: bounds.width,
    height: bounds.height,
  }));

  useEffect(() => {
    if (disabled) {
      targetTilt.current = { x: 0, y: 0 };
      cursorPos.current = { x: 0, y: 0 };
    }
  }, [disabled]);

  return (
    <group
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerOver={() => setHovered(true)}
      onPointerOut={handlePointerOut}
      onClick={handleClick}>
      {children}
    </group>
  );
});

export default Rotator;