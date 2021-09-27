import { Pool, PoolRegistry } from './pool';
import { Job } from 'node-schedule';
export { wait_promise, as_promise, newguid, is_promise, run_pool, while_promise } from './utils';
export { Pool, PoolObject, PoolRegistry, MarkSweepPool } from './pool';
export interface JobCallback {
    (fireDate: Date, registry: PoolRegistry): any;
}
export declare class JobManager {
    readonly pool: Pool<Job>;
    constructor();
    get Registry(): PoolRegistry;
    add(name: string, callback: JobCallback): Job;
    run(name: string): void;
    runMany(names: string[]): void;
    removeMany(names: string[]): void;
    remove(name: string): void;
    get(name: string): Job;
    getAll(name: string): Job[];
    find(predicate: (job: Job) => boolean): Job[];
    findOne(predicate: (job: Job) => boolean): Job;
}
//# sourceMappingURL=index.d.ts.map