import { time } from 'console';
import React from 'react';
import { Link } from 'react-router-dom'
import { DisconnectButton, ConnectButton } from '.';
import solanacoin from '../images/solanacoin.png';
import { classNames } from 'classnames'

export class Play extends React.Component {

    state = {
        count: 0
    }




    click = () => {
        this.setState({ count: this.state.count += 1 });
    }


    render() {

        return (
            <div>


                <img src={solanacoin} className="coin" onClick={this.click} />

                {this.state.count}


            </div>
        );
    }
}

