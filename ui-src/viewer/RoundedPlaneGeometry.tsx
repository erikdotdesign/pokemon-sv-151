import { extend } from "@react-three/fiber";
import { geometry } from 'maath';

extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry });

const RoundedPlaneGeometry = ({
  width,
  height,
  cornerRadius
}: {
  width: number;
  height: number;
  cornerRadius: number;
}) => (
  <roundedPlaneGeometry args={[width, height, cornerRadius]} />
);

export default RoundedPlaneGeometry;