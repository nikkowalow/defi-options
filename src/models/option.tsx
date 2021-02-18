export class OptionChainModel {
    expirationDate: Date;
    options: OptionModel[] = [] as OptionModel[];
    
    constructor(expirationDate: Date, options?: OptionModel[]) {
        this.expirationDate = expirationDate;
        this.options = options?options:this.options;
    }

    generateOptions(interval: number) {

    }
}

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

    //Implemented per call/pull
    abstract calculateFairPrice(): number;

    //Implemented per call/pull
    abstract calculateDelta(): number;

    calculateGamma(): number {
        return -1;
    }

    //Vega calculated from partial derivative of black scholes, same for calls and puts
    calculateVega(): number {
        return -1;
    }

    abstract calculateTheta(): number;

    abstract calculateRho(): number;
}

export class CallModel extends OptionTypeModel {
    //Black scholes for calls
    calculateFairPrice(): number {
        return -1;
    }

    calculateDelta(): number {
        return -1;
    }

    calculateTheta(): number {
        return -1;
    }

    calculateRho(): number {
        return -1;
    }
}

export class PutModel extends OptionTypeModel {
    //Black scholes for puts
    calculateFairPrice(): number {
        return -1;
    }

    calculateDelta(): number {
        return -1;
    }

    calculateTheta(): number {
        return -1;
    }

    calculateRho(): number {
        return -1;
    }
}