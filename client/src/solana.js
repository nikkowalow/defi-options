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
exports.Solana = void 0;
var _a = require('@solana/web3.js'), Account = _a.Account, Connection = _a.Connection, BpfLoader = _a.BpfLoader, BPF_LOADER_PROGRAM_ID = _a.BPF_LOADER_PROGRAM_ID, PublicKey = _a.PublicKey, LAMPORTS_PER_SOL = _a.LAMPORTS_PER_SOL, SystemProgram = _a.SystemProgram, TransactionInstruction = _a.TransactionInstruction, Transaction = _a.Transaction, sendAndConfirmTransaction = _a.sendAndConfirmTransaction;
var bs58 = require('bs58');
var DataLayouts = require('../scripts/layouts');
var Solana = /** @class */ (function () {
    function Solana(config) {
        this.serviceUri = config.httpUri;
        this.connection = new Connection(this.serviceUri, 'singleGossip');
    }
    Solana.getPublicKey = function (publicKey) {
        return typeof publicKey === 'string' ? new PublicKey(publicKey) : publicKey;
    };
    Solana.getSigningAccount = function (privateKey) {
        return new Account(privateKey);
    };
    Solana.prototype.getAccountInfo = function (publicKey) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.getAccountInfo(Solana.getPublicKey(publicKey))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Solana.getDataLayouts = function () {
        return DataLayouts.get();
    };
    Solana.prototype.getAccountBalance = function (publicKey) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.getBalance(Solana.getPublicKey(publicKey))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Solana.prototype.airDrop = function (publicKey, lamports) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.requestAirdrop(Solana.getPublicKey(publicKey), lamports)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Solana.prototype.createSystemAccount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var self, lamports, account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        lamports = 1;
                        account = new Account();
                        console.log("\uD83E\uDD16 Account " + account.publicKey + " created. Requesting Airdrop...");
                        return [4 /*yield*/, self.airDrop(Solana.getPublicKey(account.publicKey), lamports)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, account];
                }
            });
        });
    };
    /**
     * Creates an account and adds lamports
     *
     * @param options   lamports: Number of lamports to add
     *                  entropy:  Secret key used to generate account keypair Buffer | Uint8Array | Array<number>
     * @returns Account that was created
     */
    Solana.prototype.createAccount = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var self, lamports, account, retries, i, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        self = this;
                        lamports = options.lamports || 1000000;
                        account = options.entropy ? new Account(options.entropy) : new Account();
                        retries = 10;
                        console.log("\uD83E\uDD16 Account " + account.publicKey + " created. Requesting Airdrop...");
                        return [4 /*yield*/, self.airDrop(Solana.getPublicKey(account.publicKey), lamports)];
                    case 1:
                        _b.sent();
                        i = 0;
                        _b.label = 2;
                    case 2:
                        if (!(i < retries)) return [3 /*break*/, 6];
                        return [4 /*yield*/, Solana._sleep(500)];
                    case 3:
                        _b.sent();
                        _a = lamports;
                        return [4 /*yield*/, self.getAccountBalance(Solana.getPublicKey(account.publicKey))];
                    case 4:
                        if (_a == (_b.sent())) {
                            console.log("\uD83E\uDE82 Airdrop success for " + account.publicKey + " (balance: " + lamports + ")");
                            return [2 /*return*/, account];
                        }
                        if (--retries <= 0) {
                            return [3 /*break*/, 6];
                        }
                        console.log("--- Airdrop retry #" + retries + " for " + account.publicKey);
                        _b.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 2];
                    case 6: throw new Error("Airdrop of " + lamports + " failed for " + account.publicKey);
                }
            });
        });
    };
    Solana.prototype.createvoterAccount = function (program) {
        return __awaiter(this, void 0, void 0, function () {
            var self, dataLayouts, fees, feeCalculator, NUM_RETRIES, _a, _b, l, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        self = this;
                        dataLayouts = Solana.getDataLayouts();
                        fees = 0;
                        return [4 /*yield*/, self.connection.getRecentBlockhash()];
                    case 1:
                        feeCalculator = (_d.sent()).feeCalculator;
                        NUM_RETRIES = 500;
                        _a = fees;
                        _b = feeCalculator.lamportsPerSignature *
                            (BpfLoader.getMinNumSignatures(program.length) + NUM_RETRIES);
                        return [4 /*yield*/, self.connection.getMinimumBalanceForRentExemption(program.length)];
                    case 2:
                        fees = _a + (_b +
                            (_d.sent()));
                        l = 0;
                        _d.label = 3;
                    case 3:
                        if (!(l < dataLayouts.length)) return [3 /*break*/, 6];
                        _c = fees;
                        return [4 /*yield*/, self.connection.getMinimumBalanceForRentExemption(dataLayouts[l].span)];
                    case 4:
                        fees = _c + _d.sent();
                        _d.label = 5;
                    case 5:
                        l++;
                        return [3 /*break*/, 3];
                    case 6:
                        // Calculate the cost of sending the transactions
                        fees += feeCalculator.lamportsPerSignature * 100; // wag
                        return [4 /*yield*/, self.createAccount({ lamports: fees })];
                    case 7: // wag
                    // Fund a new payer via airdrop
                    return [2 /*return*/, _d.sent()];
                }
            });
        });
    };
    Solana.prototype.deployProgram = function (program) {
        return __awaiter(this, void 0, void 0, function () {
            var self, dataLayouts, voterAccount, deployAccounts, _a, programAccount, programId, transactionAccounts, transaction, l, stateAccount, space, lamports;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        self = this;
                        dataLayouts = Solana.getDataLayouts();
                        return [4 /*yield*/, self.createvoterAccount(program)];
                    case 1:
                        voterAccount = _d.sent();
                        _b = {};
                        _a = "payer";
                        _c = {
                            publicKey: voterAccount.publicKey.toBase58(),
                            privateKey: bs58.encode(voterAccount.secretKey)
                        };
                        return [4 /*yield*/, self.getAccountBalance(voterAccount.publicKey)];
                    case 2:
                        deployAccounts = (_b[_a] = (_c.lamports = _d.sent(),
                            _c),
                            _b);
                        programAccount = new Account();
                        return [4 /*yield*/, BpfLoader.load(self.connection, voterAccount, programAccount, program, BPF_LOADER_PROGRAM_ID)];
                    case 3:
                        _d.sent();
                        programId = programAccount.publicKey;
                        transactionAccounts = [voterAccount];
                        transaction = new Transaction();
                        l = 0;
                        _d.label = 4;
                    case 4:
                        if (!(l < dataLayouts.length)) return [3 /*break*/, 7];
                        stateAccount = new Account();
                        transactionAccounts.push(stateAccount);
                        space = dataLayouts[l].layout.span;
                        return [4 /*yield*/, self.connection.getMinimumBalanceForRentExemption(dataLayouts[l].layout.span)];
                    case 5:
                        lamports = _d.sent();
                        transaction.add(SystemProgram.createAccount({
                            fromPubkey: voterAccount.publicKey,
                            newAccountPubkey: stateAccount.publicKey,
                            lamports: lamports,
                            space: space,
                            programId: programId
                        }));
                        deployAccounts[dataLayouts[l].name] = {
                            publicKey: stateAccount.publicKey.toBase58(),
                            privateKey: bs58.encode(stateAccount.secretKey),
                            lamports: lamports
                        };
                        _d.label = 6;
                    case 6:
                        l++;
                        return [3 /*break*/, 4];
                    case 7: return [4 /*yield*/, sendAndConfirmTransaction(self.connection, transaction, transactionAccounts, {
                            commitment: 'singleGossip',
                            preflightCommitment: 'singleGossip'
                        })];
                    case 8:
                        _d.sent();
                        return [2 /*return*/, {
                                programId: programAccount.publicKey.toBase58(),
                                programAccounts: deployAccounts
                            }];
                }
            });
        });
    };
    Solana.prototype.submitTransaction = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var self, instruction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        instruction = new TransactionInstruction({
                            keys: options.keys,
                            programId: options.programId,
                            data: options.data
                        });
                        return [4 /*yield*/, sendAndConfirmTransaction(self.connection, new Transaction().add(instruction), [options.payer], {
                                commitment: 'singleGossip',
                                preflightCommitment: 'singleGossip'
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Solana._sleep = function (ms) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
            });
        });
    };
    return Solana;
}());
exports.Solana = Solana;
module.exports = {
    Solana: Solana
};
