import { Console } from "console"
import { readFileSync } from "fs"
import * as tools from "./tools"

// Parse input
const fileName: string = './25/input'
const lines: string[] = readFileSync(fileName, 'utf-8').split('\n')

// Functions
// snafu_to_dec() converts a base-5 SNAFU number to base-10 decimal
const snafu_to_dec = (x) => {
    let n = 0
    for (let i = 0; i < x.length; i++) {
        n += snafu_to_val[x[i]]*5**(x.length - 1 - i)
    }
    return n
}

// dec_to_snafu() converts a base-10 decimal number to base-5 SNAFU
const dec_to_snafu = (x: number): string => {
    if (x === 0) return ""
    switch (x % 5) {
        case (0): return dec_to_snafu(Math.floor(x / 5)) + "0"
        case (1): return dec_to_snafu(Math.floor(x / 5)) + "1"
        case (2): return dec_to_snafu(Math.floor(x / 5)) + "2"
        case (3): return dec_to_snafu((x + 2) / 5) + "="
        case (4): return dec_to_snafu((x + 1) / 5) + "-"
        default: throw new Error("Invalid input for dec_to_snafu()")
    }
}

// Part 1
const snafu_to_val = {
    "2": 2,
    "1": 1,
    "0": 0,
    "-": -1,
    "=": -2,
}
const part1:string = dec_to_snafu(lines.map(x => snafu_to_dec(x)).reduce((a, b) => a + b))
console.log("Part 1:", part1)