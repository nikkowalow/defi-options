import { PublicKey } from "@solana/web3.js";
import { getBalance } from "./solanaHelperMethods";

interface StatsModelProps {
    voterKey: PublicKey;
}

export class StatsModel {

    public async getBalance(key: PublicKey) {
        return getBalance(key);
    }



}