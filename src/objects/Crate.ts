import Matter from "matter-js";
import { BodyClass } from "./BodyClass";

export class Crate extends BodyClass {
	public body: Matter.Body;
	public type: string = "crate";
	public sounds: string[] = new Array(4).fill(0).map((_, i) => `src/assets/sounds/crate/crate_${i + 1}.mp3`);
	constructor(x: number, y: number, width: number, height: number) {
		super();
		this.body = Matter.Bodies.rectangle(x, y, width, height, {
			friction: 1,
			restitution: 0.1,
			label: "crate",
			render: {
				sprite: {
					texture: "src/assets/sprites/Crate.svg",
					xScale: width / 150,
					yScale: height / 150,
				},
			},
		});
	}
}
