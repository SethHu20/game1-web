import { DoubleSide, Mesh, MeshBasicMaterial, OrthographicCamera, PlaneGeometry, Scene, Vector2, Vector3, WebGLRenderer } from "three";

console.info('render.js loaded');
const DEBUG = true;
const TICK_RATE = 20;



const minimumCameraViewingBox = { height: 10 / 2, width: 10 / 2 };

const mainCanvas = document.getElementById('main_viewport');
const renderer = new WebGLRenderer({ antialias: true, canvas: mainCanvas });



// scenes
const gameplayScene = new Scene();


// camera
const camera = new OrthographicCamera(10, -10, 10, -10);
camera.position.set(0, 0, 5)
gameplayScene.add(camera);
// gameplayScene.add(new CameraHelper(camera));


// player
const playerGeometry = new PlaneGeometry(1, 1);
const playerMaterial = new MeshBasicMaterial({ color: 0xa0c0a0, side: DoubleSide });
const player = new Mesh(playerGeometry, playerMaterial);
gameplayScene.add(player);

// player based logic
const mode2DBoardSize = {
    min: new Vector2(0, 0, 0),
    max: new Vector2(9, 9, 0)
}





// Global keyboard listener and playback list
let kbEvents = [];
let nextTick = [];
document.addEventListener('keydown', ({ key, code, timeStamp, repeat }) => {
    if (repeat) return;
    kbEvents.push({ key, code, timeStamp });
    nextTick.push(key);
    if (DEBUG) {
        // console.log(kbEvents);
        document.getElementById('keyboardLog').innerText =
            kbEvents
                .slice(-10)
                .map(({ key, code, timeStamp }) => `${timeStamp.toFixed(0)} ${code} ${key}`)
                .join('\n');
    }
})

// Consume next tick keybaord events
const readTickKeyboardInputs = (keyboardInput) => {
    let movement = new Vector3(0, 0, 0);
    for (let key of keyboardInput) {
        // console.log('key :>> ', key);
        switch (key) {
            case 'w':
            case 'ArrowUp':
                movement.y = Math.min(1, movement.y + 1);
                break;
            case 's':
            case 'ArrowDown':
                movement.y = Math.max(-1, movement.y - 1);
                break;
            case 'd':
            case 'ArrowRight':
                movement.x = Math.max(-1, movement.x - 1);
                break;
            case 'a':
            case 'ArrowLeft':
                movement.x = Math.min(1, movement.x + 1);
                break;
        }
    }
    return movement;
}

// tick schedule
const doTick = () => {
    const startTime = Date.now();
    const movement = readTickKeyboardInputs(nextTick);
    nextTick = [];

    // console.log(movement, player.position);
    player.position.add(movement)


    if (DEBUG) {
        document.getElementById('playerPos').innerText =
            `Player pos (local) \n ${player.position.x} ${player.position.y} ${player.position.z}`

        // tick tracking
        if (tickMemory.length > TICK_RATE) tickMemory.shift(); // Pop first element, Yes it's O(n) I'm sorry
        // console.log('tickMemory :>> ', tickMemory);
        const last = tickMemory[tickMemory.length - 1] ?? {start: 0, end: 0};
        const first = tickMemory[0] ?? {start: 0};
        document.getElementById('tickInfo').innerText =
            `tick ${tick} 
            mspt ${last.end - last.start} ms
            tps ${((tickMemory.length - 1) / (last.start - first.start) * 1000).toFixed(2) }`
    }
    tick += 1;

    if (DEBUG) tickMemory.push({start: startTime, end: Date.now()});
}

// start tick on TICK_RATE
let tick = 0;
let tickMemory = [];
setInterval(doTick, 1000 / TICK_RATE);












// renderer settings
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearAlpha(0);
// renderer.setClearColor(0x7ec0ee, 1);

// render loop
const onAnimationFrameHandler = (timestamp) => {
    // console.log(timestamp);
    renderer.render(gameplayScene, camera);
    window.requestAnimationFrame(onAnimationFrameHandler);
}

// resize handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    const aspectRatio = innerWidth / innerHeight;
    if (aspectRatio > 1) {
        // landscape 
        camera.top = minimumCameraViewingBox.height;
        camera.bottom = -minimumCameraViewingBox.height;
        camera.left = minimumCameraViewingBox.width * aspectRatio;
        camera.right = -minimumCameraViewingBox.width * aspectRatio;
    } else if (aspectRatio == 1) {
        // square
        camera.top = minimumCameraViewingBox.height;
        camera.bottom = -minimumCameraViewingBox.height;
        camera.left = minimumCameraViewingBox.width;
        camera.right = -minimumCameraViewingBox.width;
    } else if (aspectRatio < 1) {
        // portrait
        camera.top = minimumCameraViewingBox.height / aspectRatio;
        camera.bottom = -minimumCameraViewingBox.height / aspectRatio;
        camera.left = minimumCameraViewingBox.width;
        camera.right = -minimumCameraViewingBox.width;
    }
    camera.updateProjectionMatrix();
    console.log('Resize:', aspectRatio, camera.top, camera.bottom, camera.left, camera.right);
}
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler);


// start render cycle
window.requestAnimationFrame(onAnimationFrameHandler);
