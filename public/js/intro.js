/**
 * NETFLICK CINEMATIC INTRO — CONTROLLER
 * Genuine 3D WebGL Three.js Red Ribbon Ident
 *
 * Sequence:
 *   Scene 1 (0.0s – 1.5s) : Darkness & The Igniting Spark
 *   Scene 2 (1.5s – 5.0s) : 3D Physical Ribbon Formation
 *   Scene 3 (5.0s – 7.0s) : Completed 3D N & Glossy Light Sweep
 *   Scene 4 (7.0s – 9.5s) : Cinematic Vertical Light-Strip Environment
 *   Scene 5 (9.5s – 11.6s): NETFLICK Wordmark Resolve -> Navigation to Login
 */

// Navigation & State Management
const completionKey = "netflickIntroPlayed";
const isFirstRun = new URLSearchParams(window.location.search).get("flow") === "first-run";
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const container = document.querySelector(".intro-container");
const viewport = document.getElementById("webgl-viewport");
const skipBtn = document.getElementById("intro-skip-btn");

let hasNavigated = false;
let animationFrameId = null;
let cleanupHandler = null;

function navigateToLogin() {
    if (hasNavigated) return;
    hasNavigated = true;

    if (cleanupHandler) {
        try {
            cleanupHandler();
        } catch (err) {
            // Silently handle disposal errors during navigation
        }
    }

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    // Normal application tracking: only mark as completed if it was a first-run flow
    // Manual testing at /netflick/intro preserves existing completion state
    if (isFirstRun) {
        try {
            window.localStorage.setItem(completionKey, "true");
        } catch (e) {
            // Storage quota / disabled
        }
    }

    window.location.replace("/netflick/login");
}

// User-interactive Skip Controls
if (skipBtn) {
    skipBtn.addEventListener("click", navigateToLogin);
    // Reveal skip button smoothly after 1.2 seconds
    setTimeout(() => {
        if (!hasNavigated) skipBtn.classList.add("is-ready");
    }, 1200);
}

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        navigateToLogin();
    }
});

// Reduced motion fast path
if (prefersReduced) {
    setTimeout(() => {
        if (container) container.classList.add("wordmark-active");
    }, 300);
    setTimeout(navigateToLogin, 2400);
} else {
    initIntroExperience();
}

/**
 * Load Three.js from Reliable CDN with multi-provider fallback
 */
async function loadThree() {
    const cdnUrls = [
        "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
        "https://unpkg.com/three@0.160.0/build/three.module.js",
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js"
    ];

    for (const url of cdnUrls) {
        try {
            const module = await import(url);
            if (module && module.Scene) {
                return module;
            }
        } catch (e) {
            // Try next CDN
        }
    }
    throw new Error("Unable to load Three.js from CDNs");
}

/**
 * WebGL Capability Check
 */
function isWebGLAvailable() {
    try {
        const canvas = document.createElement("canvas");
        return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
    } catch (e) {
        return false;
    }
}

/**
 * Main WebGL Intro Experience
 */
async function initIntroExperience() {
    if (!isWebGLAvailable()) {
        console.warn("[NETFLICK INTRO] WebGL not available. Falling back to wordmark.");
        if (container) container.classList.add("wordmark-active");
        setTimeout(navigateToLogin, 2600);
        return;
    }

    let THREE;
    try {
        THREE = await loadThree();
    } catch (err) {
        console.warn("[NETFLICK INTRO] Three.js load failed. Falling back gracefully:", err);
        if (container) container.classList.add("wordmark-active");
        setTimeout(navigateToLogin, 2600);
        return;
    }

    // -------------------------------------------------------------
    // Device & Performance Profiling
    // -------------------------------------------------------------
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2.0);

    let width = window.innerWidth;
    let height = window.innerHeight;

    // -------------------------------------------------------------
    // Three.js Scene, Camera & Renderer
    // -------------------------------------------------------------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.065);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        powerPreference: "high-performance",
        alpha: false
    });
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = isMobile ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;

    viewport.appendChild(renderer.domElement);

    // Dynamic Camera Distance calculation (ensures N fits perfectly on mobile portrait)
    function getBaseCameraDistance(aspect) {
        if (aspect < 0.6) return 7.8;
        if (aspect < 0.85) return 6.7;
        if (aspect < 1.0) return 6.0;
        return 5.2;
    }

    let baseCamDist = getBaseCameraDistance(width / height);
    camera.position.set(0, 0, baseCamDist);

    // -------------------------------------------------------------
    // Materials: Deep Crimson Ribbon with Glossy Clearcoat & Dark Red Sides
    // -------------------------------------------------------------
    const ribbonFrontMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xd80812), // Authentic Netflix Red
        emissive: new THREE.Color(0x350005),
        emissiveIntensity: 0.22,
        roughness: 0.20,
        metalness: 0.14,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        reflectivity: 0.88,
        sheen: 0.75,
        sheenColor: new THREE.Color(0xff333d),
        sheenRoughness: 0.22
    });

    const ribbonSideMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x480206), // Dark red side shading
        emissive: new THREE.Color(0x180002),
        emissiveIntensity: 0.15,
        roughness: 0.38,
        metalness: 0.10,
        clearcoat: 0.65,
        clearcoatRoughness: 0.20
    });

    const ribbonMaterials = [ribbonFrontMaterial, ribbonSideMaterial];

    // Diagonal Front Material (subtly brighter to emphasize foreground layering)
    const diagFrontMaterial = ribbonFrontMaterial.clone();
    diagFrontMaterial.color = new THREE.Color(0xe50914);
    diagFrontMaterial.emissive = new THREE.Color(0x440006);
    diagFrontMaterial.emissiveIntensity = 0.28;
    const diagMaterials = [diagFrontMaterial, ribbonSideMaterial];

    // -------------------------------------------------------------
    // 3D Ribbon Geometry Construction
    // -------------------------------------------------------------
    const stemWidth = 0.72;
    const stemHeight = 3.8;
    const ribbonDepth = 0.20;
    const bevelSize = 0.032;

    const extrudeSettings = {
        depth: ribbonDepth,
        bevelEnabled: true,
        bevelSegments: isMobile ? 3 : 4,
        steps: 1,
        bevelSize: bevelSize,
        bevelThickness: bevelSize
    };

    // 1. Left Vertical Stem Shape
    const leftShape = new THREE.Shape();
    leftShape.moveTo(-stemWidth / 2, -stemHeight / 2);
    leftShape.lineTo( stemWidth / 2, -stemHeight / 2);
    leftShape.lineTo( stemWidth / 2,  stemHeight / 2);
    leftShape.lineTo(-stemWidth / 2,  stemHeight / 2);
    leftShape.closePath();

    const leftGeometry = new THREE.ExtrudeGeometry(leftShape, extrudeSettings);
    leftGeometry.center();

    // 2. Right Vertical Stem Shape
    const rightGeometry = leftGeometry.clone();

    // 3. Diagonal Connecting Ribbon Shape
    // Connects seamlessly from (-1.32, 1.9) down to (1.32, -1.9)
    const diagShape = new THREE.Shape();
    diagShape.moveTo(-1.32,  1.9);
    diagShape.lineTo(-0.60,  1.9);
    diagShape.lineTo( 1.32, -1.9);
    diagShape.lineTo( 0.60, -1.9);
    diagShape.closePath();

    const diagGeometry = new THREE.ExtrudeGeometry(diagShape, extrudeSettings);
    diagGeometry.center();

    // Hierarchy Groups
    const nMasterGroup = new THREE.Group();
    scene.add(nMasterGroup);

    const leftStemGroup = new THREE.Group();
    const rightStemGroup = new THREE.Group();
    const diagRibbonGroup = new THREE.Group();

    nMasterGroup.add(leftStemGroup);
    nMasterGroup.add(rightStemGroup);
    nMasterGroup.add(diagRibbonGroup);

    // Left Stem Mesh
    const leftMesh = new THREE.Mesh(leftGeometry, ribbonMaterials);
    leftMesh.castShadow = true;
    leftMesh.receiveShadow = true;
    leftStemGroup.add(leftMesh);

    // Right Stem Mesh
    const rightMesh = new THREE.Mesh(rightGeometry, ribbonMaterials);
    rightMesh.castShadow = true;
    rightMesh.receiveShadow = true;
    rightStemGroup.add(rightMesh);

    // Diagonal Ribbon Mesh (Layered slightly in front at z = 0.13 to cast shadow on right stem)
    const diagMesh = new THREE.Mesh(diagGeometry, diagMaterials);
    diagMesh.castShadow = true;
    diagMesh.receiveShadow = true;
    diagRibbonGroup.add(diagMesh);

    // Background Shadow-Receiver Plane (soft dark ambient shadow)
    const shadowPlaneGeom = new THREE.PlaneGeometry(16, 16);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeom, shadowPlaneMat);
    shadowPlane.position.z = -0.35;
    shadowPlane.receiveShadow = true;
    nMasterGroup.add(shadowPlane);

    // Target Rest Transforms
    const targetLeftPos = new THREE.Vector3(-0.96, 0, 0);
    const targetRightPos = new THREE.Vector3(0.96, 0, 0);
    const targetDiagPos = new THREE.Vector3(0, 0, 0.13);

    leftStemGroup.position.copy(targetLeftPos);
    rightStemGroup.position.copy(targetRightPos);
    diagRibbonGroup.position.copy(targetDiagPos);

    // -------------------------------------------------------------
    // Lighting Rig
    // -------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0x180204, 0.6);
    scene.add(ambientLight);

    // Key Directional Light (casts crisp shadow from diagonal onto right stem)
    const keyLight = new THREE.DirectionalLight(0xff333d, 3.6);
    keyLight.position.set(-3.5, 4.8, 5.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = isMobile ? 512 : 1024;
    keyLight.shadow.mapSize.height = isMobile ? 512 : 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 18;
    keyLight.shadow.camera.left = -3.8;
    keyLight.shadow.camera.right = 3.8;
    keyLight.shadow.camera.top = 3.8;
    keyLight.shadow.camera.bottom = -3.8;
    keyLight.shadow.bias = -0.0006;
    scene.add(keyLight);

    // Fill Light (soft deep ruby fill)
    const fillLight = new THREE.DirectionalLight(0x800208, 1.8);
    fillLight.position.set(4.2, -2.5, 3.5);
    scene.add(fillLight);

    // Rim Accent Light (catches beveled edges from behind)
    const rimLight = new THREE.DirectionalLight(0xff7a82, 2.4);
    rimLight.position.set(0.0, 5.0, -3.5);
    scene.add(rimLight);

    // Under-glow Point Light
    const underGlow = new THREE.PointLight(0xff1018, 1.6, 9.0);
    underGlow.position.set(0, -3.2, 1.0);
    scene.add(underGlow);

    // Scene 3 Dramatic Light Sweep PointLight
    const sweepLight = new THREE.PointLight(0xff99a0, 0, 8.5, 2.0);
    sweepLight.position.set(-4.2, 1.2, 1.8);
    scene.add(sweepLight);

    // Scene 1 Spark & Formation Filaments
    const sparkLight = new THREE.PointLight(0xff222b, 0, 5.0);
    sparkLight.position.set(-0.96, -1.9, 0.25);
    scene.add(sparkLight);

    const sparkGeom = new THREE.SphereGeometry(0.06, 12, 12);
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sparkMesh = new THREE.Mesh(sparkGeom, sparkMat);
    sparkMesh.position.copy(sparkLight.position);
    sparkMesh.visible = false;
    scene.add(sparkMesh);

    // -------------------------------------------------------------
    // Scene 4: Cinematic Illuminated Light Environment (Strips)
    // -------------------------------------------------------------
    const lightWorldGroup = new THREE.Group();
    scene.add(lightWorldGroup);
    lightWorldGroup.visible = false;

    // Create authentic illuminated strip gradient texture
    function createLightStripTexture() {
        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");

        // Clear
        ctx.clearRect(0, 0, 64, 512);

        // Vertical Fade + Horizontal Core Gradient
        const grad = ctx.createLinearGradient(0, 0, 64, 0);
        grad.addColorStop(0.0, "rgba(255, 10, 25, 0)");
        grad.addColorStop(0.35, "rgba(229, 9, 20, 0.35)");
        grad.addColorStop(0.48, "rgba(255, 90, 100, 0.95)");
        grad.addColorStop(0.50, "rgba(255, 255, 255, 1.0)");
        grad.addColorStop(0.52, "rgba(255, 90, 100, 0.95)");
        grad.addColorStop(0.65, "rgba(229, 9, 20, 0.35)");
        grad.addColorStop(1.0, "rgba(255, 10, 25, 0)");

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 512);

        // Soft vertical edge fade
        ctx.globalCompositeOperation = "destination-in";
        const vGrad = ctx.createLinearGradient(0, 0, 0, 512);
        vGrad.addColorStop(0.0, "rgba(0,0,0,0)");
        vGrad.addColorStop(0.12, "rgba(0,0,0,1)");
        vGrad.addColorStop(0.88, "rgba(0,0,0,1)");
        vGrad.addColorStop(1.0, "rgba(0,0,0,0)");
        ctx.fillStyle = vGrad;
        ctx.fillRect(0, 0, 64, 512);

        const tex = new THREE.CanvasTexture(canvas);
        tex.needsUpdate = true;
        return tex;
    }

    const lightStripTexture = createLightStripTexture();
    const stripCount = isMobile ? 48 : 84;
    const stripMeshes = [];

    const stripColors = [
        new THREE.Color(0xff1e28),
        new THREE.Color(0xe50914),
        new THREE.Color(0xb20710),
        new THREE.Color(0xff555f),
        new THREE.Color(0x8a0006)
    ];

    for (let i = 0; i < stripCount; i++) {
        const sWidth = 0.05 + Math.random() * 0.18;
        const sHeight = 7.0 + Math.random() * 12.0;
        const sGeom = new THREE.PlaneGeometry(sWidth, sHeight);

        const sColor = stripColors[i % stripColors.length];
        const sMat = new THREE.MeshBasicMaterial({
            color: sColor,
            map: lightStripTexture,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        const sMesh = new THREE.Mesh(sGeom, sMat);

        // Distribute in 3D volume
        const angle = (i / stripCount) * Math.PI * 2;
        const radius = 1.0 + Math.random() * 6.5;
        const xPos = Math.sin(angle) * radius * 1.35;
        const yPos = (Math.random() - 0.5) * 4.0;
        const zPos = 2.0 - Math.random() * 26.0;

        sMesh.position.set(xPos, yPos, zPos);
        lightWorldGroup.add(sMesh);
        stripMeshes.push({ mesh: sMesh, mat: sMat, baseOpacity: 0.45 + Math.random() * 0.55 });
    }

    // -------------------------------------------------------------
    // Easing Helpers
    // -------------------------------------------------------------
    function clamp(val, min = 0, max = 1) {
        return Math.max(min, Math.min(max, val));
    }

    function smoothstep(min, max, val) {
        const x = clamp((val - min) / (max - min));
        return x * x * (3 - 2 * x);
    }

    function easeOutCubic(x) {
        return 1 - Math.pow(1 - clamp(x), 3);
    }

    function easeOutBack(x, c = 1.25) {
        const t = clamp(x) - 1;
        return t * t * ((c + 1) * t + c) + 1;
    }

    // -------------------------------------------------------------
    // Animation Sequencer
    // -------------------------------------------------------------
    let startTime = null;
    const totalDuration = 11.6;

    function renderFrame(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = (timestamp - startTime) / 1000;

        // =========================================================
        // SCENE 1: Darkness & The Igniting Spark (0.0s – 1.5s)
        // =========================================================
        if (elapsed < 1.5) {
            const sparkPhase = smoothstep(0.4, 1.4, elapsed);
            sparkLight.intensity = Math.pow(sparkPhase, 2) * 3.8;
            sparkMesh.visible = sparkPhase > 0.05;
            sparkMesh.scale.setScalar(0.4 + Math.sin(elapsed * 18) * 0.2);

            // Stems hidden in darkness
            leftStemGroup.scale.set(0.001, 0.001, 0.001);
            rightStemGroup.scale.set(0.001, 0.001, 0.001);
            diagRibbonGroup.scale.set(0.001, 0.001, 0.001);

            camera.position.set(0, -0.15, baseCamDist + 0.35 * (1 - sparkPhase));
            camera.lookAt(0, 0, 0);
        }

        // =========================================================
        // SCENE 2: 3D Ribbon Formation (1.5s – 5.0s)
        // =========================================================
        else if (elapsed < 5.0) {
            sparkMesh.visible = false;
            sparkLight.intensity = 0;

            // 1. Left Vertical Stem (1.5s – 3.3s)
            const pLeft = clamp((elapsed - 1.5) / 1.7);
            const eLeft = easeOutCubic(pLeft);

            leftStemGroup.scale.set(1, Math.max(0.001, eLeft), 1);
            leftStemGroup.position.set(
                targetLeftPos.x,
                targetLeftPos.y - (1 - eLeft) * 1.9,
                targetLeftPos.z - (1 - eLeft) * 0.9
            );
            leftStemGroup.rotation.x = (1 - eLeft) * 0.35;
            leftStemGroup.rotation.y = -(1 - eLeft) * 0.18;

            // 2. Diagonal Ribbon (2.2s – 4.4s)
            // Swoops across 3D space from top-left to bottom-right
            if (elapsed > 2.2) {
                const pDiag = clamp((elapsed - 2.2) / 2.15);
                const eDiag = easeOutBack(pDiag, 1.1);

                diagRibbonGroup.scale.set(
                    Math.max(0.001, eDiag),
                    Math.max(0.001, eDiag),
                    Math.max(0.001, eDiag)
                );
                diagRibbonGroup.position.set(
                    targetDiagPos.x - (1 - eDiag) * 1.2,
                    targetDiagPos.y + (1 - eDiag) * 1.6,
                    targetDiagPos.z + (1 - eDiag) * 1.4
                );
                diagRibbonGroup.rotation.y = (1 - eDiag) * 0.55;
                diagRibbonGroup.rotation.z = -(1 - eDiag) * 0.22;
            } else {
                diagRibbonGroup.scale.set(0.001, 0.001, 0.001);
            }

            // 3. Right Vertical Stem (3.0s – 4.8s)
            if (elapsed > 3.0) {
                const pRight = clamp((elapsed - 3.0) / 1.75);
                const eRight = easeOutCubic(pRight);

                rightStemGroup.scale.set(1, Math.max(0.001, eRight), 1);
                rightStemGroup.position.set(
                    targetRightPos.x,
                    targetRightPos.y - (1 - eRight) * 1.9,
                    targetRightPos.z - (1 - eRight) * 0.8
                );
                rightStemGroup.rotation.x = -(1 - eRight) * 0.3;
            } else {
                rightStemGroup.scale.set(0.001, 0.001, 0.001);
            }

            // Connection Snap & Energy Surge (4.8s – 5.0s)
            if (elapsed > 4.75) {
                const pSnap = clamp((elapsed - 4.75) / 0.25);
                const recoil = Math.sin(pSnap * Math.PI) * 0.035;
                nMasterGroup.scale.set(1 + recoil, 1 + recoil, 1 + recoil);
                ribbonFrontMaterial.emissiveIntensity = 0.22 + (1 - pSnap) * 0.5;
            } else {
                nMasterGroup.scale.set(1, 1, 1);
                ribbonFrontMaterial.emissiveIntensity = 0.22;
            }

            // Smooth camera framing
            const camProgress = smoothstep(1.5, 4.8, elapsed);
            camera.position.set(
                -0.3 + camProgress * 0.2,
                -0.1 + camProgress * 0.1,
                baseCamDist + (1 - camProgress) * 0.35
            );
            camera.lookAt(0, 0, 0);
        }

        // =========================================================
        // SCENE 3: Completed 3D N & Glossy Light Sweep (5.0s – 7.0s)
        // =========================================================
        else if (elapsed < 7.0) {
            // Lock all geometry into pristine rest transforms
            leftStemGroup.position.copy(targetLeftPos);
            leftStemGroup.rotation.set(0, 0, 0);
            leftStemGroup.scale.set(1, 1, 1);

            rightStemGroup.position.copy(targetRightPos);
            rightStemGroup.rotation.set(0, 0, 0);
            rightStemGroup.scale.set(1, 1, 1);

            diagRibbonGroup.position.copy(targetDiagPos);
            diagRibbonGroup.rotation.set(0, 0, 0);
            diagRibbonGroup.scale.set(1, 1, 1);
            nMasterGroup.scale.set(1, 1, 1);

            // Camera subtle dolly orbit to reveal bevels, depth & shadow
            const pOrbit = (elapsed - 5.0) / 2.0;
            const camX = -0.25 + smoothstep(0, 1, pOrbit) * 0.65;
            const camY = 0.05 + Math.sin(pOrbit * Math.PI) * 0.12;
            const camZ = baseCamDist - smoothstep(0, 1, pOrbit) * 0.6;
            camera.position.set(camX, camY, camZ);
            camera.lookAt(0, 0, 0);

            // Dramatic Glossy Light Sweep (5.2s – 6.8s)
            if (elapsed > 5.2 && elapsed < 6.8) {
                const pSweep = (elapsed - 5.2) / 1.6;
                const sweepX = -4.0 + pSweep * 8.0;
                sweepLight.position.set(sweepX, 0.4 - pSweep * 0.8, 1.8);
                sweepLight.intensity = Math.sin(pSweep * Math.PI) * 4.6;
            } else {
                sweepLight.intensity = 0;
            }
        }

        // =========================================================
        // SCENE 4: Cinematic Light Environment (7.0s – 9.5s)
        // =========================================================
        else if (elapsed < 9.5) {
            sweepLight.intensity = 0;
            lightWorldGroup.visible = true;

            const pTunnel = (elapsed - 7.0) / 2.5;

            // Camera accelerates directly into and through the N structure
            const tunnelZ = (baseCamDist - 0.6) - Math.pow(pTunnel, 2.2) * (baseCamDist + 15.0);
            camera.position.set(
                Math.sin(pTunnel * Math.PI * 1.5) * 0.35,
                Math.cos(pTunnel * Math.PI) * 0.15,
                tunnelZ
            );
            camera.lookAt(0, 0, tunnelZ - 5.0);

            // N logo opens/dissolves outward as camera penetrates
            const pNExit = clamp((elapsed - 7.0) / 0.85);
            const nScale = 1.0 + Math.pow(pNExit, 2.5) * 3.5;
            nMasterGroup.scale.set(nScale, nScale, 1.0);

            const nAlpha = 1.0 - smoothstep(0.2, 0.85, pNExit);
            ribbonFrontMaterial.opacity = nAlpha;
            ribbonFrontMaterial.transparent = nAlpha < 0.99;
            ribbonSideMaterial.opacity = nAlpha;
            ribbonSideMaterial.transparent = nAlpha < 0.99;

            // Vertical illuminated light ribbons fade in & rush past
            const pStripsIn = smoothstep(0.0, 0.3, pTunnel);
            const pStripsOut = 1.0 - smoothstep(0.78, 0.98, pTunnel);
            const globalStripOpacity = pStripsIn * pStripsOut;

            for (let i = 0; i < stripMeshes.length; i++) {
                const s = stripMeshes[i];
                s.mat.opacity = s.baseOpacity * globalStripOpacity;
                // Subtle upward/downward streaming flow
                s.mesh.position.y += Math.sin(elapsed * 2.0 + i) * 0.008;
            }
        }

        // =========================================================
        // SCENE 5: Darkness & NETFLICK Wordmark Resolve (9.5s – 11.6s)
        // =========================================================
        else {
            lightWorldGroup.visible = false;
            nMasterGroup.visible = false;
            renderer.clear();

            if (container && !container.classList.contains("wordmark-active")) {
                container.classList.add("wordmark-active");
            }
        }

        // Render WebGL frame
        if (elapsed < 9.5) {
            renderer.render(scene, camera);
        }

        // Complete Sequence Navigation trigger
        if (elapsed < totalDuration && !hasNavigated) {
            animationFrameId = requestAnimationFrame(renderFrame);
        } else if (!hasNavigated) {
            navigateToLogin();
        }
    }

    // Start animation loop
    animationFrameId = requestAnimationFrame(renderFrame);

    // Window Resize Handler
    function onResize() {
        width = window.innerWidth;
        height = window.innerHeight;

        baseCamDist = getBaseCameraDistance(width / height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2.0));
    }

    window.addEventListener("resize", onResize, { passive: true });

    // Cleanup & Memory Management Handler
    cleanupHandler = () => {
        window.removeEventListener("resize", onResize);

        // Cancel render loop
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }

        // Dispose geometries
        leftGeometry.dispose();
        rightGeometry.dispose();
        diagGeometry.dispose();
        shadowPlaneGeom.dispose();
        sparkGeom.dispose();

        // Dispose materials
        ribbonFrontMaterial.dispose();
        ribbonSideMaterial.dispose();
        diagFrontMaterial.dispose();
        shadowPlaneMat.dispose();
        sparkMat.dispose();

        // Dispose light strips
        lightStripTexture.dispose();
        for (const s of stripMeshes) {
            s.mesh.geometry.dispose();
            s.mat.dispose();
        }

        // Dispose renderer
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
    };
}
