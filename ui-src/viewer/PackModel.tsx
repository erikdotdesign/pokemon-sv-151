import { useGLTF } from '@react-three/drei';

import MODEL_PATH from "../models/pack.glb";
import { forwardRef } from 'react';

const PackModel = forwardRef((props, ref) => {
  const { nodes, materials } = useGLTF(MODEL_PATH);
  return (
    <group 
      dispose={null} 
      rotation={[0, Math.PI, Math.PI / 2]} 
      scale={0.0155}>
      <mesh
        ref={ref}
        castShadow
        receiveShadow
        geometry={nodes.Cube002_body_0.geometry}
        position={[15, 5, 0]}
        rotation={[0, 0, 0]}
        scale={[100, 65.043, 42.372]}>
        <meshStandardMaterial
          {...materials.body}
          color="#ffffff"
          // toneMapped={false}
          fog={false}
          metalness={0.1}
          roughness={0.2} />
      </mesh>
    </group>
  );
});

useGLTF.preload(MODEL_PATH);

export default PackModel;