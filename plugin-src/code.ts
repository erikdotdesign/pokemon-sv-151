import { scaleAndPositionNode } from "./helpers";

figma.showUI(__html__, { themeColors: true, width: 592, height: 592 });

const saveToStorage = async (key: string, value: any) => {
  await figma.clientStorage.setAsync(key, value);
};

const loadFromStorage = async (key: string) => {
  const value = await figma.clientStorage.getAsync(key);
  figma.ui.postMessage({ type: "storage-loaded", key, value });
};

const addImage = async (msg: { img: string, name: string }, disclaimer = false) => {
  // Fallback to image
  const base64 = msg.img.split(",")[1];
  const data = figma.base64Decode(base64);
  const image = figma.createImage(data);

  const node = figma.createRectangle();
  node.fills = [{ type: "IMAGE", scaleMode: "FILL", imageHash: image.hash }];
  node.name = msg.name;
  scaleAndPositionNode(node, 1, 733, 733/1024);
  figma.currentPage.selection = [node];
  if (disclaimer) {
    figma.notify(`Image added (a Figma pro plan is required for video 😢)`);
  } else {
    figma.notify(`Image added`);
  }
};

const addVideoOrImage = async (msg: { video: string; image: string, name: string }) => {
  try {
    // Try video first
    const base64 = msg.video.split(",")[1];
    const data = figma.base64Decode(base64);
    const video = await figma.createVideoAsync(data);

    const node = figma.createRectangle();
    node.fills = [{ type: "VIDEO", scaleMode: "FILL", videoHash: video.hash }];
    node.name = msg.name;
    scaleAndPositionNode(node, 1, 733);
    figma.currentPage.selection = [node];
    figma.notify(`Video added`);
  } catch {
    // Fallback to image
    addImage({img: msg.image, name: msg.name}, true);
  }
};

const handlers: Record<string, (msg: any) => void | Promise<void>> = {
  "save-storage": (msg) => saveToStorage(msg.key, msg.value),
  "load-storage": (msg) => loadFromStorage(msg.key),
  "add-video": (msg) => addVideoOrImage(msg.value),
  "add-image": (msg) => addImage(msg.value)
};

figma.ui.onmessage = async (msg) => {
  const handler = handlers[msg.type];
  if (handler) {
    await handler(msg);
  }
};