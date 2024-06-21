import Matter, { Body } from "matter-js";
import { BodyClass } from "./BodyClass";

export class Basketball extends BodyClass {
	public body: Matter.Body;
	public type: string = "basketball";
	public sounds: string[] = new Array(7).fill(0).map((_, i) => `src/assets/sounds/basketball/basketball_${i + 1}.mp3`);
	constructor(x: number, y: number, radius: number) {
		super();
		this.body = Matter.Bodies.circle(x, y, radius, {
			friction: 1,
			restitution: 0.9,
			label: "basketball",
			frictionAir: 0,
			render: {
				sprite: {
					texture: "src/assets/sprites/Basketball.svg",
					xScale: (radius * 2) / 400,
					yScale: (radius * 2) / 400,
				},
			},
		});
	}
}
