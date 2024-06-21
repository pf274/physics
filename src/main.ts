import { Bodies, Composite } from "matter-js";
import { Physics } from "./Physics";
import { Mouse } from "./interaction/Mouse";
import { Crate } from "./objects/Crate";

document.body.style.margin = "0";
document.body.style.overflow = "hidden";

Physics.initialize();

const crateA = new Crate(400, 200, 80, 80);
const crateB = new Crate(450, 50, 80, 80);

Physics.addBodies([
	{
		bodyInstance: crateA,
	},
	{
		bodyInstance: crateB,
	},
]);

Mouse.initialize();

// Physics.setGravity(0, 1);
