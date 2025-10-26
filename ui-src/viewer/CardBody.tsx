import * as THREE from "three";
import { useMemo } from "react";

const CardBody = ({
  width,
  height,
  depth,
  cornerRadius
}: {
  width: number;
  height: number;
  depth: number;
  cornerRadius: number;
}) => {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const adjustedRadius = cornerRadius * 1.15;

    shape.moveTo(0, adjustedRadius);
    shape.lineTo(0, height - adjustedRadius);
    shape.quadraticCurveTo(0, height, adjustedRadius, height);
    shape.lineTo(width - adjustedRadius, height);
    shape.quadraticCurveTo(width, height, width, height - adjustedRadius);
    shape.lineTo(width, adjustedRadius);
    shape.quadraticCurveTo(width, 0, width - adjustedRadius, 0);
    shape.lineTo(adjustedRadius, 0);
    shape.quadraticCurveTo(0, 0, 0, adjustedRadius);

    const geo = new THREE.ExtrudeGeometry(shape, { depth, curveSegments: 24, bevelEnabled: false });
    geo.center(); 

    return geo;
  }, [width, height, depth, cornerRadius]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#979A9C" />
    </mesh>
  );
}

export default CardBody;