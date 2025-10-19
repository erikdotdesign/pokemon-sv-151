import * as THREE from "three";
import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Mask, useMask } from "@react-three/drei";
import RoundedPlaneGeometry from "./RoundedPlaneGeometry";

const CardGlare = ({
  width,
  height,
  flipped,
  depth,
  cornerRadius,
  glarePos
}: {
  width: number;
  height: number;
  flipped: boolean;
  padding?: number;
  depth: number;
  cornerRadius: number;
  glarePos: {x: number; y: number};
}) => {
  const glareRef = useRef<THREE.Mesh>(null);

  const maskId = 1;
  const mask = useMask(maskId);

  // Radial gradient glare texture
  const glareTexture = useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, "rgba(255,255,255,0.3)");
    gradient.addColorStop(0.5, "rgba(255,255,255,0.15)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, []);

  useFrame(() => {
    // Update glare position
    if (glareRef.current) {
      glareRef.current.position.y = THREE.MathUtils.lerp(
        glareRef.current.position.y,
        glarePos.y * height * 0.5,
        0.15
      );
      glareRef.current.position.x = THREE.MathUtils.lerp(
        glareRef.current.position.x,
        glarePos.x * width * 0.5,
        0.15
      );
    }
  });

  return (
    <group rotation={[0, flipped ? Math.PI : 0, 0]}>
      <Mask id={maskId} renderOrder={0}>
        <mesh 
          position={[0, 0, depth]}>
          <RoundedPlaneGeometry width={width} height={height} cornerRadius={cornerRadius} />
          <meshBasicMaterial
            colorWrite={false}
            depthTest={false}
            stencilWrite={true}
            stencilRef={1}
            stencilFunc={THREE.AlwaysStencilFunc}
            stencilZPass={THREE.ReplaceStencilOp} />
        </mesh>
      </Mask>
      <mesh 
        ref={glareRef} 
        position={[0, 0, depth]} 
        renderOrder={1}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          {...mask}
          map={glareTexture}
          transparent
          blending={THREE.AdditiveBlending}
          depthTest={false} />
      </mesh>
    </group>
  );
};

export default CardGlare;