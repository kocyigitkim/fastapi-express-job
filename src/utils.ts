export function newguid() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

export async function while_promise(condition: () => Boolean, interval: number = 100, callback: () => void = null) {
    while (condition()) {
        await new Promise(resolve => setTimeout(resolve, interval));
    }
    if (callback) callback();
}
export async function wait_promise(promise: any, onError?: ((err: any) => void)): Promise<any> {
    var result: any = promise;
    if (result instanceof Promise) {
        result = await result.catch(err => {
            if (onError) onError(err);
            else console.error(err);
        });
    }
    return result;
}
export function as_promise(callback: Function, thisArgument: any = null): ((...args) => Promise<any>) {
    return (async (callback: Function, ...args: any[]) => {
        try {
            return await callback.call(this, ...args);
        } catch (err) {
            console.error(err);
        }
    }).bind(thisArgument, callback)
}
export function is_promise(value: any) {
    return value instanceof Promise;
}
export async function run_pool(list: any[], callback: Function, thisArgument: any = null, max_concurrent: number = 16) {
    var success = 0;
    var error = 0;
    for (var i = 0; i < list.length; i += (list.length - i < max_concurrent ? list.length - i : max_concurrent)) {
        await Promise.all(list.slice(i, i + max_concurrent).map(callback.bind(thisArgument))).then(() => {
            success++;
        }).catch((err) => {
            console.error("pool error", err);
            error++;
        });
    }
    return { success, error };
}