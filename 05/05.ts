import { Console } from "console"
import { readFileSync } from "fs"
import * as tools from "./tools"

// Parse input
const fileName: string = './05/input'
const lines: string = readFileSync(fileName, 'utf-8')
const stackCount: number = parseInt(lines.split('\n\n')[0].split('\n').reverse()[0].at(-2))
var cratelines = lines.split('\n\n')[0].split('\n').reverse().slice(1,)
var steps = lines.split('\n\n')[1].split('\n').map(x => x.split(' ').map(y => parseInt(y)))
var stacks = []


// Part 1
var part1 = ""

for (let i = 1; i <= stackCount; i++)
    stacks[i] = []

cratelines.forEach(function(crateline) {
    let position = 0
    for (let i = 1; i <= stackCount; i++) {
        position = (i == 1) ? position + 1 : position + 3
        if (crateline.charAt(position) != ' ')
            stacks[i].push(crateline.charAt(position))
        position++
    }
})

steps.forEach(function(step) {
    let count = step[1]
    let source = step[3]
    let destination = step[5]
    for (let i = 0; i < count; i++) {
        let item = stacks[source].pop(-1)
        stacks[destination].push(item)
    }
})

for (let i = 1; i <= stackCount; i++)
    if (stacks[i].length > 0)
        part1 += stacks[i].at(-1)

console.log("Part 1:", part1)


// Part 2
var part2 = ""

for (let i = 1; i <= stackCount; i++)
    stacks[i] = []

cratelines.forEach(function(crateline) {
    let position = 0
    for (let i = 1; i <= stackCount; i++) {
        position = (i == 1) ? position + 1 : position + 3
        if (crateline.charAt(position) != ' ')
            stacks[i].push(crateline.charAt(position))
        position++
    }
})

steps.forEach(function(step) {
    let count = step[1]
    let source = step[3]
    let destination = step[5]
    let block = []
    for (let i = 0; i < count; i++) {
        let item = stacks[source].pop(-1)
        block.push(item)
    }
    block.reverse()
    block.forEach(function(item) {
        stacks[destination].push(item)
    })
})

for (let i = 1; i <= stackCount; i++)
    if (stacks[i].length > 0)
        part2 += stacks[i].at(-1)

console.log("Part 2:", part2)