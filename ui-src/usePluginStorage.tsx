import { useEffect } from "react";
import { mergeState } from "./reducerUtils";
import { State, Action, Collection } from "./reducer";

const STORAGE_KEY = "cache";

const usePluginStorage = (
  state: State, 
  dispatch: (action: Action) => void
) => {
  // Load on mount
  useEffect(() => {
    parent.postMessage({ pluginMessage: { type: "load-storage", key: "cache" } }, "*");
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data.pluginMessage;
      if (msg?.type === "storage-loaded" && msg.key === STORAGE_KEY && msg.value) {
        try {
          const parsed = JSON.parse(msg.value);
          
          // Ensure collection and packs exist
          const collection: Collection = parsed.collection ?? { cards: {} };

          dispatch({
            type: "HYDRATE_STATE",
            state: mergeState(state, { collection }),
          });
        } catch (e) {
          console.error("Failed to parse plugin storage", e);
        }
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
      pluginMessage: {
        type: "save-storage",
        key: STORAGE_KEY,
        value: JSON.stringify({
          collection: state.collection
        }),
      },
    }, "*");
  }, [state.collection.cards]);
};

export default usePluginStorage;