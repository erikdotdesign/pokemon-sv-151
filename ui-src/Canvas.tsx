import { Action, State } from "./reducer";
import Viewer from "./viewer/Viewer";
import Button from "./Button";
import CollectionButton from "./CollectionButton";
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
      <div className="c-canvas__controls c-canvas__controls--top c-canvas__controls--right">
        <CollectionButton 
          state={state}
          dispatch={dispatch} />
      </div>
      <Viewer
        canvasRef={canvasRef}
        state={state}
        dispatch={dispatch} />
    </div>
  );
};

export default Canvas;