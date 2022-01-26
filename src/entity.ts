
import shortUUID from "short-uuid";
import EntityContainer from "./entity-container";
import { UpdateTree } from "./update-tree";


export type ChildEntity<P> = Entity<Entity<P>>;

export interface EntityClass<T extends Entity<any>> {
    readonly name: string;
    new (...args: unknown[]): T;
}

/**
 * Core Entity Type
 */
export default abstract class Entity<P> {

    readonly id: string;

    readonly parent: P;

    private _children: EntityContainer<ChildEntity<P>>;

    public get children(): EntityContainer<ChildEntity<P>> {
        return this._children;
    }
    public set children(value: EntityContainer<ChildEntity<P>>) {
        this._children = value;
    }

    private components: EntityContainer<ChildEntity<P>>;
    private componentTagMap: Record<string, string>;

    private _requestsUpdate: boolean;

    public get requestsUpdate(): boolean {
        return this._requestsUpdate;
    }

    protected set requestsUpdate(value: boolean) {
        this._requestsUpdate = value;
    }

    /**
     * Create a new entity
     * @param parent The parent entity the new entity should be attached to.
     */    
    constructor(parent: P) {
        this.parent = parent;
        this.id = shortUUID.generate();
        this.children = new EntityContainer();
        this.components = new EntityContainer();

        // if (parent instanceof Entity) {
        //     parent.addChild(this);
        // }
    }

    /**
     * Adds a new entity as a child of calling entity.
     * @param child Entity to add
     */
    public addChild(child: ChildEntity<P>): void {
        this.children.add(child);
    }

    /**
     * Remove an existing entity and all of it's children
     * @param child Entity to remove
     */
    removeChild(child: ChildEntity<P>): void {
        this.children.remove(child);
    }

    /**
     * Adds a component entity to the current entity.
     * @param component The component to add
     */
    addComponent<C extends ChildEntity<P>>(component: C) {
        const tag = component.constructor.name;
        if (tag in this.componentTagMap) {
            throw new Error("Component already exists on the target entity");
        }
        this.componentTagMap[tag] = component.id;
        this.components.add(component);
    }

    /**
     * Retrieve a particular component that is attached to this entity 
     * @param cls The class of the desired component
     * @returns The component attached to this entity referenced by the specified class or null if no such component exists;
     */
    getComponent<C extends ChildEntity<P>>(cls: EntityClass<C>) {
        const id = this.componentTagMap[cls.name];
        if (!id)  {
            return null;
        }
        return this.components.get(id) as C;
    }

    hasComponent<C extends ChildEntity<P>>(cls: EntityClass<C>) {
        return (cls.name in this.componentTagMap);
    }

    /**
     * NOTE: Override this class for more curated behaviour.
     * @returns The update tree corresponding to this entities components.
     */
    onUpdateSelf(): [componentTree: UpdateTree<P>, shouldUpdateSelf: boolean] {
        return [null, false];
    }

    /**
     * Function to be executed on every update tick.
     * @returns An update tree
     */
    onUpdate(): UpdateTree<P> {

        const [updateTree, shouldUpdate] = this.onUpdateSelf();

        let childUpdates: UpdateTree<Entity<P>>[] = [];
        for (let child of this.children.getUpdatable()) {
            const updates = child.onUpdate();

            if (updates.isUpdated || updates.children) {
                childUpdates.push(updates);
            }
        }

        let tree = {
            id: this.id,
            isUpdated: false,
            children: childUpdates
        };

        // if (updateTree.isUpdated && updateTree.properties) {
            
        // }

        return tree;
    }
}

export class SilentEntity<P> extends Entity<P> {

    constructor(parent: P) {
        super(parent);
        this.requestsUpdate = false;
    }

    addChild(child: ChildEntity<P>): void {
        if (child.removeChild) {
            throw new Error("Cannot add updatable child to silent parent.");
        }
        this.addChild(child);
    }

    onUpdate(): UpdateTree<P> {
        throw new Error("Malformed entity given: Silent entities should not request updates directly.")
    }
}