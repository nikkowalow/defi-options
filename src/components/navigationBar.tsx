import React from 'react';
import { Link } from 'react-router-dom'
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


                <Link to="/coins">
                    <button key="navigation-button" className="play-button">
                        View Coins
                    </button>
                </Link>



            </div>
        );
    }
}

