import { useState, useEffect } from "react";
import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

// ----------------------
// Load a texture
// ----------------------
const loadTexture = (url: string) =>
  new Promise<THREE.Texture>((resolve, reject) => {
    textureLoader.load(
      url,
      (tex) => resolve(tex),
      undefined,
      () => reject(new Error(`Failed to load texture: ${url}`))
    );
  });

// ----------------------
// Hook
// ----------------------
const useTextureWithFallback = ({
  primaryUrl,
  fallbackUrl,
  colorSpace = THREE.SRGBColorSpace
}: {
  primaryUrl?: string; 
  fallbackUrl?: string;
  colorSpace?: THREE.ColorSpace;
}) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let isCancelled = false;

    // Load fallback first
    if (fallbackUrl) {
      loadTexture(fallbackUrl)
        .then((tex) => {
          if (isCancelled) return;
          tex.colorSpace = colorSpace;
          tex.needsUpdate = true;
          setTexture(tex);
        })
        .catch((err) => console.warn(err));
    }

    // Then load primary (overwrites fallback when ready)
    if (primaryUrl) {
      loadTexture(primaryUrl)
        .then((tex) => {
          if (isCancelled) return;
          tex.colorSpace = colorSpace;
          tex.needsUpdate = true;
          setTexture(tex);
        })
        .catch((err) => console.warn(err));
    }

    return () => {
      isCancelled = true;
      // don’t dispose global textures here
    };
  }, [primaryUrl, fallbackUrl, colorSpace]);

  return texture;
};

export default useTextureWithFallback;