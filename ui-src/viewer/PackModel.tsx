import { useGLTF } from '@react-three/drei';

import MODEL_PATH from "../models/pack.glb";

const PackModel = ({
  ...props
}) => {
  const { nodes, materials } = useGLTF(MODEL_PATH);
  return (
    <group {...props} dispose={null} rotation={[0, Math.PI, Math.PI / 2]}>
      <group scale={0.0155}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube002_body_0.geometry}
          position={[15, 5, 0]}
          rotation={[0, 0, 0]}
          scale={[100, 65.043, 42.372]}>
          <meshStandardMaterial
            {...materials.body}
            metalness={0.3} />
        </mesh>
      </group>
    </group>
  );
};

useGLTF.preload(MODEL_PATH);

export default PackModel;