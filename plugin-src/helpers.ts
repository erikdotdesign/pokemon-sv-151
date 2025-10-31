export const getTargetBounds = () => {
  const selection = figma.currentPage.selection;

  if (selection.length > 0) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const node of selection) {
      const box = node.absoluteBoundingBox;
      if (!box) continue;
      if (box.x < minX) minX = box.x;
      if (box.y < minY) minY = box.y;
      if (box.x + box.width > maxX) maxX = box.x + box.width;
      if (box.y + box.height > maxY) maxY = box.y + box.height;
    }

    if (minX === Infinity) return null;

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  } else {
    const vw = figma.viewport.bounds.width;
    const vh = figma.viewport.bounds.height;
    return {
      x: figma.viewport.center.x - vw / 2,
      y: figma.viewport.center.y - vh / 2,
      width: vw,
      height: vh,
    };
  }
};

export const scaleAndPositionNode = (
  node: SceneNode,
  scalePercent = 1,
  maxWidthOption?: number,
  aspectRatio = 1
) => {
  const targetBounds = getTargetBounds();
  if (!targetBounds) return;

  const margin = 0;
  let targetWidth = targetBounds.width * scalePercent - margin;
  let targetHeight = targetBounds.height * scalePercent - margin;

  // Clamp width if requested
  if (maxWidthOption && targetWidth > maxWidthOption) {
    targetWidth = maxWidthOption;
  }

  // Force the region to match aspect ratio (reshape it)
  if (aspectRatio > 0) {
    // Derive height from width
    targetHeight = targetWidth / aspectRatio;

    // If it exceeds available height, adjust width instead
    if (targetHeight > targetBounds.height * scalePercent - margin) {
      targetHeight = targetBounds.height * scalePercent - margin;
      targetWidth = targetHeight * aspectRatio;
    }
  }

  // Resize node to that shape (no proportional lock)
  node.resize(targetWidth, targetHeight);
  
  // Lock aspect ratio
  node.lockAspectRatio();

  // Center inside target
  node.x = targetBounds.x + (targetBounds.width - targetWidth) / 2;
  node.y = targetBounds.y + (targetBounds.height - targetHeight) / 2;

  return { width: targetWidth, height: targetHeight };
};