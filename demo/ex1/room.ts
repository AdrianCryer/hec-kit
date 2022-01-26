import Entity, { SilentEntity } from "../../src/entity";
import Root from "../../src/root";


export default class Room extends Root {
    
    public grid: string[][];
    public started: boolean;

    constructor(width: number, height: number) {
        super();
        this.grid = [];
        for (let i = 0; i < height; i++) {
            this.grid[i] = new Array(width);
        }
        this.started = false;
    }

    setup() {
        
    }

    public getAtPosition(x: number, y: number): Entity<Room> {
        return this.children.get(this.grid[y][x]) as Entity<Room>;
    }

    public isBlocked(x: number, y: number) {
        return this.grid[y][x] !== null;
    }
}