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
exports.ImageAccount = void 0;
var web3_js_1 = require("@solana/web3.js");
var web3_js_2 = require("@solana/web3.js");
var BufferLayout = require("buffer-layout");
var solanaHelperMethods_1 = require("./solanaHelperMethods");
var ImageAccount = /** @class */ (function () {
    function ImageAccount() {
        this.votedOnAccountLayout = BufferLayout.struct([BufferLayout.u32('votes')]);
    }
    ImageAccount.prototype.makeImage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var votedOnAccount, space, transaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.imagePubkey) return [3 /*break*/, 2];
                        votedOnAccount = new web3_js_2.Account();
                        this.imagePubkey = votedOnAccount.publicKey;
                        console.log(this.imagePubkey.toString());
                        space = this.votedOnAccountLayout.span;
                        transaction = new web3_js_2.Transaction().add(web3_js_2.SystemProgram.createAccount({
                            fromPubkey: this.voterAccount.publicKey,
                            newAccountPubkey: this.imagePubkey,
                            lamports: web3_js_1.LAMPORTS_PER_SOL,
                            space: space,
                            programId: solanaHelperMethods_1.programId
                        }));
                        return [4 /*yield*/, web3_js_2.sendAndConfirmTransaction(solanaHelperMethods_1.connection, transaction, [this.voterAccount, votedOnAccount], {
                                commitment: 'singleGossip',
                                preflightCommitment: 'singleGossip'
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    ImageAccount.prototype.createVoter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var STARTING_SOL_AMOUNT, account, retries, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.voterAccount) return [3 /*break*/, 6];
                        STARTING_SOL_AMOUNT = web3_js_1.LAMPORTS_PER_SOL * 10;
                        account = new web3_js_2.Account();
                        retries = 10;
                        return [4 /*yield*/, solanaHelperMethods_1.connection.requestAirdrop(account.publicKey, STARTING_SOL_AMOUNT)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        _a = STARTING_SOL_AMOUNT;
                        return [4 /*yield*/, solanaHelperMethods_1.connection.getBalance(account.publicKey)];
                    case 3:
                        if (_a == (_b.sent())) {
                            this.voterAccount = account;
                        }
                        if (--retries <= 0) {
                            return [3 /*break*/, 5];
                        }
                        console.log("Airdrop retry " + retries);
                        _b.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: throw new Error("Airdrop of " + STARTING_SOL_AMOUNT + " failed");
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ImageAccount.prototype.vote = function () {
        return __awaiter(this, void 0, void 0, function () {
            var instruction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instruction = new web3_js_2.TransactionInstruction({
                            keys: [{ pubkey: this.imagePubkey, isSigner: false, isWritable: true }],
                            programId: solanaHelperMethods_1.programId,
                            data: Buffer.alloc(0)
                        });
                        return [4 /*yield*/, web3_js_2.sendAndConfirmTransaction(solanaHelperMethods_1.connection, new web3_js_2.Transaction().add(instruction), [this.voterAccount], { commitment: 'singleGossip' })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ImageAccount.prototype.countVotes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var accountInfo, info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, solanaHelperMethods_1.connection.getAccountInfo(this.imagePubkey)];
                    case 1:
                        accountInfo = _a.sent();
                        if (!accountInfo) {
                            throw 'Error: cannot find the greeted account';
                        }
                        info = this.votedOnAccountLayout.decode(Buffer.from(accountInfo.data));
                        console.log(this.imagePubkey.toBase58(), 'has', info.votes.toString(), 'votes');
                        return [2 /*return*/, info.votes];
                }
            });
        });
    };
    return ImageAccount;
}());
exports.ImageAccount = ImageAccount;
