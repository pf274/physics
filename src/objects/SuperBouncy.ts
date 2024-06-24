import Matter, { Body } from "matter-js";
import { BodyClass } from "./BodyClass";

export class SuperBouncy extends BodyClass {
	public body: Matter.Body;
	public type: string = "superBouncy";
	public static initialWidth: number = 20;
	public static initialHeight: number = 20;
	public sounds: string[] = new Array(3).fill(0).map((_, i) => `sounds/superBouncy/superBouncy_${i + 1}.mp3`);
	public volume = 0.25;
	constructor(x: number, y: number, xScale: number, yScale: number) {
		super();
		const scale = Math.min(xScale, yScale);
		const radius = (scale * SuperBouncy.initialWidth) / 2;
		this.body = Matter.Bodies.circle(x, y, radius, {
			friction: 0,
			restitution: 1.1,
			label: "superBouncy",
			inertia: Infinity,
			inverseInertia: 0,
			frictionAir: 0,
			render: {
				sprite: {
					texture: "sprites/SuperBouncy.svg",
					xScale: radius / 70,
					yScale: radius / 70,
				},
			},
		});
		window.requestAnimationFrame(this.update.bind(this));
	}

	private update() {
		const maxSpeed = 30;
		const xVel = Math.max(-1 * maxSpeed, Math.min(maxSpeed, this.body.velocity.x));
		const yVel = Math.max(-1 * maxSpeed, Math.min(maxSpeed, this.body.velocity.y));
		this.body.velocity.y;
		Body.setVelocity(this.body, { x: xVel, y: yVel });
		window.requestAnimationFrame(this.update.bind(this));
	}
}
