import { Bodies, Composite } from "matter-js";
import { Physics } from "./Physics";
import { Mouse } from "./interaction/Mouse";

document.body.style.margin = "0";
document.body.style.overflow = "hidden";

Physics.initialize();

const boxA = Bodies.rectangle(400, 200, 80, 80);
const boxB = Bodies.rectangle(450, 50, 80, 80);
const pentagon = Bodies.polygon(400, 400, 5, 80);

// Physics.addBodies([
// 	{
// 		type: "box",
// 		bodyInstance: boxA,
// 	},
// 	{
// 		type: "box",
// 		bodyInstance: boxB,
// 	},
// ]);

Composite.add(Physics.engine.world, [boxA, boxB, pentagon]);

Mouse.initialize();

// Physics.setGravity(0, 1);
