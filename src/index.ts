import {
  ViewerApp,
  AssetManagerPlugin,
  TonemapPlugin,
  addBasePlugins,
  TweakpaneUiPlugin,
  AssetManagerBasicPopupPlugin,
  CanvasSnipperPlugin,
  IViewerPlugin,
  AssetImporter,
} from "webgi";
import "./styles.css";
import gsap from "gsap";

async function setupViewer() {
  // Initialize the viewer
  const viewer = new ViewerApp({
    canvas: document.getElementById("webgi-canvas") as HTMLCanvasElement,
    useRgbm: true,
    useGBufferDepth: true,
    isAntialiased: false,
  });

  viewer.renderer.displayCanvasScaling = Math.min(window.devicePixelRatio, 1);

  const manager = await viewer.addPlugin(AssetManagerPlugin);
  const camera = viewer.scene.activeCamera;
  const position = camera.position;
  const target = camera.target;

  // WEBGi loader
  const importer = manager.importer as AssetImporter;

  importer.addEventListener("onStart", (ev) => {
    target.set(8.16, -0.13, 0.51);
    position.set(3.6, -0.04, -3.93);
    onUpdate();
  });

  importer.addEventListener("onProgress", (ev) => {
    const progressRatio = ev.loaded / ev.total;
    document
      .querySelector(".progress")
      ?.setAttribute("style", `transform: scaleX(${progressRatio})`);
  });

  importer.addEventListener("onLoad", (ev) => {
    introAnimation();
    console.log("loaded");
  });

  const introAnimation = () => {
    const introAnimationTimeLine = gsap.timeline();
    introAnimationTimeLine.to(".loader", {
      x: "150%",
      duration: 0.8,
      ease: "power4.inOut",
      delay: 1,
    });
  };

  let needsUpdate = true;
  function onUpdate() {
    needsUpdate = true;
  }

  await viewer.addPlugin(AssetManagerBasicPopupPlugin);
  await addBasePlugins(viewer);
  await viewer.addPlugin(CanvasSnipperPlugin);

  viewer.renderer.refreshPipeline();
  await manager.addFromPath("./assets/tesla.glb");
  const uiPlugin = await viewer.addPlugin(TweakpaneUiPlugin);

  uiPlugin.setupPlugins<IViewerPlugin>(TonemapPlugin, CanvasSnipperPlugin);
}

setupViewer();
