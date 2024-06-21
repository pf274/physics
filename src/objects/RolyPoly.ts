import Matter, { Body, Composite } from "matter-js";
import { Physics } from "../Physics";

export class RolyPoly {
	public body: Matter.Body;
	public interval: number | null = null;
	public startTime: number = Date.now();
	constructor(x: number, y: number, radius: number) {
		this.body = Matter.Bodies.circle(x, y, radius, {
			friction: 1,
			restitution: 0,
			render: {
				sprite: {
					texture: "src/assets/RolyPoly.svg",
					xScale: (radius * 2) / 400,
					yScale: (radius * 2) / 400,
				},
			},
		});
		Composite.add(Physics.engine.world, this.body);
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
