import Matter, { Bodies, Body, Composite, Engine, Events, IEvent, Render, Runner, World } from "matter-js";
import { BodyClass } from "./objects/BodyClass";

const screenWidth = screen.width;
const screenHeight = screen.height;

function resizeWorld() {
	Physics.render.canvas.width = window.innerWidth;
	Physics.render.canvas.height = window.innerHeight;
	Matter.Body.setPosition(Physics.rightBound, { x: window.innerWidth - 5, y: window.innerHeight / 2 });
	Matter.Body.setPosition(Physics.bottomBound, { x: window.innerWidth / 2, y: window.innerHeight - 10 });
	Matter.Body.setPosition(Physics.topBound, { x: window.innerWidth / 2, y: 5 });
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
	public static leftBound = Bodies.rectangle(5, this._height / 2, 10, screenHeight, { isStatic: true, render: { visible: false } });
	public static rightBound = Bodies.rectangle(this._width - 5, this._height / 2, 10, screenHeight, { isStatic: true, render: { visible: false } });
	public static bottomBound = Bodies.rectangle(this._width / 2, this._height - 10, screenWidth, 20, { isStatic: true, render: { visible: true } });
	public static topBound = Bodies.rectangle(this._width / 2, 5, screenWidth, 10, { isStatic: true, render: { visible: false } });
	public static bodies: Record<string, BodyClass[]> = { rolyPoly: [] };

	public static initialize() {
		document.body.style.margin = "0";
		document.body.style.overflow = "hidden";
		this._element = document.body;
		if (!this._engine) {
			const world = World.create({ bounds: { min: { x: 0, y: 0 }, max: { x: screen.width, y: screen.height } } });
			this._engine = Engine.create({ world });
			Events.on(this._engine, "beforeUpdate", this.loopBodies.bind(this));
			Events.on(this._engine, "tick", this.handleTick.bind(this));
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
			window.addEventListener("resize", () => {
				resizeWorld();
				this._width = window.innerWidth;
				this._height = window.innerHeight;
			});
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
			const minX = 10;
			const maxX = this._width - 10;
			const minY = 10;
			const maxY = this._height - 10;

			// Check and update position for looping
			if (body.position.x > this.width) {
				Body.setPosition(body, { x: minX, y: body.position.y });
			} else if (body.position.x < 0) {
				Body.setPosition(body, { x: maxX, y: body.position.y });
			}

			if (body.position.y > this.height) {
				Body.setPosition(body, { x: body.position.x, y: minY });
			} else if (body.position.y < 0) {
				Body.setPosition(body, { x: body.position.x, y: maxY });
			}
		}
	}

	public static startRendering() {
		if (this._render && !this._isRendering) {
			Render.run(this._render);
			Events.on(this._engine!, "collisionStart", this.handleSounds.bind(this));
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

	public static addBodies(bodiesToAdd: { bodyInstance: BodyClass; collisionGroup?: number }[]) {
		for (const { bodyInstance, collisionGroup } of bodiesToAdd) {
			if (this.bodies[bodyInstance.type]) {
				this.bodies[bodyInstance.type].push(bodyInstance);
			} else {
				this.bodies[bodyInstance.type] = [bodyInstance];
			}
			if (collisionGroup !== undefined) {
				bodyInstance.body.collisionFilter.mask = collisionGroup;
			}
			Composite.add(Physics.engine.world, [bodyInstance.body]);
		}
	}

	private static handleTick(event: IEvent<Engine>) {}

	private static handleSounds(event: any) {
		const bodyA = event.pairs[0].bodyA;
		const bodyB = event.pairs[0].bodyB;
		const bodyAClass = Physics.bodies[bodyA.label]?.find((body) => body.body === bodyA);
		const bodyBClass = Physics.bodies[bodyB.label]?.find((body) => body.body === bodyB);
		const volumeA = Math.max(0, Math.min(1, (bodyA.velocity.x + bodyA.velocity.y) / 20));
		const volumeB = Math.max(0, Math.min(1, (bodyB.velocity.x + bodyB.velocity.y) / 20));
		const labelsToCheck = ["basketball", "crate", "tennisBall"];
		for (const label of labelsToCheck) {
			if (bodyA.label == label || bodyB.label == label) {
				const body = bodyA.label == label ? bodyAClass : bodyBClass;
				const volume = bodyA.label == label ? volumeA : volumeB;
				if (volume > 0.03) {
					const randomIndex = Math.floor(Math.random() * body?.sounds.length!);
					const audio = new Audio((body as BodyClass).sounds[randomIndex]);
					audio.volume = volume;
					audio.play();
				}
			}
		}
	}
}
