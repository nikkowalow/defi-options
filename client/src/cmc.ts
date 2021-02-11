import * as rp from 'request-promise';

   let apiKey = "7c7ad878-dfbf-4ace-8758-9240ecee31a7";


    const requestOptions = {
        method: "GET",
        uri: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
        qs: {
            start: "1",
            limit: "25",
            convert: "USD",
        },
        headers: {
            "X-CMC_PRO_API_KEY": "7c7ad878-dfbf-4ace-8758-9240ecee31a7",
        },
        json: true,
        gzip: true,
    };

    rp(requestOptions)
    .then((response) => {
    console.log("API call response:", response);
}).catch ((err: any) => {
    console.log("API call error:", err.message);
});