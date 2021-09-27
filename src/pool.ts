import { wait_promise, while_promise } from "./utils";

export class MarkSweepPool {
    private level: number;
    public constructor() {
        this.level = 0;
    }
    public mark() {
        this.level++;
    }
    public sweep() {
        this.level--;
    }
    public reset(){
        this.level = 0;
    }
    public async wait() {
        await while_promise((() => this.level > 0));
    }
}

export class PoolObject<T> {
    private isBusy: Boolean;
    public Data: T;
    public get IsBusy(): Boolean {
        return this.isBusy;
    }
    public makeBusy() {
        this.isBusy = true;
    }
    public makeFree() {
        this.isBusy = false;
    }
    public constructor(data?: T) {
        this.Data = data;
    }
}

export class PoolRegistry {
    private registry: Object;
    constructor() {
        this.registry = {};
    }
    public get Properties(): { key: string, value: any }[] {
        return Object.keys(this.registry).map(key => {
            return { key, value: this.registry[key] };
        });
    }
    public get(key: string): any {
        return this.registry[key];
    }
    public set(key: string, value: any): void {
        this.registry[key] = value;
    }
    public remove(key: string): void {
        delete this.registry[key];
    }
    public has(key: string): Boolean {
        return this.registry.hasOwnProperty(key) || this.registry[key] !== undefined;
    }
    public clear(): void {
        this.registry = {};
    }
}

export class Pool<T> {
    private items: PoolObject<T>[];
    private registry: PoolRegistry;
    public oncommit: ((pool: Pool<T>) => void)[];
    public onrollback: ((pool: Pool<T>) => void)[];
    private isBusy: Boolean;

    public get Items(): PoolObject<T>[] {
        return this.items;
    }
    public get IsBusy(): Boolean {
        return this.isBusy;
    }
    public get Registry(): PoolRegistry {
        return this.registry;
    }

    constructor() {
        this.items = [];
        this.oncommit = [];
        this.onrollback = [];
        this.isBusy = false;
        this.registry = new PoolRegistry();
    }
    public insert(item: PoolObject<T>) {
        this.items.push(item);
    }
    public remove(item: PoolObject<T>) {
        this.items.splice(this.items.indexOf(item), 1);
    }
    public reset() {
        this.items = [];
    }
    public async rollback(): Promise<any> {
        this.isBusy = true;
        for (var callback of this.onrollback) {
            await wait_promise(callback(this));
        }
        this.isBusy = false;
    }
    public async commit(): Promise<any> {
        this.isBusy = true;
        for (var callback of this.oncommit) {
            await wait_promise(callback(this));
        }
        this.isBusy = false;
    }
}