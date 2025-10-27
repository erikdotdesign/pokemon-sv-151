import { Action, State } from "./reducer";
import Viewer from "./viewer/Viewer";
import EffectsCompTest from "./viewer/EffectsCompTest";
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
      {/* <EffectsCompTest
        canvasRef={canvasRef}
        state={state} /> */}
    </div>
  );
};

export default Canvas;