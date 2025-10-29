import { useState, useEffect } from "react";
import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

// ----------------------
// Load a texture with fallback
// ----------------------
const loadWithFallback = (primaryUrl?: string, fallbackUrl?: string) => {
  return new Promise<THREE.Texture>((resolve) => {
    const loadTexture = (url: string, onFail?: () => void) => {
      textureLoader.load(
        url,
        (tex) => {
          resolve(tex);
        },
        undefined,
        () => {
          console.error(`Failed to load texture: ${url}`);
          if (onFail) onFail();
        }
      );
    };
    if (primaryUrl) {
      loadTexture(primaryUrl, () => {
        if (fallbackUrl) loadTexture(fallbackUrl);
      });
    } else if (fallbackUrl) {
      loadTexture(fallbackUrl);
    }
  });
};

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
    if (!primaryUrl && !fallbackUrl) return;
    let isCancelled = false;

    loadWithFallback(primaryUrl, fallbackUrl).then((tex) => {
      if (isCancelled) return;
      tex.colorSpace = colorSpace;
      tex.needsUpdate = true;
      setTexture(tex);
    });

    return () => {
      isCancelled = true;
      // do NOT dispose the cached texture here — it’s global and reused
    };
  }, [primaryUrl, fallbackUrl]);

  return texture;
};

export default useTextureWithFallback;