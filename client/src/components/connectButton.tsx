import React from 'react';
import { StatsModel } from '../statsModel';
import { Link } from 'react-router-dom';

export class ConnectButton extends React.Component {

    render() {
        return (
            <div>
                <div>
                    <Link to="/connect">
                        <button className="connect-button">
                            Connect
                        </button>
                    </Link>

                </div>


            </div >
        );
    }
}

