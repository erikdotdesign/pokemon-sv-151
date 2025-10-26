import { useState, Suspense } from "react";
import { Action, State } from "../reducer";
import CardRotator from "./Rotator";
import PackModel from "./PackModel";

const Pack = ({ 
  state,
  rotator = true,
  dispatch
}: { 
  state: State;
  rotator?: boolean;
  dispatch: (action: Action) => void;
}) => {
  return (
    <CardRotator
      disabled={!rotator}
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