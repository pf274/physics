import Matter from "matter-js";
import { BodyClass } from "./BodyClass";

export class Basketball extends BodyClass {
	public body: Matter.Body;
	public type: string = "basketball";
	public sounds: string[] = new Array(7).fill(0).map((_, i) => `sounds/basketball/basketball_${i + 1}.mp3`);
	constructor(x: number, y: number, scale: number) {
		super();
		const radius = scale * 30;
		this.body = Matter.Bodies.circle(x, y, radius, {
			restitution: 0.995,
			label: "basketball",
			frictionAir: 0,
			render: {
				sprite: {
					texture: "sprites/Basketball.svg",
					xScale: (radius * 2) / 400,
					yScale: (radius * 2) / 400,
				},
			},
		});
	}
}
