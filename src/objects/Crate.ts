import Matter from "matter-js";
import { BodyClass } from "./BodyClass";

export class Crate extends BodyClass {
	public body: Matter.Body;
	public type: string = "crate";
	public static initialWidth: number = 80;
	public static initialHeight: number = 80;
	public sounds: string[] = new Array(3).fill(0).map((_, i) => `sounds/crate/crate_${i + 1}.mp3`);
	constructor(x: number, y: number, xScale: number, yScale: number) {
		super();
		const width = xScale * Crate.initialWidth;
		const height = yScale * Crate.initialHeight;
		this.body = Matter.Bodies.rectangle(x, y, width, height, {
			friction: 1,
			restitution: 0.1,
			label: "crate",
			render: {
				sprite: {
					texture: "sprites/Crate.svg",
					xScale: width / 150,
					yScale: height / 150,
				},
			},
		});
	}
}
