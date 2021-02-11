import React from 'react';
import rp from 'request-promise';
import * as config from '../configs/config.json';
import { useTable } from 'react-table';
import { CoinInfo, CoinsState } from './coins'

import { Link } from 'react-router-dom';
import { throws } from 'assert';
import { timeStamp } from 'console';

interface OptionProps {
  coin?: CoinInfo;
}




export class Option extends React.Component<OptionProps> {






  makeOption() {
    return (
      <table>
        <thead>
          <tr >
            <th>Strike</th>
            <th>Delta</th>
            <th>Gamma</th>
            <th>Theta</th>
            <th>Rho</th>
            <th>Vega</th>
            <th>Change</th>
            <th>% Change</th>
            <th>Volume</th>
            <th>Interest</th>
            <th>Imp. Vol</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Item</td>
            <td>Item</td>
            <td>Item</td>
            <td>Item</td>
          </tr>
          <tr>
            <td>Item</td>
            <td>Item</td>
            <td>Item</td>
            <td>Item</td>
          </tr>
          <tr>
            <td>Item</td>
            <td>Item</td>
            <td>Item</td>
            <td>Item</td>
          </tr>
          <tr>
            <td>Item</td>
            <td>Item</td>
            <td>Item</td>
            <td>Item</td>
          </tr>
        </tbody>
      </table >
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

