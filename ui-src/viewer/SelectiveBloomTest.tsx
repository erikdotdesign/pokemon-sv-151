import { useState } from "react";
import { useThree, Canvas } from "@react-three/fiber";
import { EffectComposer, SelectiveBloom } from "@react-three/postprocessing";

const Effects = () => {
  const { gl } = useThree();

  console.log(gl.info.memory.textures);

  return (
    <EffectComposer>
      <SelectiveBloom
        lights={[]}
        selection={[]}
        intensity={1}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.025} />
    </EffectComposer>
  );
};

const SelectiveBloomTest = () => {
  const [count, setCount] = useState(0);

  return (
    <Canvas>
      <ambientLight intensity={2} />
      <mesh onClick={() => setCount(count + 1)}>
        <planeGeometry args={[3, 3, 32, 32]} /> 
        <meshStandardMaterial color="red" />
      </mesh>
      <Effects />
    </Canvas>
  )
};

export default SelectiveBloomTest;