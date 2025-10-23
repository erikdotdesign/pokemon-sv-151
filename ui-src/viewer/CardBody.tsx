import { RoundedBox } from "@react-three/drei";

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
  return (
    <RoundedBox
      args={[width, height, depth]}
      radius={cornerRadius}
      steps={1}
      smoothness={4}
      bevelSegments={0}>
      <meshStandardMaterial color="#979A9C" />
    </RoundedBox>
  );
}

export default CardBody;