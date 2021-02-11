import * as config from '../configs/config.json';
import rp from 'request-promise';

export class Coin {
    id: string;
    logo: string;
    name: string;
    symbol: string;
    description: string;
    price: number = 0;

    constructor(id: string, logo: string, name: string, symbol: string, description: string) {
        this.id = id;
        this.logo = logo;
        this.name = name;
        this.symbol = symbol;
        this.description = description;
    }

    quote(completion: (status: boolean) => void) {
        const requestOptions = {
            method: 'GET',
            uri: config.CMC.URL.quote,
            qs: {
                id: this.id
            },
            headers: {
                "X-CMC_PRO_API_KEY": config.CMC.apiKey
            },
            json: true,
            gzip: true,
        };
        rp(requestOptions)
            .then((response) => {
                this.price = Math.round(response.data[this.id].quote.USD.price * 100) / 100
                completion(true)
                console.log('quote: ' + this.price)
                console.log("API call response:", response.data[this.id]);
            }).catch((err: any) => {
                completion(false)
                console.log("API call error:", err.message);
            });
    }

    static parse(object: Object): Coin {
        let coin: Coin = object as Coin;
        return new Coin(coin.id, coin.logo, coin.name, coin.symbol, coin.description)
    } 
}