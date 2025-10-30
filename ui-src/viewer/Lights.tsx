import { forwardRef, useRef, useImperativeHandle } from "react";
import { AmbientLight, DirectionalLight } from "three";

export type LightsHandle = {
  ambient: React.RefObject<AmbientLight>;
  dir1: React.RefObject<DirectionalLight>;
  dir2: React.RefObject<DirectionalLight>;
};

const Lights = forwardRef((props, ref) => {
  const ambientLightRef = useRef<AmbientLight>(null);
  const dirLightRef1 = useRef<DirectionalLight>(null);
  const dirLightRef2 = useRef<DirectionalLight>(null);

  useImperativeHandle(ref, () => ({
    ambient: ambientLightRef,
    dir1: dirLightRef1,
    dir2: dirLightRef2,
  }));

  return (
    <group ref={ref}>
      <ambientLight ref={ambientLightRef} intensity={2} />
      <directionalLight
        ref={dirLightRef1}
        position={[8, 12, 8]}
        intensity={2.0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024} />
      <directionalLight
        ref={dirLightRef2}
        position={[-8, 12, 8]}
        intensity={2.0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024} />
    </group>
  );
});

export default Lights;