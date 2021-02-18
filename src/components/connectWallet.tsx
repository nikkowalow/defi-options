import React from 'react';
import { Link } from 'react-router-dom';


interface ConnectWalletProps {
    onSubmit: (key: string, authentication: boolean) => void;
}

export class ConnectWallet extends React.Component<ConnectWalletProps> {

    state = {
        key: '',
        balance: 0
    }

    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ key: e.target.value });
    }

    handleSubmit = () => {
        this.props.onSubmit(this.state.key, true);
    }

    render() {
        return (

            <div className="form">


                <label>Devnet wallet: </label>
                <input type="text" name="address" onChange={this.onChange} />

                <Link to="/voting">
                    <button onClick={this.handleSubmit}>Connect</button>
                </Link>


            </div >

        );
    }
}

