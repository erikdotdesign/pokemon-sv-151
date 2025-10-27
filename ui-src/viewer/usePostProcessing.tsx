import { createContext, useContext } from "react";

export const PostProcessingContext = createContext(false);

export const usePostProcessing = () => useContext(PostProcessingContext);