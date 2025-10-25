import { useEffect } from "react";
import { State, Action } from "./reducer";

const usePluginStorage = (
  state: State, 
  dispatch: (action: Action) => void
) => {
  // Load on mount
  useEffect(() => {
    parent.postMessage({ pluginMessage: { type: "load-storage", key: "cache" } }, "*");
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data.pluginMessage;
      if (msg.type === "storage-loaded" && msg.key === "cache" && msg.value) {
        dispatch({
          type: "HYDRATE_STATE", 
          state: {
            collection: {
              ...state.collection,
              cards: Array.from(new Set([...msg.value, ...state.collection.cards]))
            }
          }
        });
      } else {
        dispatch({
          type: "HYDRATE_STATE", 
          state: {} as any
        });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // Save whenever state changes
  useEffect(() => {
    parent.postMessage({
      pluginMessage: { type: "save-storage", key: "cache", value: state.collection.cards },
    }, "*");
  }, [state.collection.cards]);
};

export default usePluginStorage;