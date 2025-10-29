varying vec2 vUv;
uniform vec2 uPointer;
// Foil types
// 0 - NONE
// 1 - FLAT_SILVER
// 2 - SV_HOLO
// 3 - SV_ULTRA
// 4 - SUN_PILLAR
uniform int uFoilType;
// Mask types
// 0 - NONE
// 1 - REVERSE
// 2 - HOLO
// 3 - ETCHED
uniform int uMaskType;
uniform sampler2D uTextureCard;
uniform sampler2D uTextureColor;
uniform sampler2D uTextureNoise;
uniform sampler2D uTextureHighlight;
uniform sampler2D uTextureFoil;
uniform sampler2D uTextureEtch;
uniform sampler2D uTextureGradient;
uniform sampler2D uTextureBands;
uniform bool uUsePostProcessing;

#include "../_chunk/rotate.glsl";
#include "../_chunk/PI.glsl";
#include "../_chunk/linear-to-srgb.glsl";

#include "../_chunk/blend/multiply.glsl";
#include "../_chunk/blend/color-burn.glsl";
#include "../_chunk/blend/color-dodge.glsl";
#include "../_chunk/blend/linear-dodge.glsl";
#include "../_chunk/blend/linear-burn.glsl";
#include "../_chunk/blend/linear-light.glsl";
#include "../_chunk/blend/add.glsl";
#include "../_chunk/blend/overlay.glsl";
#include "../_chunk/blend/phoenix.glsl";
#include "../_chunk/blend/hard-light.glsl";
#include "../_chunk/blend/soft-light.glsl";
#include "../_chunk/blend/vivid-light.glsl";
#include "../_chunk/blend/screen.glsl";
#include "../_chunk/blend/negation.glsl";
#include "../_chunk/blend/subtract.glsl";
#include "../_chunk/blend/reflect.glsl";
#include "../_chunk/blend/glow.glsl";
#include "../_chunk/blend/lighten.glsl";

// Foil

vec4 computeFoilEffect(vec4 base, vec2 uv, float blendInterpolation1, float blendInterpolation2) {
  vec4 finalColor = base;

  vec2 dampenedPointer = uPointer * vec2(0.25, 0.25); 

  vec2 rotateUv = rotate(-PI * 0.2) * (uv - 0.5) + 0.5;

  float uMaskBlackPoint = 0.13;
  float uMaskWhitePoint = 1.0;

  // Foil
  vec2 foilUv = uv;
  vec4 foil = texture2D(uTextureFoil, foilUv);
  float foilMask = clamp((foil.r - uMaskBlackPoint) / (uMaskWhitePoint - uMaskBlackPoint), 0.0, 1.0);
  
  // Etch
  vec2 etchUv = uv;
  vec4 etch = texture2D(uTextureEtch, etchUv);
  float etchMask = clamp((etch.r - uMaskBlackPoint) / (uMaskWhitePoint - uMaskBlackPoint), 0.0, 1.0);

  vec2 noiseUv = uv;
  vec4 noise = texture2D(uTextureNoise, noiseUv);

  // Gradient
  float gradientStepUv = 1.25;
  vec2 gradientUv = vec2(
    rotateUv.x + (1.0 - (uPointer.x * 0.75) * gradientStepUv - gradientStepUv),
    rotateUv.y + (1.0 - (uPointer.y * 0.75) * gradientStepUv - gradientStepUv)
  );
  // Horizontal gradient for SV Holo
  // if (uFoilType == 2) {
  //   gradientStepUv = 1.0;
  //   gradientUv = vec2(
  //     uv.x + (1.0 - (uPointer.x * 2.8) * gradientStepUv - gradientStepUv),
  //     uv.y + (1.0 - (uPointer.y * 2.8) * gradientStepUv - gradientStepUv)
  //   );
  // }
  float gradientScale = 0.25;
  gradientUv += noise.xy * 0.05;
  gradientUv += foil.xy * 0.2;
  gradientUv += etch.xy * 0.05;
  gradientUv = (gradientUv - 0.5) * gradientScale + 0.5;
  vec4 gradient = texture2D(uTextureGradient, gradientUv);

  // Bands 1
  float bandsStepUv1 = 1.2;
  float bandsScale1 = 0.5;
  vec2 bandsUv1 = vec2(
    rotateUv.x + (1.0 - (dampenedPointer.x * bandsScale1) * bandsStepUv1 - bandsStepUv1),
    rotateUv.y + (1.0 - (dampenedPointer.y * bandsScale1) * bandsStepUv1 - bandsStepUv1)
  );
  // Horizontal bands for SV Holos
  if (uFoilType == 2) {
    bandsUv1 = vec2(
      uv.x + (1.0 - (dampenedPointer.x * bandsScale1) * bandsStepUv1 - bandsStepUv1),
      uv.y + (1.0 - (dampenedPointer.y * bandsScale1) * bandsStepUv1 - bandsStepUv1)
    );
  }
  bandsUv1 += noise.xy * 0.05;
  bandsUv1 += foil.xy * 0.2;
  bandsUv1 += etch.xy * 0.05;
  bandsUv1 = (bandsUv1 - 0.5) * bandsScale1 + 0.5;
  vec4 bands1 = texture2D(uTextureBands, bandsUv1);

  // Bands 2
  float bandsStepUv2 = 0.8;
  float bandsScale2 = 0.75;
  vec2 bandsUv2 = vec2(
    rotateUv.x - (1.0 + (dampenedPointer.x * bandsScale2) * bandsStepUv2 - bandsStepUv2),
    (1.0 - rotateUv.y) - (1.0 + (dampenedPointer.y * bandsScale2) * bandsStepUv2 - bandsStepUv2)
  );
  // Horizontal bands for SV Holos
  if (uFoilType == 2) {
    bandsUv2 = vec2(
      uv.x - (1.0 + (dampenedPointer.x * bandsScale2) * bandsStepUv2 - bandsStepUv2),
      (1.0 - uv.y) - (1.0 + (dampenedPointer.y * bandsScale2) * bandsStepUv2 - bandsStepUv2)
    );
  }
  bandsUv2 += noise.xy * 0.05;
  bandsUv2 += foil.xy * 0.2;
  bandsUv2 += etch.xy * 0.05;
  bandsUv2 = (bandsUv2 - 0.5) * bandsScale2 + 0.5;
  vec4 bands2 = texture2D(uTextureBands, bandsUv2);

  // Masked gradients (bands and etch)
  float gray = dot(gradient.rgb, vec3(0.299, 0.587, 0.114));
  vec3 maskedGradient1 = gradient.rgb * bands1.r;
  vec3 maskedGradient2 = gradient.rgb * bands2.r;
  vec3 maskedGradient3 = gradient.rgb * etchMask;
  // Grayscale masked gradients
  vec3 maskedGrayGradient1 = vec3(gray) * bands1.r;
  vec3 maskedGrayGradient2 = vec3(gray) * bands2.r;
  vec3 maskedGrayGradient3 = vec3(gray) * etchMask;

  // Bands with noise
  vec4 noisyBands1 = vec4(blendLinearLight(maskedGradient1.rgb, noise.rgb, blendInterpolation2), 1.0);
  vec4 noisyBands2 = vec4(blendLinearLight(maskedGradient2.rgb, noise.rgb, blendInterpolation2), 1.0);
  vec4 noisyGrayBands1 = vec4(blendLinearLight(maskedGrayGradient1.rgb, noise.rgb, blendInterpolation2), 1.0);
  vec4 noisyGrayBands2 = vec4(blendLinearLight(maskedGrayGradient2.rgb, noise.rgb, blendInterpolation2), 1.0);

  // Reverse foil
  if (uFoilType == 1) {
    finalColor = vec4(blendColorDodge(finalColor.rgb, noisyGrayBands1.rgb, blendInterpolation2), 1.0);
    finalColor = vec4(blendColorDodge(finalColor.rgb, noisyGrayBands1.rgb, blendInterpolation2), 1.0);
    finalColor = vec4(blendColorDodge(finalColor.rgb, noisyGrayBands1.rgb, blendInterpolation2), 1.0);
    finalColor = vec4(blendOverlay(finalColor.rgb, maskedGrayGradient1.rgb, blendInterpolation2), 0.6);
    finalColor = vec4(blendMultiply(finalColor.rgb, maskedGrayGradient1.rgb, blendInterpolation2), 0.6);
  }

  // All other foils
  if (uFoilType != 1) {
    // Foil bands 1
    finalColor = vec4(blendColorDodge(finalColor.rgb, noisyBands1.rgb, blendInterpolation2), 1.0);
    finalColor = vec4(blendColorDodge(finalColor.rgb, noisyBands1.rgb, blendInterpolation2), 1.0);
    finalColor = vec4(blendColorDodge(finalColor.rgb, noisyBands1.rgb, blendInterpolation2), 1.0);
    finalColor = vec4(blendColorDodge(finalColor.rgb, maskedGrayGradient1.rgb, blendInterpolation2), 1.0);
    // Foils bands 2
    finalColor = vec4(blendColorDodge(finalColor.rgb, noisyBands2.rgb, blendInterpolation2), 1.0);
    finalColor = vec4(blendColorDodge(finalColor.rgb, noisyBands2.rgb, blendInterpolation2), 1.0);
    finalColor = vec4(blendColorDodge(finalColor.rgb, noisyBands2.rgb, blendInterpolation2), 1.0);
    finalColor = vec4(blendColorDodge(finalColor.rgb, maskedGrayGradient2.rgb, blendInterpolation2), 1.0);
  }

  // Foil etch
  if (uMaskType == 3) {
    finalColor = vec4(blendColorDodge(finalColor.rgb, maskedGrayGradient3.rgb, blendInterpolation2), 1.0);
    finalColor = vec4(blendColorBurn(finalColor.rgb, maskedGrayGradient3.rgb, blendInterpolation2), 1.0);
  }
  
  // Foil mask
  finalColor = vec4(mix(base.rgb, finalColor.rgb, foilMask), 1.0);
  
  return finalColor;
}

void main() {
  vec2 uv = vUv;

  // Card 
	vec4 base = texture2D(uTextureCard, uv);
  vec4 finalColor = base;
  
  // Blend pointer math
  float pointerDistance = 1.0 - length(uPointer);
  float blendInterpolation1 = clamp(pointerDistance, 0.0, 1.0) - 0.5;
	blendInterpolation1 = clamp(blendInterpolation1, 0.0, 0.5);
  float blendInterpolation2 = clamp(1.0 - pointerDistance, 0.0, 0.5);

  // Apply foil effects
  if (uFoilType != 0) {
    finalColor = computeFoilEffect(finalColor, uv, blendInterpolation1, 0.5);
  }

  if (!uUsePostProcessing) {
    finalColor = vec4(linearTosRGB(finalColor.rgb), finalColor.a);
  }
  
  gl_FragColor = finalColor;
}