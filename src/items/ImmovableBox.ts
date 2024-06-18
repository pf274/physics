import { WorldSettings } from "../world/WorldSettings";
import { BaseItem, CreationSettings } from "./BaseItem";


export class ImmovableBox extends BaseItem {
  constructor(params: CreationSettings) {
    super(params);
    this.density = Infinity;
  }

  public update(frameTime: number, worldSettings: WorldSettings) {
    // Do nothing
  }
}