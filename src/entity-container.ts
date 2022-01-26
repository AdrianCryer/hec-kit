import Entity from "./entity";


export default class EntityContainer<E extends Entity<any>> {

    private active: Set<string>;
    private entities: { [id: string]: E };

    constructor() {
        this.active = new Set();
        this.entities = {};
    }

    add(entity: E) {
        if (!(entity.id in this.entities)) {
            this.entities[entity.id] = entity;
            if (entity.requestsUpdate) {
                this.active.add(entity.id);
            }
        }
    }

    remove(entity: E) {
        const id = entity.id;
        if (entity.id in this.entities) {
            delete this.entities[entity.id];
        }
        if (this.active.has(id)) {
            this.active.delete(id);
        }
    }

    get(id: string) {
        return this.entities[id];
    }

    getUpdatable() {
        return Object.values(this.active).map(id => this.entities[id]);
    }
}