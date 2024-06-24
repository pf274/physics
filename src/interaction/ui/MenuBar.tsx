import { Button, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { Mouse } from "../Mouse";

export function MenuBar() {
	const [open, setOpen] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	function handleSelectItem(newItem: string) {
		Mouse.selectObject(newItem);
		setOpen(false);
		setAnchorEl(null);
	}
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				width: "100%",
				justifyContent: "space-around",
				margin: "1em",
			}}
		>
			<Button
				variant="contained"
				onClick={(event) => {
					if (!open) {
						setAnchorEl(event.currentTarget);
					}
					setOpen(!open);
				}}
			>
				Select an Object
			</Button>
			<Menu open={open} onClose={() => setOpen(false)} anchorEl={anchorEl}>
				<MenuItem onClick={() => handleSelectItem("Basketball")}>Basketball</MenuItem>
				<MenuItem onClick={() => handleSelectItem("Crate")}>Crate</MenuItem>
				<MenuItem onClick={() => handleSelectItem("Tennisball")}>Tennis Ball</MenuItem>
			</Menu>
		</div>
	);
}
