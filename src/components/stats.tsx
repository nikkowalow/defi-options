import React from 'react';
import { StatsModel } from '../statsModel';
import { PublicKey } from '@solana/web3.js';
import { CLUSTER } from '../solanaHelperMethods';

interface StatsProps {
    voterKey?: PublicKey;
    model: StatsModel;
    balance?: number;
    connected?: string;
}




export class Stats extends React.Component<StatsProps> {

    render() {
        return (
            <div>
                <div className="stats">
                    connected @ {CLUSTER}
                    <br>
                    </br>
                    wallet: {this.props.voterKey?.toString()}
                    <br>
                    </br>
                    balance: {this.props.balance} SOL
                    <br>
                    </br>

                </div>

            </div>
        );
    }
}

