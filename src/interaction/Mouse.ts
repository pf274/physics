import Matter, { Bodies, Collision, Composite } from "matter-js";
import { Physics } from "../Physics";
import { TennisBall } from "../objects/TennisBall";
import { Basketball } from "../objects/Basketball";
import { Crate } from "../objects/Crate";
import { BodyClass } from "../objects/BodyClass";
import { SuperBouncy } from "../objects/SuperBouncy";

const mouseButtons = {
	left: 0,
	middle: 1,
	right: 2,
};

const objectClasses: { [key: string]: new (...args: any[]) => BodyClass } = {
	Basketball,
	TennisBall,
	Crate,
	SuperBouncy,
};

export class Mouse {
	private static mouseBody: Matter.Body | undefined = undefined;
	private static eventListenersAdded: boolean = false;
	private static constraint: Matter.Constraint | undefined = undefined;
	public static SelectedObject: (typeof objectClasses)[keyof typeof objectClasses] = objectClasses.Crate;
	public static xScale: number = 1;
	public static yScale: number = 1;
	public static x: number = 0;
	public static y: number = 0;
	private static keyStates: { [key: string]: boolean } = {};

	private static dragBody(event: MouseEvent) {
		const body = this.touchingBody(event.clientX, event.clientY);
		if (body) {
			this.createMouseBody(event.clientX, event.clientY);
			if (this.constraint) {
				Composite.remove(Physics.engine.world, this.constraint);
			}
			const bodyX = body.position.x;
			const bodyY = body.position.y;
			const offsetX = event.clientX - bodyX;
			const offsetY = event.clientY - bodyY;
			this.constraint = Matter.Constraint.create({
				bodyA: this.mouseBody,
				bodyB: body,
				pointB: { x: offsetX, y: offsetY },
				stiffness: 0,
				render: {
					visible: false,
				},
			});

			Composite.add(Physics.engine.world, this.constraint);

			console.log("Clicked on body");
		} else {
			console.log("Clicked on empty space");
		}
	}

	private static createMouseBody(x: number, y: number) {
		if (this.mouseBody) {
			Composite.remove(Physics.engine.world, this.mouseBody);
		}
		this.mouseBody = Bodies.circle(x, y, 10, {
			isStatic: true,
			collisionFilter: {
				group: -1,
				mask: 0x0002,
			},
			render: {
				// fillStyle: "red",
				visible: false,
			},
		});
		Composite.add(Physics.engine.world, this.mouseBody);
	}

	private static startDragEventListener() {
		window.addEventListener("mousemove", (event) => {
			if (this.mouseBody) {
				Matter.Body.setPosition(this.mouseBody, { x: event.clientX, y: event.clientY });
			}
		});
	}

	private static startScaleEventListener() {
		window.addEventListener("keydown", (event) => {
			// Mark the key as pressed
			this.keyStates[event.key] = true;
		});

		window.addEventListener("keyup", (event) => {
			// Mark the key as not pressed
			this.keyStates[event.key] = false;
		});
	}

	public static updateScale() {
		const xScaleChange = this.keyStates.a ? -0.1 : this.keyStates.d ? 0.1 : 0;
		const yScaleChange = this.keyStates.s ? -0.1 : this.keyStates.w ? 0.1 : 0;
		this.xScale = Math.max(0.1, this.xScale + xScaleChange);
		this.yScale = Math.max(0.1, this.yScale + yScaleChange);
	}

	private static startMouseBodyCreateEventListener() {
		window.addEventListener("mousedown", (event) => {
			if (event.button == mouseButtons.right) {
				const newBodyInstance = new this.SelectedObject(event.clientX, event.clientY, this.xScale, this.yScale);
				Physics.addBodies([{ bodyInstance: newBodyInstance }]);
			} else {
				this.dragBody(event);
			}
		});
	}

	private static startMouseBodyRemoveEventListener() {
		window.addEventListener("mouseup", () => {
			if (this.mouseBody) {
				Composite.remove(Physics.engine.world, this.mouseBody);
				this.mouseBody = undefined;
			}
			if (this.constraint) {
				Composite.remove(Physics.engine.world, this.constraint);
				this.constraint = undefined;
			}
		});
	}

	public static initialize() {
		if (!this.eventListenersAdded) {
			this.startMouseBodyCreateEventListener();
			this.startDragEventListener();
			this.startScaleEventListener();
			this.startMouseBodyRemoveEventListener();
			this.eventListenersAdded = true;
		}
	}

	private static touchingBody(x: number, y: number) {
		return Physics.engine.world.bodies.find((body) => {
			return Collision.collides(body, Bodies.rectangle(x, y, 1, 1))?.collided;
		});
	}

	public static selectObject(object: string) {
		let objectClass = objectClasses[object];
		if (!objectClass) {
			const objectNames = Object.keys(objectClasses);
			const name = objectNames.find((name) => name.toLowerCase().includes(object.toLowerCase()));
			if (name) {
				objectClass = objectClasses[name];
			} else {
				console.log(`Object with name '${object}' not found`);
				return;
			}
		}
		this.SelectedObject = objectClass;
		this.xScale = 1;
		this.yScale = 1;
	}
}

document.addEventListener("mousemove", (event) => {
	Mouse.x = event.clientX;
	Mouse.y = event.clientY;
});

const mousePreview = document.getElementById("mousePreview") as HTMLDivElement;

function preview() {
	const width = Mouse.xScale * (Mouse.SelectedObject as any).initialWidth;
	const height = Mouse.yScale * (Mouse.SelectedObject as any).initialHeight;
	mousePreview.style.width = `${width}px`;
	mousePreview.style.height = `${height}px`;
	mousePreview.style.left = `${Mouse.x - width / 2}px`;
	mousePreview.style.top = `${Mouse.y - height / 2}px`;
	Mouse.updateScale();
	window.requestAnimationFrame(preview);
}

window.requestAnimationFrame(preview);
