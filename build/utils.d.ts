export declare function newguid(): string;
export declare function while_promise(condition: () => Boolean, interval?: number, callback?: () => void): Promise<void>;
export declare function wait_promise(promise: any, onError?: ((err: any) => void)): Promise<any>;
export declare function as_promise(callback: Function, thisArgument?: any): ((...args: any[]) => Promise<any>);
export declare function is_promise(value: any): boolean;
export declare function run_pool(list: any[], callback: Function, thisArgument?: any, max_concurrent?: number): Promise<{
    success: number;
    error: number;
}>;
//# sourceMappingURL=utils.d.ts.map