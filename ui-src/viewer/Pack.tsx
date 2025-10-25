import { useState, Suspense } from "react";
import { Action, State } from "../reducer";
import CardRotator from "./CardRotator";
import PackModel from "./PackModel";

const Pack = ({ 
  state,
  dispatch
}: { 
  state: State;
  dispatch: (action: Action) => void;
}) => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const aspect = 500 / 980;
  const width = 2;
  const height = width / aspect;
  const hitTargetPadding = 0.6;
  return (
    <CardRotator
      width={width}
      height={height}
      padding={hitTargetPadding}
      setCursorPos={setCursorPos}
      onClick={() => dispatch({
        type: "OPEN_CURRENT_PACK"
      })}>
      <Suspense fallback={null}>
        <PackModel />
      </Suspense>
    </CardRotator>
  );
};

export default Pack;