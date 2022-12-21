import { Console } from "console"
import { readFileSync } from "fs"
import * as tools from "./tools"

// Parse input
const fileName: string = './21/input'
const input = new Map<string, string>(readFileSync(fileName, 'utf-8').split('\n').map(line => line.split(": ") as any))
var monkeys = new Map<string, string>()

// Part 1
monkeys = input
var part1 = eval(replace(monkeys, monkeys.get("root")))
console.log("Part 1:", part1)

// Part 2 (uses Nerdamer to solve an algebraic expression for unknown "x")
monkeys = input
monkeys.set("humn", "x")
var part2 = JSON.parse(require("nerdamer/all.min").solve(
    replace(monkeys, monkeys.get("root").replace("+", "=")),
    "x").text())[0]
console.log("Part 2:", part2)

// replace() recursively replaces monkey names with their corresponding expression, or simply returns the number if it's a number
function replace(monkeys: Map<string, string>, value: string): string {
    if (value.match(/[+-/*=]/) == null) {
        return value
    } else {
        let pieces = value.split(" ")
        return '( ' + replace(monkeys, monkeys.get(pieces[0])) + ' ) ' + pieces[1] + ' ( ' + replace(monkeys, monkeys.get(pieces[2])) + ' )'
    }
}