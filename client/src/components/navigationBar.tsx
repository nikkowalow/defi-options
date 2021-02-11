import React from 'react';
import { Link } from 'react-router-dom'
import { DisconnectButton, ConnectButton } from '.';
import solanalogo from '../images/solanalogo.png';

interface NavigationBarProps {
    authenticated: boolean;
}

export class NavigationBar extends React.Component<NavigationBarProps> {


    state = {
        authenticated: this.props.authenticated
    }



    render() {

        return (
            <div>

                <Link to="/">
                    <img src={solanalogo} className="navigation-bar-logo" />
                </Link>

                <Link to="/coins">
                    <button className="play-button">
                        View Coins
                    </button>
                </Link>



            </div>
        );
    }
}

