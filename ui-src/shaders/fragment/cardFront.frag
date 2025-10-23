varying vec2 vUv;
uniform vec2 uPointer;
// Foil types
// 0 - none
// 1 - flat silver
// 2 - sv holo
// 3 - sv ultra
// 4 - sun pillar
uniform int uFoilType;
// Mask types
// 0 - none
// 1 - holo
// 2 - etched
uniform int uMaskType;
uniform sampler2D uTextureCard;
uniform sampler2D uTextureColor;
uniform sampler2D uTextureNoise;
uniform sampler2D uTextureHighlight;
uniform sampler2D uTextureFoil;
uniform sampler2D uTextureEtch;
uniform sampler2D uTextureGradient;
uniform sampler2D uTextureBands;

vec3 enhanceContrast(vec3 color, float contrast) {
    return clamp((color - 0.5) * contrast + 0.5, 0.0, 1.0);
}

vec3 boostSaturation(vec3 color, float sat) {
    float gray = dot(color, vec3(0.299, 0.587, 0.114));
    return mix(vec3(gray), color, sat);
}

// Multiply

vec3 blendMultiply(vec3 base, vec3 blend) {
	return base*blend;
}

vec3 blendMultiply(vec3 base, vec3 blend, float opacity) {
	return (blendMultiply(base, blend) * opacity + base * (1.0 - opacity));
}

// Color burn

float blendColorBurn(float base, float blend) {
	return (blend==0.0)?blend:max((1.0-((1.0-base)/blend)),0.0);
}

vec3 blendColorBurn(vec3 base, vec3 blend) {
	return vec3(blendColorBurn(base.r,blend.r),blendColorBurn(base.g,blend.g),blendColorBurn(base.b,blend.b));
}

vec3 blendColorBurn(vec3 base, vec3 blend, float opacity) {
	return (blendColorBurn(base, blend) * opacity + base * (1.0 - opacity));
}

// Linear Dodge
float blendLinearDodge(float base, float blend) {
	// Note : Same implementation as BlendAddf
	return min(base+blend,1.0);
}

vec3 blendLinearDodge(vec3 base, vec3 blend) {
	// Note : Same implementation as BlendAdd
	return min(base+blend,vec3(1.0));
}

vec3 blendLinearDodge(vec3 base, vec3 blend, float opacity) {
	return (blendLinearDodge(base, blend) * opacity + base * (1.0 - opacity));
}

// Linear Burn
float blendLinearBurn(float base, float blend) {
	// Note : Same implementation as BlendSubtractf
	return max(base+blend-1.0,0.0);
}

vec3 blendLinearBurn(vec3 base, vec3 blend) {
	// Note : Same implementation as BlendSubtract
	return max(base+blend-vec3(1.0),vec3(0.0));
}

vec3 blendLinearBurn(vec3 base, vec3 blend, float opacity) {
	return (blendLinearBurn(base, blend) * opacity + base * (1.0 - opacity));
}

// Add
float blendAdd(float base, float blend) {
	return min(base+blend,1.0);
}

vec3 blendAdd(vec3 base, vec3 blend) {
	return min(base+blend,vec3(1.0));
}

vec3 blendAdd(vec3 base, vec3 blend, float opacity) {
	return (blendAdd(base, blend) * opacity + base * (1.0 - opacity));
}

// Overlay
float blendOverlay(float base, float blend) {
	return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
	return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));
}

vec3 blendOverlay(vec3 base, vec3 blend, float opacity) {
	return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));
}

// Phoenix
vec3 blendPhoenix(vec3 base, vec3 blend) {
	return min(base,blend)-max(base,blend)+vec3(1.0);
}

vec3 blendPhoenix(vec3 base, vec3 blend, float opacity) {
	return (blendPhoenix(base, blend) * opacity + base * (1.0 - opacity));
}

// Linear Light
float blendLinearLight(float base, float blend) {
	return blend<0.5?blendLinearBurn(base,(2.0*blend)):blendLinearDodge(base,(2.0*(blend-0.5)));
}

vec3 blendLinearLight(vec3 base, vec3 blend) {
	return vec3(blendLinearLight(base.r,blend.r),blendLinearLight(base.g,blend.g),blendLinearLight(base.b,blend.b));
}

vec3 blendLinearLight(vec3 base, vec3 blend, float opacity) {
	return (blendLinearLight(base, blend) * opacity + base * (1.0 - opacity));
}

// Color dodge
float blendColorDodge(float base, float blend) {
	return (blend==1.0)?blend:min(base/(1.0-blend),1.0);
}

vec3 blendColorDodge(vec3 base, vec3 blend) {
	return vec3(blendColorDodge(base.r,blend.r),blendColorDodge(base.g,blend.g),blendColorDodge(base.b,blend.b));
}

vec3 blendColorDodge(vec3 base, vec3 blend, float opacity) {
	return (blendColorDodge(base, blend) * opacity + base * (1.0 - opacity));
}

// Hard light
vec3 blendHardLight(vec3 base, vec3 blend) {
	return blendOverlay(blend,base);
}

vec3 blendHardLight(vec3 base, vec3 blend, float opacity) {
	return (blendHardLight(base, blend) * opacity + base * (1.0 - opacity));
}

// Soft light
float blendSoftLight(float base, float blend) {
	return (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));
}

vec3 blendSoftLight(vec3 base, vec3 blend) {
	return vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));
}

vec3 blendSoftLight(vec3 base, vec3 blend, float opacity) {
	return (blendSoftLight(base, blend) * opacity + base * (1.0 - opacity));
}

// Screen
float blendScreen(float base, float blend) {
	return 1.0-((1.0-base)*(1.0-blend));
}

vec3 blendScreen(vec3 base, vec3 blend) {
	return vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));
}

vec3 blendScreen(vec3 base, vec3 blend, float opacity) {
	return (blendScreen(base, blend) * opacity + base * (1.0 - opacity));
}

// Negation
vec3 blendNegation(vec3 base, vec3 blend) {
	return vec3(1.0)-abs(vec3(1.0)-base-blend);
}

vec3 blendNegation(vec3 base, vec3 blend, float opacity) {
	return (blendNegation(base, blend) * opacity + base * (1.0 - opacity));
}

// Subtract
float blendSubtract(float base, float blend) {
	return max(base+blend-1.0,0.0);
}

vec3 blendSubtract(vec3 base, vec3 blend) {
	return max(base+blend-vec3(1.0),vec3(0.0));
}

vec3 blendSubtract(vec3 base, vec3 blend, float opacity) {
	return (blendSubtract(base, blend) * opacity + base * (1.0 - opacity));
}

// reflect

float blendReflect(float base, float blend) {
	return (blend==1.0)?blend:min(base*base/(1.0-blend),1.0);
}

vec3 blendReflect(vec3 base, vec3 blend) {
	return vec3(blendReflect(base.r,blend.r),blendReflect(base.g,blend.g),blendReflect(base.b,blend.b));
}

vec3 blendReflect(vec3 base, vec3 blend, float opacity) {
	return (blendReflect(base, blend) * opacity + base * (1.0 - opacity));
}

// glow

vec3 blendGlow(vec3 base, vec3 blend) {
	return blendReflect(blend,base);
}

vec3 blendGlow(vec3 base, vec3 blend, float opacity) {
	return (blendGlow(base, blend) * opacity + base * (1.0 - opacity));
}

// vivid light

float blendVividLight(float base, float blend) {
	return (blend<0.5)?blendColorBurn(base,(2.0*blend)):blendColorDodge(base,(2.0*(blend-0.5)));
}

vec3 blendVividLight(vec3 base, vec3 blend) {
	return vec3(blendVividLight(base.r,blend.r),blendVividLight(base.g,blend.g),blendVividLight(base.b,blend.b));
}

vec3 blendVividLight(vec3 base, vec3 blend, float opacity) {
	return (blendVividLight(base, blend) * opacity + base * (1.0 - opacity));
}

// lighten

float blendLighten(float base, float blend) {
	return max(blend,base);
}

vec3 blendLighten(vec3 base, vec3 blend) {
	return vec3(blendLighten(base.r,blend.r),blendLighten(base.g,blend.g),blendLighten(base.b,blend.b));
}

vec3 blendLighten(vec3 base, vec3 blend, float opacity) {
	return (blendLighten(base, blend) * opacity + base * (1.0 - opacity));
}

// Rotate
mat2 rotate(float rad) {
  float c = cos(rad);
  float s = sin(rad);
  return mat2(
    c, s,
    -s, c
  );
}

// PI
const float PI  = 3.141592653589793;

// Foil

vec4 computeFoilEffect(vec4 base, vec2 uv, float blendInterpolation1, float blendInterpolation2) {
  vec4 finalColor = base;

  vec2 rotateUv = rotate(-PI * 0.2) * (uv - 0.5) + 0.5;
  // vec2 rotateUv = uv * rotate(PI * 0.2);

  // Foil
  vec2 foilUv = uv;
  vec4 foil = texture2D(uTextureFoil, foilUv);
  
  // Etch
  vec2 etchUv = uv;
  vec4 etch = texture2D(uTextureEtch, etchUv);

  vec2 noiseUv = uv;
  vec4 noise = texture2D(uTextureNoise, noiseUv);

  // Gradient
  float gradientStepUv = 1.25;
  vec2 gradientUv = vec2(
    rotateUv.x + (1.0 - uPointer.x * gradientStepUv - gradientStepUv),
    rotateUv.y + (1.0 - uPointer.y * gradientStepUv - gradientStepUv)
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
    rotateUv.x + (1.0 - (uPointer.x * bandsScale1) * bandsStepUv1 - bandsStepUv1),
    rotateUv.y + (1.0 - (uPointer.y * bandsScale1) * bandsStepUv1 - bandsStepUv1)
  );
  // Horizontal bands for SV Holos
  if (uFoilType == 2) {
    bandsUv1 = vec2(
      uv.x + (1.0 - (uPointer.x * bandsScale1) * bandsStepUv1 - bandsStepUv1),
      uv.y + (1.0 - (uPointer.y * bandsScale1) * bandsStepUv1 - bandsStepUv1)
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
    rotateUv.x - (1.0 + (uPointer.x * bandsScale2) * bandsStepUv2 - bandsStepUv2),
    (1.0 - rotateUv.y) - (1.0 + (uPointer.y * bandsScale2) * bandsStepUv2 - bandsStepUv2)
  );
  // Horizontal bands for SV Holos
  if (uFoilType == 2) {
    bandsUv2 = vec2(
      uv.x - (1.0 + (uPointer.x * bandsScale2) * bandsStepUv2 - bandsStepUv2),
      (1.0 - uv.y) - (1.0 + (uPointer.y * bandsScale2) * bandsStepUv2 - bandsStepUv2)
    );
  }
  bandsUv2 += noise.xy * 0.05;
  bandsUv2 += foil.xy * 0.2;
  bandsUv2 += etch.xy * 0.05;
  bandsUv2 = (bandsUv2 - 0.5) * bandsScale2 + 0.5;
  vec4 bands2 = texture2D(uTextureBands, bandsUv2);

  // Masked gradients (bands and etch)
  vec3 maskedGradient1 = gradient.rgb * bands1.r;
  vec3 maskedGradient2 = gradient.rgb * bands2.r;
  float gray = dot(gradient.rgb, vec3(0.299, 0.587, 0.114));
  vec3 maskedGradient3 = vec3(gray) * etch.r;

  // Bands with noise
  vec4 noisyBands1 = vec4(blendLinearLight(maskedGradient1.rgb, noise.rgb, blendInterpolation2), 1.0);
  vec4 noisyBands2 = vec4(blendLinearLight(maskedGradient2.rgb, noise.rgb, blendInterpolation2), 1.0);

  // Foil bands 1
  finalColor = vec4(blendColorDodge(finalColor.rgb, noisyBands1.rgb, blendInterpolation2), 1.0);
  finalColor = vec4(blendColorDodge(finalColor.rgb, noisyBands1.rgb, blendInterpolation2), 1.0);

  // Foils bands 2
  if (uFoilType != 1) {
    finalColor = vec4(blendColorDodge(finalColor.rgb, noisyBands2.rgb, blendInterpolation2), 1.0);
    finalColor = vec4(blendColorDodge(finalColor.rgb, noisyBands2.rgb, blendInterpolation2), 1.0);
  }

  // Boost colors for SV Holo
  if (uFoilType == 2) {
    // vec3 maskedGradient4 = gradient.rgb * foil.r;
    finalColor = vec4(blendMultiply(finalColor.rgb, gradient.rgb, blendInterpolation2 * 0.6), 1.0);
  }

  // Base Foil
  finalColor = vec4(blendOverlay(finalColor.rgb, foil.rgb, blendInterpolation2), 1.0);

  // Foil etch
  if (uMaskType == 2) {
    finalColor = vec4(blendColorBurn(finalColor.rgb, maskedGradient3.rgb, blendInterpolation2), 1.0);
    finalColor = vec4(blendScreen(finalColor.rgb, maskedGradient3.rgb, blendInterpolation2), 1.0);
  }
  
  // Foil mask
  finalColor = vec4(mix(base.rgb, finalColor.rgb, foil.r), 1.0);
  
  return finalColor;
}

void main() {
  vec2 uv = vUv;

  // Card 
	vec4 base = texture2D(uTextureCard, uv);
  vec4 finalColor = base;

  // Highlight
  vec2 highlightUv = vec2(
    uv.x + 1.0 - uPointer.x - 1.0,
    uv.y + 1.0 - uPointer.y - 1.0
  );
  vec4 highlight = texture2D(uTextureHighlight, highlightUv);

  // Blend pointer math
  float pointerDistance = 1.0 - length(uPointer);
  float blendInterpolation1 = clamp(pointerDistance, 0.0, 1.0) - 0.5;
	blendInterpolation1 = clamp(blendInterpolation1, 0.0, 0.5);
  float blendInterpolation2 = clamp(1.0 - pointerDistance, 0.0, 0.5);

  if (uFoilType != 0) {
    finalColor = computeFoilEffect(finalColor, uv, blendInterpolation1, blendInterpolation2);
  }

  // Highlight
  // finalColor = vec4(blendAdd(finalColor.rgb, highlight.rgb, blendInterpolation2 * 0.5), 1.0);

  // Final
  // finalColor = vec4(pow(finalColor.rgb, vec3(0.6)), 1.0);

  gl_FragColor = finalColor;
}