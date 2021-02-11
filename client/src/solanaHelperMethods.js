"use strict";
// new testnet pubkey
// ======================================================================
// pubkey: 25CwjKDxt7ti7chSNcnpTBkLEBMtTa6P2zfk9HtEdss9
// ======================================================================
// Save this seed phrase to recover your new keypair:
// pulse shell kind supply canoe note network burst cart cheap relax wash
// ======================================================================
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
exports.__esModule = true;
exports.airdropTest = exports.isValidKey = exports.getBalance = exports.airdrop = exports.getCluster = exports.newAccountWithLamports = exports.connect = exports.CLUSTER = exports.programId = exports.connection = void 0;
//programId: Gqj6LTnJy1c1tV4oXGek2nrozKsX2TCQoSUKpXR8doKe
var web3_js_1 = require("@solana/web3.js");
var BufferLayout = require("buffer-layout");
var demoAccount;
var voterAccount;
exports.programId = new web3_js_1.PublicKey("Gqj6LTnJy1c1tV4oXGek2nrozKsX2TCQoSUKpXR8doKe");
var votedOnPubkey = new web3_js_1.PublicKey("8spckFD8pEwZG1Vip76Vk6YhjBHirRzHFUibsVWVVw1c");
exports.CLUSTER = "https://devnet.solana.com";
var votedOnAccountLayout = BufferLayout.struct([BufferLayout.u32('votes')]);
function connect() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            exports.connection = new web3_js_1.Connection(exports.CLUSTER, 'singleGossip');
            console.log("connected @ " + exports.CLUSTER);
            return [2 /*return*/];
        });
    });
}
exports.connect = connect;
function newAccountWithLamports(lamports) {
    if (lamports === void 0) { lamports = 1000000; }
    return __awaiter(this, void 0, void 0, function () {
        var account, retries, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    account = new web3_js_1.Account();
                    retries = 10;
                    return [4 /*yield*/, exports.connection.requestAirdrop(account.publicKey, lamports)];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2:
                    _a = lamports;
                    return [4 /*yield*/, exports.connection.getBalance(account.publicKey)];
                case 3:
                    if (_a == (_b.sent())) {
                        return [2 /*return*/, account];
                    }
                    if (--retries <= 0) {
                        return [3 /*break*/, 5];
                    }
                    console.log("Airdrop retry " + retries);
                    _b.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: throw new Error("Airdrop of " + lamports + " failed");
            }
        });
    });
}
exports.newAccountWithLamports = newAccountWithLamports;
function getCluster() {
    return exports.CLUSTER;
}
exports.getCluster = getCluster;
function airdrop(key, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var drop;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("balance pre airdrop: " + getBalance(key) + " SOL");
                    return [4 /*yield*/, exports.connection.requestAirdrop(demoAccount.publicKey, amount)];
                case 1:
                    drop = _a.sent();
                    console.log("balance post airdorp: " + getBalance(key) + " SOL");
                    return [2 /*return*/, drop];
            }
        });
    });
}
exports.airdrop = airdrop;
function getBalance(key) {
    return __awaiter(this, void 0, void 0, function () {
        var balance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.connection.getBalance(key)];
                case 1:
                    balance = _a.sent();
                    console.log("Balance: " + balance / web3_js_1.LAMPORTS_PER_SOL + " SOL");
                    return [2 /*return*/, balance];
            }
        });
    });
}
exports.getBalance = getBalance;
function isValidKey(key) {
    var str = key.toString();
    return str.match(/^[0-9a-zA-Z]+$/) && str.length >= 44 && str.length <= 45;
}
exports.isValidKey = isValidKey;
function airdropTest() {
    return __awaiter(this, void 0, void 0, function () {
        var acc, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    acc = new web3_js_1.Account();
                    _b = (_a = console).log;
                    return [4 /*yield*/, exports.connection.getBalance(acc.publicKey)];
                case 1:
                    _b.apply(_a, [_e.sent()]);
                    return [4 /*yield*/, newAccountWithLamports()];
                case 2:
                    acc = _e.sent();
                    _d = (_c = console).log;
                    return [4 /*yield*/, exports.connection.getBalance(acc.publicKey)];
                case 3:
                    _d.apply(_c, [_e.sent()]);
                    return [2 /*return*/];
            }
        });
    });
}
exports.airdropTest = airdropTest;
