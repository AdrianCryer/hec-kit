import Entity from "../../src/entity";
import { UpdateTree } from "../../src/update-tree";
import Movable from "./components/movable";
import Room from "./room";


export default class Monster extends Entity<Room> {

    // public x: number;
    // public y: number;

    constructor(parent: Room) {
        super(parent);
        this.addComponent(new Movable(this));
    }

    onUpdateSelf(): [componentTree: UpdateTree<Room>, shouldUpdateSelf: boolean] {

        const movement = this.getComponent(Movable);

        return null;
    }
}
