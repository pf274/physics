import Matter, { Bodies, Body, Composite, Engine, Events, Render, Runner } from "matter-js";

function resizeWorld() {
	Physics.render.canvas.width = window.innerWidth;
	Physics.render.canvas.height = window.innerHeight;
	Matter.Body.setPosition(Physics.rightBound, { x: window.innerWidth - 5, y: window.innerHeight / 2 });
	Physics.bottomBound.position.y = window.innerHeight - 5;
}

export class Physics {
	private static _engine: Matter.Engine | null = null;
	private static _render: Matter.Render | null = null;
	private static _element: HTMLElement | null = null;
	private static _runner: Matter.Runner | null = null;
	private static _width: number = window.innerWidth;
	private static _height: number = window.innerHeight;
	private static _wireframes: boolean = false;
	private static isEventListenerAdded = false;
	private static _isRendering = false;
	private static _isRunning = false;
	public static leftBound = Bodies.rectangle(5, this._height / 2, 10, this._height, { isStatic: true, render: { visible: false } });
	public static rightBound = Bodies.rectangle(this._width - 5, this._height / 2, 10, this._height, { isStatic: true, render: { visible: false } });
	public static bottomBound = Bodies.rectangle(this._width / 2, this._height - 5, this._width, 10, { isStatic: true, render: { visible: false } });
	public static topBound = Bodies.rectangle(this._width / 2, 5, this._width, 10, { isStatic: true, render: { visible: false } });

	public static initialize() {
		document.body.style.margin = "0";
		document.body.style.overflow = "hidden";
		this._element = document.body;
		if (!this._engine) {
			this._engine = Engine.create();
			Events.on(this._engine, "beforeUpdate", this.loopBodies.bind(this));
			Composite.add(this._engine.world, [this.bottomBound, this.leftBound, this.rightBound, this.topBound]);
		}
		if (!this._render) {
			this._render = Render.create({
				element: this._element,
				engine: this._engine,
				options: {
					width: this._width,
					height: this._height,
					wireframes: this._wireframes,
				},
			});
		}
		if (!this.isEventListenerAdded) {
			window.addEventListener("resize", resizeWorld);
			this.isEventListenerAdded = true;
		}
		if (!this._runner) {
			this._runner = Runner.create();
		}
		if (!this._isRendering) {
			this.startRendering();
		}
		if (!this._isRunning) {
			this.startRunning();
		}
	}

	private static loopBodies() {
		const bodies = Matter.Composite.allBodies(this._engine!.world);
		for (const body of bodies) {
			// Adjust these values based on your world's bounds
			const minX = 0;
			const maxX = this._width;
			const minY = 0;
			const maxY = this._height;

			// Check and update position for looping
			if (body.position.x > maxX) {
				Body.setPosition(body, { x: minX, y: body.position.y });
			} else if (body.position.x < minX) {
				Body.setPosition(body, { x: maxX, y: body.position.y });
			}

			if (body.position.y > maxY) {
				Body.setPosition(body, { x: body.position.x, y: minY });
			} else if (body.position.y < minY) {
				Body.setPosition(body, { x: body.position.x, y: maxY });
			}
		}
	}

	public static startRendering() {
		if (this._render && !this._isRendering) {
			Render.run(this._render);
			this._isRendering = true;
		}
	}

	public static stopRendering() {
		if (this._render && this._isRendering) {
			Render.stop(this._render);
			this._isRendering = false;
		}
	}

	public static startRunning() {
		if (this._engine && this._runner && !this._isRunning) {
			Runner.run(this._runner, this._engine);
			this._isRunning = true;
		}
	}

	public static stopRunning() {
		if (this._engine && this._runner && this._isRunning) {
			Runner.stop(this._runner);
			this._isRunning = false;
		}
	}

	public static get engine() {
		if (!this._engine) {
			this.initialize();
		}
		return this._engine!;
	}

	public static get render() {
		if (!this._render) {
			this.initialize();
		}
		return this._render!;
	}

	public static get element() {
		if (!this._element) {
			this.initialize();
		}
		return this._element!;
	}

	public static get width() {
		return this._width;
	}

	public static get height() {
		return this._height;
	}

	public static get wireframes() {
		return this._wireframes;
	}

	public static set wireframes(value: boolean) {
		this._wireframes = value;
		if (this._render) {
			this._render.options.wireframes = value;
		}
	}

	public static setGravity(xAcceleration: number, yAcceleration: number) {
		this.engine.gravity.x = xAcceleration;
		this.engine.gravity.y = yAcceleration;
	}
}
