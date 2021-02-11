export class OptionModel {
    public strike: number;
    public call: CallModel;
    public put: PutModel;

    constructor(strike: number, call: CallModel, put: PutModel) {
        this.strike = strike;
        this.call = call;
        this.put = put;
    }
}

abstract class OptionTypeModel {
    optionPrice: number;
    delta: number = 0;
    gamma: number = 0;
    vega: number = 0;
    theta: number = 0;

    constructor(optionPrice: number) {
        this.optionPrice = optionPrice;
    }

    generateGreeks(optionPrice: number): void {
        
    }
}

export class CallModel extends OptionTypeModel {
    
}

export class PutModel extends OptionTypeModel {

}



    

