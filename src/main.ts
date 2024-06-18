import { BaseItem } from "./items/BaseItem";
import { Cube } from "./items/Cube";
import { WorldSettings } from "./world/WorldSettings";
import "./style.css";
import { ImmovableBox } from "./items/ImmovableBox";

const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;

let items: BaseItem[] = [];

window.addEventListener('mousedown', handleClick);

const buttons = {
  left: 0,
  middle: 1,
  right: 2,
  back: 3,
  forward: 4
};

function handleClick(event: MouseEvent) {
  if (event.button === buttons.left) {
    // drag item
  } else if (event.button === buttons.right) {
    createItem(event);
  }
}
window.addEventListener('contextmenu', handleContextMenu);

function handleContextMenu(event: MouseEvent) {
  event.preventDefault(); // Prevent the default right-click behavior
}


function createItem(event: MouseEvent) {
  const x = event.clientX;
  const y = event.clientY;
  const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
  const xVel = Math.random() * 2 - 1;
  const yVel = Math.random() * 2 - 1;
  const item = new Cube({initialX: x, initialY: y, color, initialXVel: xVel, initialYVel: yVel});
  items.push(item);
}

function resizeCanvas() {
  const displayWidth  = window.innerWidth;
  const displayHeight = window.innerHeight;

  // Check if the canvas is not the same size.
  if (canvas.width != displayWidth ||
      canvas.height != displayHeight) {

    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
}

window.onload = resizeCanvas;
window.onresize = resizeCanvas;

let start: number, previousTimeStamp: number;
let totalTime = 0;
let frame = 0;
let worldSettings: WorldSettings = {
  gravity: 0.001,
  gravityType: 'down',
  scale: 0.25
};

const step: FrameRequestCallback = (timestamp: number) => {
  frame++;
  if (!start) start = timestamp;
  if (!previousTimeStamp) previousTimeStamp = timestamp;
  totalTime = timestamp - start;
  const frameTime = timestamp - previousTimeStamp;
  handleCalculations(frameTime);
  previousTimeStamp = timestamp;
  requestAnimationFrame(step);
}


function resetCanvas(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function fadeCanvas(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function handleCalculations(frameTime: number) {
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
  resetCanvas(ctx);
  // fadeCanvas(ctx);
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.offScreen) {
      items.splice(i, 1);
      i--;
      console.log('deleted');
      continue;
    }
    item.update(frameTime, worldSettings);
    item.draw(ctx);
  }
}






requestAnimationFrame(step);