import {
  ViewerApp,
  AssetManagerPlugin,
  timeout,
  SSRPlugin,
  mobileAndTabletCheck,
  GBufferPlugin,
  ProgressivePlugin,
  TonemapPlugin,
  SSAOPlugin,
  GroundPlugin,
  FrameFadePlugin,
  BloomPlugin,
  TemporalAAPlugin,
  RandomizedDirectionalLightPlugin,
  AssetImporter,
  createStyles,
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

  // Interface Elements
  const loaderElement = document.querySelector(".loader") as HTMLElement;

  // Add WEBGi plugins
  await viewer.addPlugin(GBufferPlugin);
  await viewer.addPlugin(new ProgressivePlugin(32));
  await viewer.addPlugin(new TonemapPlugin(true));
  const ssr = await viewer.addPlugin(SSRPlugin);
  const ssao = await viewer.addPlugin(SSAOPlugin);
  await viewer.addPlugin(FrameFadePlugin);
  await viewer.addPlugin(GroundPlugin);
  const bloom = await viewer.addPlugin(BloomPlugin);
  await viewer.addPlugin(TemporalAAPlugin);
  await viewer.addPlugin(RandomizedDirectionalLightPlugin, false);

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

  viewer.renderer.refreshPipeline();

  // WEBGi load model
  await manager.addFromPath("./assets/tesla.glb");

  function introAnimation() {
    const introTL = gsap.timeline();
    introTL
      .to(".loader", {
        x: "150%",
        duration: 0.8,
        ease: "power4.inOut",
        delay: 1,
      })
      .fromTo(
        ".hero--content",
        { opacity: 0, x: "-50%" },
        {
          opacity: 1,
          x: "0%",
          ease: "power4.inOut",
          duration: 1.8,
          onComplete: setupScrollAnimation,
        },
        "-=1"
      )
      .fromTo(
        ".header--container",
        { opacity: 0, y: "-100%" },
        { opacity: 1, y: "0%", ease: "power1.inOut", duration: 0.8 },
        "-=1"
      );
  }

  const setupScrollAnimation = () => {
    document.body.style.overflowY = "scroll";
    document.body.removeChild(loaderElement);

    const tl = gsap.timeline({ default: { ease: "none" } });
  };

  let needsUpdate = true;
  function onUpdate() {
    needsUpdate = true;
  }
}

setupViewer();
