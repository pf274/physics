import React, { useEffect } from "react";
import { Physics } from "./src/Physics";
import { Mouse } from "./src/interaction/Mouse";
import { Crate } from "./src/objects/Crate";
import { MenuBar } from "./src/interaction/ui/MenuBar";

document.body.style.margin = "0";
document.body.style.overflow = "hidden";

const mouseButtons = {
	left: 0,
	middle: 1,
	right: 2,
};

function preventDefault(event: MouseEvent) {
	event.preventDefault();
}

function App() {
	useEffect(() => {
		Physics.initialize();
		Mouse.initialize();
		document.addEventListener("contextmenu", preventDefault);
		return () => {
			document.removeEventListener("contextmenu", preventDefault);
		};
	}, []);
	return (
		<div style={{ width: "100%", height: "100%" }}>
			<MenuBar />
		</div>
	);
}

export default App;
