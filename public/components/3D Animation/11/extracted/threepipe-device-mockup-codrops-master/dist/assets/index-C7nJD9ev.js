import {
  CameraViewPlugin,
  CanvasSnapshotPlugin,
  ContactShadowGroundPlugin,
  LoadingScreenPlugin,
  PickingPlugin,
  PopmotionPlugin,
  SRGBColorSpace,
  ThreeViewer,
  TransformAnimationPlugin,
  TransformControlsPlugin,
  timeout,
} from "threepipe";
import { TweakpaneUiPlugin } from "@threepipe/plugin-tweakpane";
//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]'))
    processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes)
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true,
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
//#endregion
//#region src/main.ts
async function init() {
  const viewer = new ThreeViewer({
    canvas: document.getElementById("threepipe-canvas"),
    msaa: false,
    renderScale: "auto",
    dropzone: {
      allowedExtensions: ["png", "jpeg", "jpg", "webp", "svg", "hdr", "exr"],
      autoImport: true,
      addOptions: {
        disposeSceneObjects: false,
        autoSetBackground: false,
        autoSetEnvironment: true,
      },
    },
    plugins: [
      LoadingScreenPlugin,
      PickingPlugin,
      PopmotionPlugin,
      CameraViewPlugin,
      TransformAnimationPlugin,
      new TransformControlsPlugin(false),
      CanvasSnapshotPlugin,
      ContactShadowGroundPlugin,
    ],
  });
  const ui = viewer.addPluginSync(new TweakpaneUiPlugin(true));
  const devices = await viewer.load("./models/tabletop_macbook_iphone.glb");
  if (!devices) return;
  const macbook = devices.getObjectByName("macbook");
  const iphone = devices.getObjectByName("iphone");
  const macbookScreen = macbook.getObjectByName("Bevels_2");
  macbookScreen.name = "Macbook Screen";
  ui.setupPluginUi(CanvasSnapshotPlugin, { expanded: false });
  ui.appendChild(macbookScreen.uiConfig, { expanded: false });
  ui.appendChild(iphone.uiConfig, { expanded: false });
  ui.setupPluginUi(CameraViewPlugin, { expanded: false });
  ui.appendChild(viewer.scene.mainCamera.uiConfig);
  ui.setupPluginUi(TransformControlsPlugin, { expanded: true });
  viewer.assetManager.addEventListener("loadAsset", (e) => {
    if (!e.data?.isTexture) return;
    const texture = e.data;
    texture.colorSpace = SRGBColorSpace;
    const mbpScreen = viewer.scene.getObjectByName("Object_7")?.material;
    const iPhoneScreen = viewer.scene.getObjectByName("xXDHkMplTIDAXLN")
      ?.material;
    console.log(mbpScreen, iPhoneScreen);
    if (!mbpScreen || !iPhoneScreen) return;
    mbpScreen.color.set(0, 0, 0);
    mbpScreen.emissive.set(1, 1, 1);
    mbpScreen.roughness = 0.2;
    mbpScreen.metalness = 0.8;
    mbpScreen.map = null;
    mbpScreen.emissiveMap = texture;
    iPhoneScreen.emissiveMap = texture;
    mbpScreen.setDirty();
    iPhoneScreen.setDirty();
  });
  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;
  const viewName = (key) => (isMobile() ? key + "2" : key);
  const transformAnim = viewer.getPlugin(TransformAnimationPlugin);
  const cameraView = viewer.getPlugin(CameraViewPlugin);
  const picking = viewer.getPlugin(PickingPlugin);
  picking.widgetEnabled = false;
  picking.hoverEnabled = true;
  await transformAnim.animateTransform(macbookScreen, "closed", 50)?.promise;
  await transformAnim.animateTransform(iphone, "facedown", 50)?.promise;
  await cameraView.animateToView(viewName("start"), 50);
  const state = {
    focused: "",
    hover: "",
    animating: false,
  };
  const nextState = {
    focused: "",
    hover: "",
  };
  async function updateState() {
    if (state.animating) return;
    const next = nextState;
    if (next.focused === state.focused && next.hover === state.hover) return;
    state.animating = true;
    const isOpen = state.focused;
    Object.assign(state, next);
    if (state.focused)
      await Promise.all([
        transformAnim.animateTransform(
          macbookScreen,
          state.focused === "macbook" ? "open" : "closed",
          500
        )?.promise,
        transformAnim.animateTransform(
          iphone,
          state.focused === "iphone" ? "floating" : "facedown",
          500
        )?.promise,
        cameraView.animateToView(
          viewName(state.focused === "macbook" ? "macbook" : "iphone"),
          500
        ),
      ]);
    else if (state.hover)
      await Promise.all([
        transformAnim.animateTransform(
          macbookScreen,
          state.hover === "macbook" ? "hover" : "closed",
          250
        )?.promise,
        transformAnim.animateTransform(
          iphone,
          state.hover === "iphone" ? "tilted" : "facedown",
          250
        )?.promise,
      ]);
    else {
      const duration = isOpen ? 500 : 250;
      await Promise.all([
        transformAnim.animateTransform(macbookScreen, "closed", duration)
          ?.promise,
        transformAnim.animateTransform(iphone, "facedown", duration)?.promise,
        isOpen ? cameraView.animateToView(viewName("front"), duration) : null,
      ]);
    }
    state.animating = false;
  }
  async function setState(next) {
    Object.assign(nextState, next);
    while (state.animating) await timeout(50);
    await updateState();
  }
  function deviceFromHitObject(object) {
    let device = "";
    object.traverseAncestors((o) => {
      if (o === macbook) device = "macbook";
      if (o === iphone) device = "iphone";
    });
    return device;
  }
  picking.addEventListener("hoverObjectChanged", async (e) => {
    const object = e.object;
    if (!object) {
      if (state.hover && !state.focused)
        await setState({
          hover: "",
          focused: "",
        });
      return;
    }
    if (state.focused) return;
    await setState({
      hover: deviceFromHitObject(object),
      focused: "",
    });
  });
  picking.addEventListener("hitObject", async (e) => {
    const object = e.intersects.selectedObject;
    if (!object) {
      if (state.focused)
        await setState({
          hover: "",
          focused: "",
        });
      return;
    }
    const device = deviceFromHitObject(object);
    e.intersects.selectedObject = device === "macbook" ? macbook : iphone;
    await setState({
      focused: device,
      hover: "",
    });
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && state.focused)
      setState({
        hover: "",
        focused: "",
      });
  });
}
init();
//#endregion
