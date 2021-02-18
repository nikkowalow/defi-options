import * as config from '../configs/config.json';
import rp from 'request-promise';

export class Coin {
    id: string;
    logo: string;
    name: string;
    symbol: string;
    description: string;
    price: number = 0;
    instrument: {} = {};
    data: {} = {}; // rename later

    constructor(id: string, logo: string, name: string, symbol: string, description: string, instrument: {}, data: {}) {
        this.id = id;
        this.logo = logo;
        this.name = name;
        this.symbol = symbol;
        this.description = description;
        this.instrument = instrument;
        this.data = data; //rename later
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
                console.log("API call response:", response.data[this.id]);
            }).catch((err: any) => {
                completion(false)
                console.log("API call error:", err.message);
            });
    }

    getOptionInfo = async (instrumentName: string) => {
        const requestOptions = {
            method: 'GET',
            uri: "https://test.deribit.com/api/v2/public/ticker?instrument_name=" + instrumentName,
            "jsonrpc": "2.0",
            json: true
        };
        await rp(requestOptions)
            .then((response) => {
                this.instrument = response['result'];
            }).catch((err) => {
                console.log("API call error getOptionInfo():", err.message);
            });
    }

    async getOptionChain() {
        const requestOptions = {
            method: 'GET',
            uri: "https://test.deribit.com/api/v2/public/get_book_summary_by_currency?currency=" + this.symbol + "&kind=option",
            "jsonrpc": "2.0",
            json: true
        };
        await rp(requestOptions)
            .then((response) => {
                this.data = response['result'];
            }).catch((err) => {
                console.log("API call error getOptionChain():", err.message);
            });
    }

    static parse(object: Object): Coin {
        let coin: Coin = object as Coin;
        return new Coin(coin.id, coin.logo, coin.name, coin.symbol, coin.description, coin.instrument, coin.data)
    }
}