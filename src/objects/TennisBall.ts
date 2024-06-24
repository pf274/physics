import Matter from "matter-js";
import { BodyClass } from "./BodyClass";

export class TennisBall extends BodyClass {
	public body: Matter.Body;
	public type: string = "tennisBall";
	public static initialWidth: number = 20;
	public static initialHeight: number = 20;
	public sounds: string[] = new Array(3).fill(0).map((_, i) => `sounds/tennisBall/tennisBall_${i + 1}.mp3`);
	constructor(x: number, y: number, xScale: number, yScale: number) {
		super();
		const scale = Math.min(xScale, yScale);
		const radius = (scale * TennisBall.initialWidth) / 2;
		this.body = Matter.Bodies.circle(x, y, radius, {
			friction: 0.5,
			restitution: 0.6,
			label: "tennisBall",
			frictionAir: 0,
			render: {
				sprite: {
					texture: "sprites/TennisBall.png",
					xScale: (radius * 2) / 2200,
					yScale: (radius * 2) / 2200,
				},
			},
		});
	}
}
