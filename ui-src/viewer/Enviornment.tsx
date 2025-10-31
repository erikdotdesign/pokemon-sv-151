import { usePostProcessing } from "./usePostProcessing";

const Enviornment = () => {
  const postProcessing = usePostProcessing();
  return (
    <>
      <color attach="background" args={[postProcessing ? "#DCE4F9" : '#E2E6F0']} />
      <fog attach="fog" args={[postProcessing ? "#DCE4F9" : '#E2E6F0', 0, 25]} />
    </>
  );
};

export default Enviornment;