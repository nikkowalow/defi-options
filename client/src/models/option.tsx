export type DefiOption = {
    strike: number,
    call: Call,
    put: Put
}

type OptionType = {
    delta: number,
    gamma: number,
    vega: number,
    theta: number
}

export type Call = OptionType & {callPrice: number}

export type Put = OptionType & {putPrice: number}




