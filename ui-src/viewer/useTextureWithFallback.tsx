import { useState, useEffect } from "react";
import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

const loadWithFallback = (primaryUrl: string, fallbackUrl: string) => {
  return new Promise<THREE.Texture>((resolve) => {
    textureLoader.load(
      primaryUrl,
      (texture) => resolve(texture),
      undefined,
      () => {
        console.error('Failed to load primary texture');
        textureLoader.load(
          fallbackUrl, 
          (fallbackTexture) => resolve(fallbackTexture),
          undefined,
          () => console.error("Failed to load fallback texture")
        );
      }
    );
  });
};

const useTextureWithFallback = (cdnUrl?: string, localUrl?: string) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!cdnUrl && !localUrl) return;
    let isCancelled = false;

    loadWithFallback(cdnUrl!, localUrl!).then((tex) => {
      if (isCancelled) return;
      tex.needsUpdate = true;
      setTexture(tex);
    });

    return () => {
      isCancelled = true;
    };
  }, [cdnUrl, localUrl]);

  return texture;
};

export default useTextureWithFallback;