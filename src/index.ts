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
} from "webgi"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import "./styles.css";

gsap.registerPlugin(ScrollTrigger)

async function setupViewer() {

  const viewer = new ViewerApp({
    canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
    useRgbm: true,
    useGBufferDepth: true,
    isAntialiased: false
  })

  const isMobile = mobileAndTabletCheck()

  viewer.renderer.displayCanvasScaling = Math.min(window.devicePixelRatio, 1)

  const manager = await viewer.addPlugin(AssetManagerPlugin)
  const camera = viewer.scene.activeCamera
  const position = camera.position
  const target = camera.target

  // Interface Elements
  const exploreView = document.querySelector('.cam-view-5') as HTMLElement
  const canvasView = document.getElementById('webgi-canvas') as HTMLElement
  const canvasContainer = document.getElementById('webgi-canvas-container') as HTMLElement
  const exitContainer = document.querySelector('.exit--container') as HTMLElement
  const loaderElement = document.querySelector('.loader') as HTMLElement
  const header = document.querySelector('.header') as HTMLElement
  const bodyButton = document.querySelector('.button--body') as HTMLElement

  // Add WEBGi plugins
  await viewer.addPlugin(GBufferPlugin)
  await viewer.addPlugin(new ProgressivePlugin(32))
  await viewer.addPlugin(new TonemapPlugin(true))
  const ssr = await viewer.addPlugin(SSRPlugin)
  const ssao = await viewer.addPlugin(SSAOPlugin)
  await viewer.addPlugin(FrameFadePlugin)
  await viewer.addPlugin(GroundPlugin)
  const bloom = await viewer.addPlugin(BloomPlugin)
  await viewer.addPlugin(TemporalAAPlugin)
  await viewer.addPlugin(RandomizedDirectionalLightPlugin, false)

  ssr!.passes.ssr.passObject.lowQualityFrames = 0
  bloom.pass!.passObject.bloomIterations = 2
  ssao.passes.ssao.passObject.material.defines.NUM_SAMPLES = 4

  // WEBGi loader
  const importer = manager.importer as AssetImporter

  importer.addEventListener("onStart", (ev) => {
    target.set(8.16, -0.13, 0.51)
    position.set(3.6, -0.04, -3.93)
    onUpdate()
  })

  importer.addEventListener("onProgress", (ev) => {
    const progressRatio = (ev.loaded / ev.total)
    document.querySelector('.progress')?.setAttribute('style', `transform: scaleX(${progressRatio})`)
  })

  importer.addEventListener("onLoad", (ev) => {
    introAnimation()
  })

  viewer.renderer.refreshPipeline()

  // WEBGi load model
  await manager.addFromPath("./assets/camera.glb")

  const lensObjects: any[] = []
  // for (const obj of lensObjectNames) {
  //   const o = viewer.scene.findObjectsByName(obj)[0]
  //   o.userData.__startPos = o.position.z
  //   o.userData.__deltaPos = -Math.pow(Math.abs(o.position.z) * 1.5, 1.25)

  //   lensObjects.push(o)
  // }

  if (camera.controls) camera.controls.enabled = false

  // WEBGi mobile adjustments
  if (isMobile) {
    ssr.passes.ssr.passObject.stepCount /= 2
    bloom.enabled = false
    camera.setCameraOptions({ fov: 65 })
  }

  window.scrollTo(0, 0)

  await timeout(50)

  // WEBGi load model
  await manager.addFromPath("./assets/tesla.glb");

  // WEBGi mobile adjustments
  if (isMobile) {
    ssr.passes.ssr.passObject.stepCount /= 2
    bloom.enabled = false
    camera.setCameraOptions({ fov: 65 })
  }

  window.scrollTo(0, 0)

  await timeout(50)

  function introAnimation() {
    const introTL = gsap.timeline()
    introTL
      .to('.loader', { x: '150%', duration: 0.8, ease: "power4.inOut", delay: 1 })
      .fromTo('.header--container', { opacity: 0, y: '-100%' }, { opacity: 1, y: '0%', ease: "power1.inOut", duration: 0.8 }, '-=1')
      .fromTo('.hero--content', { opacity: 0, x: '-50%' }, { opacity: 1, x: '0%', ease: "power4.inOut", duration: 1.8, onComplete: setupScrollAnimation }, '-=1')
  }

  function setupScrollAnimation() {
    document.body.style.overflowY = "scroll";
    document.body.removeChild(loaderElement);

    const tl = gsap.timeline();

    tl
      .to(position, {
        x: 2.5, y: 2, z: 3.5,
        scrollTrigger: {
          trigger: ".cam-view-2",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
          markers: true
        },
        onUpdate
      })
      .to(position, {
        x: -2.5, y: -2, z: 3.5,
        scrollTrigger: {
          trigger: ".cam-view-3",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
          markers: true
        },
        onUpdate
      })
      .to(position, {
        x: -0.5, y: 1, z: 5,
        scrollTrigger: {
          trigger: ".cam-view-4",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
          markers: true
        },
        onUpdate
      })
      .to(position, {
        x: 5, y: 3, z: -2.5,
        scrollTrigger: {
          trigger: ".cam-view-4",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
          markers: true
        },
        onUpdate
      })
      .to(position, {
        x: 2.4, y: -3, z: 5,
        scrollTrigger: {
          trigger: ".cam-view-5",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
          markers: true
        },
        onUpdate
      })
      .to(position, {
        x: 4, y: 3, z: -5,
        scrollTrigger: {
          trigger: ".cam-view-6",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
          markers: true
        },
        onUpdate
      })

  };

  let needsUpdate = true;
  function onUpdate() {
    needsUpdate = true;
  }

  viewer.addEventListener('preFrame', () => {
    if (needsUpdate) {
      camera.positionUpdated(false)
      camera.targetUpdated(true)
      needsUpdate = false;
    }
  })
}

setupViewer();
