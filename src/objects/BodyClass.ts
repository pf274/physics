export abstract class BodyClass {
	public abstract body: Matter.Body;
	public abstract type: string;
	public abstract sounds: string[];
	public volume: number = 1;
}
