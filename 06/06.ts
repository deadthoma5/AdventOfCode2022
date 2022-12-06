import { Console } from "console"
import { readFileSync } from "fs"
import * as tools from "./tools"

// Parse input
const fileName: string = './06/input'
const input: string = readFileSync(fileName, 'utf-8')

// Part 1
const part1 = solve(input, 4)
console.log("Part 1:", part1)

// Part 2
const part2 = solve(input, 14)
console.log("Part 2:", part2)

// isAllUnique() determines if all characters in a given string are unique
function isAllUnique(window: Array<string>, limit: number) {
    const windowset = new Set(window)
    return (windowset.size == limit) ? true : false
}

// solve() slides a window across a string then evaluates if all characters in the window are unique
function solve(input: string, limit: number) {
    let window = []
    for (let i = 0; i < input.length; i++) {
        if (window.length == limit && isAllUnique(window, limit))
            return i
        window.push(input[i])
        if (window.length > limit)
            window = window.slice(1)
    }
    return 0
}