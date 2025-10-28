import { useState, useEffect } from "react";
import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

// ----------------------
// Global texture cache
// ----------------------
const textureCache = new Map<string, THREE.Texture>();

// ----------------------
// Load a texture with fallback
// ----------------------
const loadWithFallback = (primaryUrl?: string, fallbackUrl?: string) => {
  return new Promise<THREE.Texture>((resolve) => {
    const key = primaryUrl || fallbackUrl!;
    if (textureCache.has(key)) {
      resolve(textureCache.get(key)!);
      return;
    }

    const loadTexture = (url: string, onFail?: () => void) => {
      textureLoader.load(
        url,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace; // consistent color space
          textureCache.set(key, tex);
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
const useTextureWithFallback = (cdnUrl?: string, localUrl?: string) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!cdnUrl && !localUrl) return;
    let isCancelled = false;

    loadWithFallback(cdnUrl, localUrl).then((tex) => {
      if (isCancelled) return;
      tex.needsUpdate = true;
      setTexture(tex);
    });

    return () => {
      isCancelled = true;
      // do NOT dispose the cached texture here — it’s global and reused
    };
  }, [cdnUrl, localUrl]);

  return texture;
};

export default useTextureWithFallback;