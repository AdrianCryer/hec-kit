import Entity from "./entity";

/**
 * Root element in your system.
 */
export default class Root extends Entity<{}> {

    constructor() {
        super(null);
    }
}