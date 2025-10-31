import { Action, State } from "./reducer";
import Viewer from "./viewer/Viewer";
import Button from "./Button";
import CollectionButton from "./CollectionButton";
import AddToFigmaButton from "./AddToFigmaButton";
import Back from "./svgs/back.svg?react";
import './Canvas.css';
import { CollectionRef } from "./useCollection";

const Canvas = ({
  canvasRef,
  collectionRef,
  state,
  dispatch
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  collectionRef: CollectionRef;
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
        <AddToFigmaButton
          collectionRef={collectionRef}
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