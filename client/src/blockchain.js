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
exports.__esModule = true;
exports.Blockchain = void 0;
var bs58_1 = require("bs58");
var solana_1 = require("./solana");
var Blockchain = /** @class */ (function () {
    function Blockchain() {
    }
    /**
     * @dev Reads data from an account
     */
    Blockchain.get = function (env, accountName) {
        return __awaiter(this, void 0, void 0, function () {
            var solana, account, accountInfo, layoutItem, layout, resultData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        solana = new solana_1.Solana(env.config);
                        account = env.config.programInfo.programAccounts[accountName];
                        if (!account) {
                            throw new Error("Account " + accountName + " does not exist.");
                        }
                        return [4 /*yield*/, solana.getAccountInfo(account.publicKey)];
                    case 1:
                        accountInfo = _a.sent();
                        layoutItem = solana_1.Solana.getDataLayouts().filter(function (item) {
                            return item.name == accountName;
                        });
                        layout = layoutItem.length > 0 ? layoutItem[0].layout : null;
                        resultData = null;
                        if (accountInfo && layout) {
                            resultData = layout.decode(Buffer.from(accountInfo.data));
                        }
                        console.log("account: " + account + " pubkey: " + account.publicKey);
                        //return account.publicKey;
                        return [2 /*return*/, {
                                callAccount: account.publicKey,
                                callData: resultData
                            }];
                }
            });
        });
    };
    /**
     * @dev Updates an account's data
     */
    Blockchain.put = function (env, accountName, data) {
        return __awaiter(this, void 0, void 0, function () {
            var solana, txReceipt, network;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        solana = new solana_1.Solana(env.config);
                        return [4 /*yield*/, solana.submitTransaction({
                                keys: [{ pubkey: solana_1.Solana.getPublicKey(env.config.programInfo.programAccounts[accountName].publicKey), isSigner: false, isWritable: true }],
                                payer: solana_1.Solana.getSigningAccount(bs58_1["default"].decode(env.config.programInfo.programAccounts['payer'].privateKey)),
                                programId: solana_1.Solana.getPublicKey(env.config.programInfo.programId),
                                data: data
                            })];
                    case 1:
                        txReceipt = _a.sent();
                        network = env.config.httpUri.indexOf('devnet') ? 'devnet' : 'mainnet';
                        return [2 /*return*/, {
                                txHash: txReceipt,
                                explorer: "<a href=\"https://explorer.solana.com/tx/" + txReceipt + "?cluster=" + network + "\" target=\"_new\" style=\"text-decoration:underline;\">View Transaction Details</a>"
                            }];
                }
            });
        });
    };
    /**
     * @dev Calls a program function
     */
    Blockchain.post = function (env, tx, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, 'Not implemented'];
            });
        });
    };
    return Blockchain;
}());
exports.Blockchain = Blockchain;
module.exports = {
    Blockchain: Blockchain
};
