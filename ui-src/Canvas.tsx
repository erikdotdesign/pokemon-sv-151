import { Action, State } from "./reducer";
import Viewer from "./viewer/Viewer";
import Button from "./Button";
import CollectionButton from "./CollectionButton";
import CloseOverlayButton from "./CloseOverlayButton";
import Back from "./svgs/back.svg?react";
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
      <div className="c-canvas__controls c-canvas__controls--top c-canvas__controls--left">
        {
          state.overlay.collectionVisible && state.overlay.selectedCardId &&
          <Button
            modifier={["icon", "circle"]}
            onClick={() => {
              dispatch({
                type: "SET_SELECTED_CARD",
                cardId: null
              })
            }}>
            <Back />
          </Button>
        }
      </div>
      <div className="c-canvas__controls c-canvas__controls--top c-canvas__controls--right">
        <CollectionButton 
          state={state}
          dispatch={dispatch} />
        {/* <CloseOverlayButton
          state={state}
          dispatch={dispatch} /> */}
      </div>
      <Viewer
        canvasRef={canvasRef}
        state={state}
        dispatch={dispatch} />
    </div>
  );
};

export default Canvas;