import { Console } from "console"
import { readFileSync } from "fs"
import * as tools from "./tools"

// Parse input
const fileName: string = './##/input_test'
const lines: string[] = readFileSync(fileName, 'utf-8').split('\n')

// Part 1
var part1 = 0
console.log("Part 1:", part1)

// Part 2
var part2 = 0
console.log("Part 2:", part2)