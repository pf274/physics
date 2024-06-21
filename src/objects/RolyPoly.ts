import Matter, { Body, Composite, Events } from "matter-js";
import { Physics } from "../Physics";
import { BodyClass } from "./BodyClass";

export class RolyPoly extends BodyClass {
	public body: Matter.Body;
	public interval: number | null = null;
	public startTime: number = Date.now();
	public detector: Matter.Detector | undefined = undefined;
	constructor(x: number, y: number, radius: number) {
		super();
		this.body = Matter.Bodies.circle(x, y, radius, {
			friction: 1,
			restitution: 1,
			render: {
				sprite: {
					texture: "src/assets/RolyPoly.svg",
					xScale: (radius * 2) / 400,
					yScale: (radius * 2) / 400,
				},
			},
		});
		this.update();
	}

	update() {
		if (this.interval) {
			clearInterval(this.interval);
		}
		this.interval = setInterval(() => {
			const elapsedTime = Date.now() - this.startTime;
			const value = Math.sin(elapsedTime / 2000) / 500;
			Body.setAngularVelocity(this.body, Body.getAngularVelocity(this.body) + value);
		}, 10);
	}
}
