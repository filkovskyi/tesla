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
  Color,
  createStyles
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

  //const isMobile = mobileAndTabletCheck()

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
    target.set(0.15, -0.23, -0.30)
    position.set(-4.49, 1.42, -4.05)
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

  if (camera.controls) camera.controls.enabled = false

  // WEBGi mobile adjustments
  // if (isMobile) {
  //   ssr.passes.ssr.passObject.stepCount /= 2
  //   bloom.enabled = false
  //   camera.setCameraOptions({ fov: 65 })
  // }

  // WEBGi load model
  await manager.addFromPath("./assets/tesla_2_1.glb");

  //Tesla_Scene
  const teslaObjectNames = [
    'door_lf_dummy',
    'door_lr_dummy',
    'chassis_dummy'
  ]
  //viewer.scene.findObjectsByName('chassis_dummy')[0]
  const teslaObjects: any[] = []
  for (const obj of teslaObjectNames) {
    const itemObject = viewer.scene.findObjectsByName(obj)[0];
    teslaObjects.push(itemObject)
  }

  window.scrollTo(0, 0)
  await timeout(50)

  function introAnimation() {
    const introTL = gsap.timeline()
    introTL
      .to('.loader', { x: '150%', duration: 0.8, ease: "power4.inOut", delay: 1 })
      .fromTo('.header--container', { opacity: 0, y: '-100%' }, { opacity: 1, y: '0%', ease: "power1.inOut", duration: 0.8 }, '-=1')
      //.fromTo(target, { x: 3.16, y: -0.13, z: 0.51 }, { x: isMobile ? -0.1 : 0.86, y: -0.13, z: 0.51, duration: 4, onUpdate }, '-=4')
      .fromTo('.hero--content', { opacity: 0, x: '-50%' }, { opacity: 1, x: '0%', ease: "power4.inOut", duration: 1.8, onComplete: setupScrollAnimation }, '-=1')
  }

  function setupScrollAnimation() {
    document.body.style.overflowY = "scroll";
    document.body.removeChild(loaderElement);

    const tl = gsap.timeline();

    // function hideDoors() {
    //   teslaObjects[0].visible = false
    //   teslaObjects[1].visible = false
    // }

    // function showDoors() {
    //   teslaObjects[0].visible = true
    //   teslaObjects[1].visible = true
    // }

    tl
      // CAM-2
      .to(position, {
        x: -3.431713076, y: 0.8075677753, z: -0.1423553514,
        scrollTrigger: {
          trigger: ".cam-view-2",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
          //       markers: true
        },
        onUpdate,
        // hideDoors
      })
      .to(target, {
        x: 0.1688648285, y: -0.121886754, z: 0.0934596791,
        scrollTrigger: {
          trigger: ".cam-view-2",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false
        }
      })
      .fromTo('.section--container-cam-2',
        { opacity: 0.2, x: '130%' },
        {
          opacity: 1,
          x: '0%',
          duration: 0.3,
          ease: "power4.Out",
          scrollTrigger: {
            trigger: ".cam-view-2",
            start: "top bottom",
            end: "top top",
            scrub: 1,
            immediateRender: false
          }
        })
      // CAM-3
      .to(position, {
        x: -2.3936073874, y: 1.1716831161, z: -5.7753367126,
        scrollTrigger: {
          trigger: ".cam-view-3",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
          //       markers: true
        },
        onUpdate,
        //   showDoors
      })
      .to(target, {
        x: 0.15, y: - 0.23, z: -0.30,
        scrollTrigger: {
          trigger: ".cam-view-3",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false
        }
      })
      .fromTo('.section--container-cam-2',
        { opacity: 1, },
        {
          opacity: 0,
          duration: 0.3,
          ease: "power4.Out",
          scrollTrigger: {
            trigger: ".cam-view-3",
            start: "top bottom",
            end: "top top",
            scrub: 1,
            immediateRender: false
          }
        })
      // CAM-4
      .to(position, {
        x: 2.2974944318, y: 1.7064613103, z: 5.1867906605,
        scrollTrigger: {
          trigger: ".cam-view-4",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
          //       markers: true
        },
        onUpdate,
        //   showDoors
      })
      .to(target, {
        x: 0.15, y: - 0.23, z: 0.30,
        scrollTrigger: {
          trigger: ".cam-view-4",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false
        }
      })
      .fromTo('.section--container-cam-3',
        { opacity: 1, },
        {
          opacity: 0,
          duration: 0.3,
          ease: "power4.Out",
          scrollTrigger: {
            trigger: ".cam-view-4",
            start: "top bottom",
            end: "top top",
            scrub: 1,
            immediateRender: false
          }
        })
      // CAM-5
      .to(position, {
        x: -0.25, y: 8.5, z: -0.14,
        scrollTrigger: {
          trigger: ".cam-view-5",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
          //       markers: true
        },
        onUpdate,
        //   showDoors
      })
      .to(target, {
        x: -0.25, y: -0.22, z: -0.14,
        scrollTrigger: {
          trigger: ".cam-view-5",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false
        }
      })
      .fromTo('.section--container-cam-4',
        { opacity: 1, },
        {
          opacity: 0,
          duration: 0.3,
          ease: "power4.Out",
          scrollTrigger: {
            trigger: ".cam-view-5",
            start: "top bottom",
            end: "top top",
            scrub: 1,
            immediateRender: false
          }
        })
      .fromTo('.section--container-cam-5',
        { opacity: 0.2, x: '130%' },
        {
          opacity: 1,
          x: '0%',
          duration: 0.3,
          ease: "power4.Out",
          scrollTrigger: {
            trigger: ".cam-view-5",
            start: "top bottom",
            end: "top top",
            scrub: 1,
            immediateRender: false
          }
        })
      // CAM-6
      .to(position, {
        x: 0.261602072, y: 0.5608170062, z: 0.6696940701,
        scrollTrigger: {
          trigger: ".cam-view-6",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
          //       markers: true
        },
        onUpdate,
        //   showDoors
      })
      .to(target, {
        x: -0.143696334, y: 0.0157212266, z: -0.3114864004,
        scrollTrigger: {
          trigger: ".cam-view-6",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false
        }
      })
  };

  let needsUpdate = true;
  function onUpdate() {
    needsUpdate = true;
  }

  // if (!isMobile) {
  //   const sections = document.querySelectorAll('.section')
  //   const sectionTops: number[] = []
  //   sections.forEach(section => {
  //     sectionTops.push(section.getBoundingClientRect().top)
  //   })
  //   setupCustomWheelSmoothScrolling(viewer, document.documentElement, sectionTops,)
  // }
  // else {
  //   createStyles(`html, body { scroll-snap-type: y mandatory;}`)
  // }

  viewer.addEventListener('preFrame', () => {
    if (needsUpdate) {
      camera.positionUpdated(false)
      camera.targetUpdated(true)
      needsUpdate = false;
    }
  })

  // EXPLORE ALL FEATURES EVENT
  document.querySelectorAll('.button-explore').forEach(
    function (currentValue, currentIndex, listObj) {
      currentValue?.addEventListener('click', () => {
        exploreView.style.pointerEvents = "none"
        canvasView.style.pointerEvents = "all"
        canvasContainer.style.zIndex = "1"
        header.style.position = "fixed"
        document.body.style.overflowY = "hidden"
        document.body.style.cursor = "grab"
        exploreAnimation()
      })
    },
  );

  function exploreAnimation() {
    const tlExplore = gsap.timeline()

    tlExplore
      .to(position,
        {
          x: 5, y: 0.3, z: -4.5,
          duration: 2.5,
          onUpdate
        })
      .to(target, { x: -0.26, y: -0.2, z: 0.9, duration: 2.5, onUpdate }, '-=2.5')
      .fromTo('.header', { opacity: 0 }, { opacity: 1, duration: 1.5, ease: "power4.out" }, '-=2.5')
      .to('.section', { opacity: 0, duration: 1.5, ease: "power4.out", }, '-=2.5')
      .to('.explore--content', { opacity: 0, x: '130%', duration: 1.5, ease: "power4.out", onComplete: onCompleteExplore }, '-=2.5')
  }

  function onCompleteExplore() {
    exitContainer.style.display = "flex"
    if (camera.controls) camera.controls.enabled = true
  }

  document.querySelectorAll('.button--body').forEach(
    function (currentValue, currentIndex, listObj) {
      currentValue?.addEventListener('click', () => {
        let colorLerpValue = { x: 0 }
        const teslaBody = viewer.scene.findObjectsByName('bonnet_ok_primary_0')[0]
        const colorBodyType = currentValue.attributes[1].value
        switch (colorBodyType) {
          case 'black':
            teslaBody.material.color.lerpColors(
              new Color(0x000).convertSRGBToLinear(),
              new Color(0x000).convertSRGBToLinear(),
              colorLerpValue.x
            )
            break;
          case 'grey':
            teslaBody.material.color.lerpColors(
              new Color(0x8E8E8E).convertSRGBToLinear(),
              new Color(0x8E8E8E).convertSRGBToLinear(),
              colorLerpValue.x
            )
            break;
          case 'red':
            teslaBody.material.color.lerpColors(
              new Color(0xCC0000).convertSRGBToLinear(),
              new Color(0xCC0000).convertSRGBToLinear(),
              colorLerpValue.x
            )
            break;
          case 'blue':
            teslaBody.material.color.lerpColors(
              new Color(0x0000ff).convertSRGBToLinear(),
              new Color(0x0000ff).convertSRGBToLinear(),
              colorLerpValue.x
            )
            break;
          case 'default':
            teslaBody.material.color.lerpColors(
              new Color(0xffffff).convertSRGBToLinear(),
              new Color(0xffffff).convertSRGBToLinear(),
              colorLerpValue.x
            )
            break;
          default:
            teslaBody.material.color.lerpColors(
              new Color(0xffffff).convertSRGBToLinear(),
              new Color(0xffffff).convertSRGBToLinear(),
              colorLerpValue.x
            )
            break;
        }
        onUpdate()
      })
    },
  );

  document.querySelector('.button--exit')?.addEventListener('click', () => {
    exploreView.style.pointerEvents = "all"
    canvasView.style.pointerEvents = "none"
    canvasContainer.style.zIndex = "unset"
    document.body.style.overflowY = "auto"
    exitContainer.style.display = "none"
    header.style.position = "absolute"
    document.body.style.cursor = "default"
    exitAnimation()
  })

  // EXIT EVENT
  function exitAnimation() {
    if (camera.controls) camera.controls.enabled = false

    const tlExit = gsap.timeline()

    tlExit.to(position, { x: -4.49, y: 1.42, z: -4.05, duration: 1.2, ease: "power4.out", onUpdate })
      .to(target, { x: 0.15, y: -0.23, z: -0.30, duration: 1.2, ease: "power4.out", onUpdate }, '-=1.2')
      .to('.explore--content', { opacity: 1, x: '0%', duration: 0.5, ease: "power4.out" }, '-=1.2')
      .to('.section', { opacity: 1, duration: 1.5, ease: "power4.out" }, '-=2.5')
  }
}

function setupCustomWheelSmoothScrolling(viewer: ViewerApp, element: HTMLElement, snapPositions: number[], speed = 1.5) {
  let customScrollY = element.scrollTop
  let frameDelta = 0
  let scrollVelocity = 0

  window.addEventListener('wheel', (e: WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // todo: check delta mode?
    frameDelta = Math.min(Math.max(e.deltaY * speed, -window.innerHeight / 3), window.innerHeight / 3)
    return false
  }, { passive: false })


  const idleSpeedFactor = 0.05
  const snapSpeedFactor = 0.4
  const snapProximity = window.innerHeight / 4
  const wheelDamping = 0.25
  const velocityDamping = 0.2

  viewer.addEventListener('preFrame', () => {
    if (Math.abs(frameDelta) < 1) {
      const nearestSection = snapPositions.reduce((prev, curr) => Math.abs(curr - customScrollY) < Math.abs(prev - customScrollY) ? curr : prev)
      const d = nearestSection - customScrollY
      scrollVelocity = d * (Math.abs(d) < snapProximity ? snapSpeedFactor : idleSpeedFactor);
    }
    scrollVelocity += frameDelta * wheelDamping
    frameDelta *= (1. - wheelDamping)
    if (Math.abs(frameDelta) < 0.01) frameDelta = 0
    if (Math.abs(scrollVelocity) > 0.01) {
      customScrollY = Math.max(customScrollY + scrollVelocity * velocityDamping, 0)
      element.scrollTop = customScrollY
      scrollVelocity *= (1. - velocityDamping)
    } else {
      scrollVelocity = 0
    }

  })

}

setupViewer();
