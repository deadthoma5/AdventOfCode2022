import { Console } from "console"
import { readFileSync } from "fs"
import * as tools from "./tools"

// Parse input
const fileName: string = './10/input'
const lines: string[] = readFileSync(fileName, 'utf-8').split('\n')

// Common program logic to both parts
var register: number[] = []
var cycle: number = 1
var X: number = 1
lines.forEach(function (line) {
    let instruction = line.split(' ')[0]
    let value = parseInt(line.split(' ')[1])
    if (instruction == "noop") {
        register[cycle] = X
        cycle += 1
    }
    else if (instruction == "addx") {
        register[cycle] = X
        cycle += 1
        register[cycle] = X
        X += value
        cycle += 1
    }
})

// Part 1
var cycles: number[] = [20, 60, 100, 140, 180, 220]
var part1: number = cycles.map(function(c) {return c * register[c]}).reduce(function(a, b) {return a + b})
console.log("Part 1:", part1)

// Part 2
console.log("Part 2: (read letters below)")
for (let row = 0; row < 6; row++) {
    let output: string = ""
    for (let col = 0; col < 40; col++) {
        let cycle = (row*40)+(col+1)
        output += (col - 1 <= register[cycle] && register[cycle] <= col + 1) ? "#" : "."
    }
    console.log(output)
}
