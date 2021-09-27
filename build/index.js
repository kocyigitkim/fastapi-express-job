"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobManager = exports.MarkSweepPool = exports.PoolRegistry = exports.PoolObject = exports.Pool = exports.while_promise = exports.run_pool = exports.is_promise = exports.newguid = exports.as_promise = exports.wait_promise = void 0;
var pool_1 = require("./pool");
var node_schedule_1 = require("node-schedule");
var utils_1 = require("./utils");
var utils_2 = require("./utils");
Object.defineProperty(exports, "wait_promise", { enumerable: true, get: function () { return utils_2.wait_promise; } });
Object.defineProperty(exports, "as_promise", { enumerable: true, get: function () { return utils_2.as_promise; } });
Object.defineProperty(exports, "newguid", { enumerable: true, get: function () { return utils_2.newguid; } });
Object.defineProperty(exports, "is_promise", { enumerable: true, get: function () { return utils_2.is_promise; } });
Object.defineProperty(exports, "run_pool", { enumerable: true, get: function () { return utils_2.run_pool; } });
Object.defineProperty(exports, "while_promise", { enumerable: true, get: function () { return utils_2.while_promise; } });
var pool_2 = require("./pool");
Object.defineProperty(exports, "Pool", { enumerable: true, get: function () { return pool_2.Pool; } });
Object.defineProperty(exports, "PoolObject", { enumerable: true, get: function () { return pool_2.PoolObject; } });
Object.defineProperty(exports, "PoolRegistry", { enumerable: true, get: function () { return pool_2.PoolRegistry; } });
Object.defineProperty(exports, "MarkSweepPool", { enumerable: true, get: function () { return pool_2.MarkSweepPool; } });
var JobManager = /** @class */ (function () {
    function JobManager() {
        this.pool = new pool_1.Pool();
    }
    Object.defineProperty(JobManager.prototype, "Registry", {
        get: function () {
            return this.pool.Registry;
        },
        enumerable: false,
        configurable: true
    });
    JobManager.prototype.add = function (name, callback) {
        var _this = this;
        var newCallback = (function (callback) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, utils_1.wait_promise)(callback.apply(void 0, args))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }).bind(this, callback);
        var job = new node_schedule_1.Job(name, newCallback);
        this.pool.insert(new pool_1.PoolObject(job));
        return job;
    };
    JobManager.prototype.run = function (name) {
        var job = this.pool.Items.filter(function (p) { return p.Data.name === name; }).map(function (p) { return p.Data; })[0];
        if (job) {
            job.job.call(this, new Date(), this.pool.Registry);
        }
    };
    JobManager.prototype.runMany = function (names) {
        var _this = this;
        names.forEach(function (name) { return _this.run(name); });
    };
    JobManager.prototype.removeMany = function (names) {
        var _this = this;
        names.forEach(function (name) { return _this.remove(name); });
    };
    JobManager.prototype.remove = function (name) {
        var job = this.pool.Items.filter(function (p) { return p.Data.name === name; })[0];
        if (job) {
            job.Data.cancel();
            this.pool.remove(job);
        }
    };
    JobManager.prototype.get = function (name) {
        return this.pool.Items.filter(function (p) { return p.Data.name === name; }).map(function (p) { return p.Data; })[0];
    };
    JobManager.prototype.getAll = function (name) {
        return this.pool.Items.filter(function (p) { return p.Data.name === name; }).map(function (p) { return p.Data; });
    };
    JobManager.prototype.find = function (predicate) {
        return this.pool.Items.filter(function (p) { return predicate(p.Data); }).map(function (p) { return p.Data; });
    };
    JobManager.prototype.findOne = function (predicate) {
        return this.pool.Items.filter(function (p) { return predicate(p.Data); }).map(function (p) { return p.Data; })[0];
    };
    return JobManager;
}());
exports.JobManager = JobManager;
//# sourceMappingURL=index.js.map