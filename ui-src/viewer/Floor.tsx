import { a, useSpring } from "@react-spring/three";
import { MeshReflectorMaterial } from "@react-three/drei";
import { State } from "../reducer";

const Floor = ({ 
  state,
}: { 
  state: State;
}) => {
  const { position } = useSpring({
    position: state.packs.current.opened ? [0,-1.5,0] : [0,-2.1,0],
    config: { mass: 1, tension: 170, friction: 26 }
  });
  return (
    <a.mesh rotation={[-Math.PI / 2, 0, 0]} position={position as unknown as [number, number, number]}>
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        color="#66A6FF" />
    </a.mesh>
  );
};

export default Floor;