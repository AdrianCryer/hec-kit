import Entity from "./entity";

export interface UpdateTree<P> {
    readonly id: string;
    readonly isUpdated: boolean;
    readonly properties?: any;
    readonly children?: UpdateTree<Entity<P>>[];
    readonly components?: UpdateTree<Entity<P>>[];
}