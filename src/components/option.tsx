import React from 'react';
import rp from 'request-promise';
import * as config from '../configs/config.json';
import { Coin } from '../models/coin'

interface OptionProps {
    coin: Coin;
}

export class Option extends React.Component<OptionProps> {

    makeOption() {
        return (
            <div>
                 
            </div>
        );
    }


    render() {
        return (
            <div className="options-container">
                {this.makeOption()}
            </div >
        );
    }
}

