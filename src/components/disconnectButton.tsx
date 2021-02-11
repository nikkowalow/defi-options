import React from 'react';
import { StatsModel } from '../statsModel';
import { Link } from 'react-router-dom'

interface DisconnectButtonProps {
    connect: (key: boolean) => void;
}

export class DisconnectButton extends React.Component<DisconnectButtonProps> {

    onClick = () => {
        this.props.connect(false);
    }

    render() {
        return (
            <div>
                <Link to="/connect">
                    <button onClick={this.onClick} className="disconnect-button">
                        Disconnect
                    </button>
                </Link>
            </div>
        );
    }
}

