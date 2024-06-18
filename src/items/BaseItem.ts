import { ShapeSquare } from "../shapes/Square";
import { WorldSettings } from "../world/WorldSettings";

export type CreationSettings = {
  initialX: number;
  initialY: number;
  initialXVel?: number;
  initialYVel?: number;
  path?: Path2D;
  color?: string;
  rotation?: number;
  rotationVel?: number;
  density?: number;
}

export class BaseItem {
  public x: number;
  public y: number;
  public xVel: number;
  public yVel: number;
  public path: Path2D;
  public color: string;
  public rotation: number;
  public rotationVel: number;
  public density: number;
  public offScreen: boolean = false;

  constructor(params: CreationSettings) {
    this.x = params.initialX;
    this.y = params.initialY;
    this.xVel = params.initialXVel || 0;
    this.yVel = params.initialYVel || 0;
    this.path = params.path || ShapeSquare(20);
    this.color = params.color || 'white';
    this.rotation = params.rotation || 0;
    this.rotationVel = params.rotationVel || 0;
    this.density = params.density || 1;
  }

  public update(frameTime: number, worldSettings: WorldSettings) {
    const scale = worldSettings.scale;
    if (worldSettings.gravityType === 'down') {
      this.yVel += worldSettings.gravity * frameTime;
    } else if (worldSettings.gravityType === 'up') {
      this.yVel -= worldSettings.gravity * frameTime;
    } else if (worldSettings.gravityType === 'left') {
      this.xVel -= worldSettings.gravity * frameTime;
    } else if (worldSettings.gravityType === 'right') {
      this.xVel += worldSettings.gravity * frameTime;
    } else if (worldSettings.gravityType === 'central') {
      const angle = Math.atan2(this.y, this.x);
      const distance = Math.sqrt(this.x * this.x + this.y * this.y);
      const force = worldSettings.gravity / distance;
      this.xVel += Math.cos(angle) * force * frameTime;
      this.yVel += Math.sin(angle) * force * frameTime;
    }
    this.x += this.xVel * frameTime * scale;
    this.y += this.yVel * frameTime * scale;
    this.rotation += this.rotationVel * frameTime * scale;
    this.updateOffScreen();
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.fill(this.path);
    ctx.restore();
  }

  private updateOffScreen() {
    if (this.x < 0 || this.x > window.innerWidth || this.y < 0 || this.y > window.innerHeight) {
      this.offScreen = true;
    } else {
      this.offScreen = false;
    }
  }

  public checkCollision(item: BaseItem) {
    
  }
}