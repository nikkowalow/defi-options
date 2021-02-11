"use strict";
exports.__esModule = true;
exports.urlTls = exports.url = exports.cluster = void 0;
var web3_js_1 = require("@solana/web3.js");
var dotenv = require("dotenv");
function chooseCluster() {
    dotenv.config();
    if (!process.env.LIVE)
        return;
    switch (process.env.CLUSTER) {
        case 'devnet':
        case 'testnet':
        case 'mainnet-beta': {
            return process.env.CLUSTER;
        }
    }
    if (process.env.CLUSTER) {
        throw "Unknown cluster \"" + process.env.CLUSTER + "\", check the .env file";
    }
    else {
        throw new Error('CLUSTER is not specified, check the .env file');
    }
}
exports.cluster = chooseCluster();
exports.url = process.env.RPC_URL ||
    (process.env.LIVE ? web3_js_1.clusterApiUrl(exports.cluster, false) : 'http://localhost:8899');
exports.urlTls = process.env.RPC_URL ||
    (process.env.LIVE ? web3_js_1.clusterApiUrl(exports.cluster, true) : 'http://localhost:8899');
