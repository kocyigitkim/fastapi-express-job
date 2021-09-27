import { Pool, PoolObject, PoolRegistry } from './pool';
import { Job } from 'node-schedule';
import { wait_promise } from './utils';
export { wait_promise, as_promise, newguid, is_promise, run_pool, while_promise } from './utils';
export { Pool, PoolObject, PoolRegistry, MarkSweepPool } from './pool';

export interface JobCallback {
    (fireDate: Date, registry: PoolRegistry): any;
}

export class JobManager {
    public readonly pool: Pool<Job>;
    constructor() {
        this.pool = new Pool<Job>();
    }
    public get Registry(): PoolRegistry {
        return this.pool.Registry;
    }
    public add(name: string, callback: JobCallback): Job {
        var newCallback: any = (async (callback, ...args) => {
            await wait_promise(callback(...args));
        }).bind(this, callback);

        var job: Job = new Job(name, newCallback);
        this.pool.insert(new PoolObject<Job>(job));
        return job;
    }
    public run(name: string) {
        var job: Job = this.pool.Items.filter(p => p.Data.name === name).map(p => p.Data)[0];
        if (job) {
            ((job as any).job as Function).call(this, new Date(), this.pool.Registry);
        }
    }
    public runMany(names: string[]) {
        names.forEach(name => this.run(name));
    }
    public removeMany(names: string[]) {
        names.forEach(name => this.remove(name));
    }
    public remove(name: string) {
        var job: PoolObject<Job> = this.pool.Items.filter(p => p.Data.name === name)[0];
        if (job) {
            job.Data.cancel();
            this.pool.remove(job);
        }
    }
    public get(name: string): Job {
        return this.pool.Items.filter(p => p.Data.name === name).map(p => p.Data)[0];
    }
    public getAll(name: string): Job[] {
        return this.pool.Items.filter(p => p.Data.name === name).map(p => p.Data);
    }
    public find(predicate: (job: Job) => boolean): Job[] {
        return this.pool.Items.filter(p => predicate(p.Data)).map(p => p.Data);
    }
    public findOne(predicate: (job: Job) => boolean): Job {
        return this.pool.Items.filter(p => predicate(p.Data)).map(p => p.Data)[0];
    }
}