import { Action } from "./reducer";
import Back from "./svgs/back.svg?react";
import Button from "./Button";
import './Collection.css';

const CloseCollectionButton = ({
  flat = false,
  dispatch
}: {
  flat?: boolean,
  dispatch: (action: Action) => void;
}) => {
  return (
    <Button 
      modifier={["icon", "circle", ...(flat ? ["flat"] : [])]}
      onClick={() => {
        dispatch({
          type: "TOGGLE_COLLECTION_OVERLAY",
          visible: false
        })
      }}>
      <Back />
    </Button>
  );
};

export default CloseCollectionButton;