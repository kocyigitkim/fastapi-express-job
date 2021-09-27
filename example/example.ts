import { JobManager, PoolRegistry, while_promise, MarkSweepPool } from '../src/index';

const JOB_CURRENCY = "job.currency";
const JOB_CURRENCY_CTX = new MarkSweepPool();
const CurrencyJob = async (fireDate: Date, registry: PoolRegistry) => {
    await JOB_CURRENCY_CTX.wait();
    JOB_CURRENCY_CTX.mark();

    JOB_CURRENCY_CTX.sweep();
};

var manager = new JobManager();
manager.add(JOB_CURRENCY, CurrencyJob);

manager.run(JOB_CURRENCY);


async function main() {
    await while_promise(() => true, 1000);
}
main();