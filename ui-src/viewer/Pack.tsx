import { useState, Suspense } from "react";
import { Action, State } from "../reducer";
import CardRotator from "./Rotator";
import PackModel from "./PackModel";
import { Mesh } from "three";

const Pack = ({ 
  state,
  rotator = true,
  dispatch,
  packRef
}: { 
  state: State;
  rotator?: boolean;
  dispatch: (action: Action) => void;
  packRef: React.RefObject<Mesh | null>;
}) => {
  return (
    <CardRotator
      disabled={!rotator}
      onClick={() => dispatch({
        type: "OPEN_CURRENT_PACK"
      })}>
      <Suspense fallback={null}>
        <PackModel ref={packRef} />
      </Suspense>
    </CardRotator>
  );
};

export default Pack;