import Matter from "matter-js";
import { BodyClass } from "./BodyClass";

export class Crate extends BodyClass {
	public body: Matter.Body;
	public type: string = "crate";
	public sounds: string[] = new Array(3).fill(0).map((_, i) => `physics/sounds/crate/crate_${i + 1}.mp3`);
	constructor(x: number, y: number, xScale: number, yScale: number) {
		super();
		const width = xScale * 80;
		const height = yScale * 80;
		this.body = Matter.Bodies.rectangle(x, y, width, height, {
			friction: 1,
			restitution: 0.1,
			label: "crate",
			render: {
				sprite: {
					texture: "physics/sprites/Crate.svg",
					xScale: width / 150,
					yScale: height / 150,
				},
			},
		});
	}
}
