import { Action, State } from "./reducer";
import Viewer from "./viewer/Viewer";
import './Canvas.css';

const Canvas = ({
  canvasRef,
  state,
  dispatch
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  state: State;
  dispatch: (action: Action) => void;
}) => {
  return (
    <div className="c-canvas">
      <Viewer
        canvasRef={canvasRef}
        state={state}
        dispatch={dispatch} />
    </div>
  );
};

export default Canvas;