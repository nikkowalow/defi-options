"use strict";
exports.__esModule = true;
var rp = require("request-promise");
var apiKey = "7c7ad878-dfbf-4ace-8758-9240ecee31a7";
var requestOptions = {
    method: "GET",
    uri: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
    qs: {
        start: "1",
        limit: "25",
        convert: "USD"
    },
    headers: {
        "X-CMC_PRO_API_KEY": "7c7ad878-dfbf-4ace-8758-9240ecee31a7"
    },
    json: true,
    gzip: true
};
rp(requestOptions)
    .then(function (response) {
    console.log("API call response:", response);
})["catch"](function (err) {
    console.log("API call error:", err.message);
});
