import { useState } from "react";
import * as THREE from "three";
import { Action, State } from "../reducer";

import PackViewerPack from "./PackViewerPack";
import PackViewerCards from "./PackViewerCards";

const PackViewer = ({ 
  state, 
  dispatch,
  packRef
}: { 
  state: State; 
  dispatch: (action: Action) => void;
  packRef: React.RefObject<THREE.Mesh | null>;
}) => {
  const [packRecycle, setPackRecycle] = useState(false);

  return (
    <>
      <PackViewerCards
        state={state}
        dispatch={dispatch}
        setPackRecycle={setPackRecycle} />
      <PackViewerPack
        packRef={packRef}
        state={state}
        dispatch={dispatch}
        packRecycle={packRecycle}
        setPackRecycle={setPackRecycle} />
    </>
  );
};

export default PackViewer;