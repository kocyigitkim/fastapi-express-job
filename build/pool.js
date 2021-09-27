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
exports.Pool = exports.PoolRegistry = exports.PoolObject = exports.MarkSweepPool = void 0;
var utils_1 = require("./utils");
var MarkSweepPool = /** @class */ (function () {
    function MarkSweepPool() {
        this.level = 0;
    }
    MarkSweepPool.prototype.mark = function () {
        this.level++;
    };
    MarkSweepPool.prototype.sweep = function () {
        this.level--;
    };
    MarkSweepPool.prototype.reset = function () {
        this.level = 0;
    };
    MarkSweepPool.prototype.wait = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, utils_1.while_promise)((function () { return _this.level > 0; }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return MarkSweepPool;
}());
exports.MarkSweepPool = MarkSweepPool;
var PoolObject = /** @class */ (function () {
    function PoolObject(data) {
        this.Data = data;
    }
    Object.defineProperty(PoolObject.prototype, "IsBusy", {
        get: function () {
            return this.isBusy;
        },
        enumerable: false,
        configurable: true
    });
    PoolObject.prototype.makeBusy = function () {
        this.isBusy = true;
    };
    PoolObject.prototype.makeFree = function () {
        this.isBusy = false;
    };
    return PoolObject;
}());
exports.PoolObject = PoolObject;
var PoolRegistry = /** @class */ (function () {
    function PoolRegistry() {
        this.registry = {};
    }
    Object.defineProperty(PoolRegistry.prototype, "Properties", {
        get: function () {
            var _this = this;
            return Object.keys(this.registry).map(function (key) {
                return { key: key, value: _this.registry[key] };
            });
        },
        enumerable: false,
        configurable: true
    });
    PoolRegistry.prototype.get = function (key) {
        return this.registry[key];
    };
    PoolRegistry.prototype.set = function (key, value) {
        this.registry[key] = value;
    };
    PoolRegistry.prototype.remove = function (key) {
        delete this.registry[key];
    };
    PoolRegistry.prototype.has = function (key) {
        return this.registry.hasOwnProperty(key) || this.registry[key] !== undefined;
    };
    PoolRegistry.prototype.clear = function () {
        this.registry = {};
    };
    return PoolRegistry;
}());
exports.PoolRegistry = PoolRegistry;
var Pool = /** @class */ (function () {
    function Pool() {
        this.items = [];
        this.oncommit = [];
        this.onrollback = [];
        this.isBusy = false;
        this.registry = new PoolRegistry();
    }
    Object.defineProperty(Pool.prototype, "Items", {
        get: function () {
            return this.items;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pool.prototype, "IsBusy", {
        get: function () {
            return this.isBusy;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pool.prototype, "Registry", {
        get: function () {
            return this.registry;
        },
        enumerable: false,
        configurable: true
    });
    Pool.prototype.insert = function (item) {
        this.items.push(item);
    };
    Pool.prototype.remove = function (item) {
        this.items.splice(this.items.indexOf(item), 1);
    };
    Pool.prototype.reset = function () {
        this.items = [];
    };
    Pool.prototype.rollback = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, callback;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.isBusy = true;
                        _i = 0, _a = this.onrollback;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        callback = _a[_i];
                        return [4 /*yield*/, (0, utils_1.wait_promise)(callback(this))];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.isBusy = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    Pool.prototype.commit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, callback;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.isBusy = true;
                        _i = 0, _a = this.oncommit;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        callback = _a[_i];
                        return [4 /*yield*/, (0, utils_1.wait_promise)(callback(this))];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.isBusy = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    return Pool;
}());
exports.Pool = Pool;
//# sourceMappingURL=pool.js.map