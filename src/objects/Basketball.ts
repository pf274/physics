import Matter from "matter-js";
import { BodyClass } from "./BodyClass";

export class Basketball extends BodyClass {
	public body: Matter.Body;
	public type: string = "basketball";
	public static initialWidth: number = 60;
	public static initialHeight: number = 60;
	public sounds: string[] = new Array(7).fill(0).map((_, i) => `sounds/basketball/basketball_${i + 1}.mp3`);
	constructor(x: number, y: number, xScale: number, yScale: number) {
		super();
		const scale = Math.min(xScale, yScale);
		const radius = (scale * Basketball.initialWidth) / 2;
		this.body = Matter.Bodies.circle(x, y, radius, {
			friction: 0.5,
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
