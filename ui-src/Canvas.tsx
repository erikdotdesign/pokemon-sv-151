import Viewer from "./viewer/Viewer";
import './Canvas.css';
import { TarotCard } from "../widget-src/types";

const Canvas = ({
  card, 
  canvasRef
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  card: TarotCard | null;
}) => {
  return (
    <div className="c-canvas">
      <Viewer
        canvasRef={canvasRef}
        card={card} />
    </div>
  );
};

export default Canvas;