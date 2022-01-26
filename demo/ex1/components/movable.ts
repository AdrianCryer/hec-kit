import Entity from "../../../src/entity";
import { UpdateTree } from "../../../src/update-tree";
import Monster from "../monter";
import Room from "../room";

export default class Movable extends Entity<Monster> {

    // protected movingDirection: Direction;
    protected wantsToMove: boolean;
    protected speed: number;

    constructor(parent: Monster) {
        super(parent);
    }

    // onUpdateSelf(): UpdateTree<Monster> {

    //     if (this.wantsToMove) {
    //         // this.parent.
    //     }

    //     return {
    //         id: this.id,
    //         isUpdated: false,

    //     }
    // }
} 