import Matter, { Bodies, Collision, Composite } from "matter-js";
import { Physics } from "../Physics";
import { RolyPoly } from "../objects/RolyPoly";

const mouseButtons = {
	left: 0,
	middle: 1,
	right: 2,
};

export class Mouse {
	private static mouseBody: Matter.Body | undefined = undefined;
	private static isEventListenerAdded: boolean = false;
	private static constraint: Matter.Constraint | undefined = undefined;

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

	private static startMouseBodyCreateEventListener() {
		window.addEventListener("mousedown", (event) => {
			if (event.button == mouseButtons.right) {
				Physics.addBodies([{ type: "rolyPoly", bodyInstance: new RolyPoly(event.clientX, event.clientY, 40) }]);
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
		if (!this.isEventListenerAdded) {
			this.startMouseBodyCreateEventListener();
			this.startDragEventListener();
			this.startMouseBodyRemoveEventListener();
			this.isEventListenerAdded = true;
		}
	}

	private static touchingBody(x: number, y: number) {
		return Physics.engine.world.bodies.find((body) => {
			return Collision.collides(body, Bodies.rectangle(x, y, 1, 1))?.collided;
		});
	}
}
