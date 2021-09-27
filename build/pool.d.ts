export declare class MarkSweepPool {
    private level;
    constructor();
    mark(): void;
    sweep(): void;
    reset(): void;
    wait(): Promise<void>;
}
export declare class PoolObject<T> {
    private isBusy;
    Data: T;
    get IsBusy(): Boolean;
    makeBusy(): void;
    makeFree(): void;
    constructor(data?: T);
}
export declare class PoolRegistry {
    private registry;
    constructor();
    get Properties(): {
        key: string;
        value: any;
    }[];
    get(key: string): any;
    set(key: string, value: any): void;
    remove(key: string): void;
    has(key: string): Boolean;
    clear(): void;
}
export declare class Pool<T> {
    private items;
    private registry;
    oncommit: ((pool: Pool<T>) => void)[];
    onrollback: ((pool: Pool<T>) => void)[];
    private isBusy;
    get Items(): PoolObject<T>[];
    get IsBusy(): Boolean;
    get Registry(): PoolRegistry;
    constructor();
    insert(item: PoolObject<T>): void;
    remove(item: PoolObject<T>): void;
    reset(): void;
    rollback(): Promise<any>;
    commit(): Promise<any>;
}
//# sourceMappingURL=pool.d.ts.map