import { Console } from "console"
import { readFileSync } from "fs"
import * as tools from "./tools"

// Parse input
const fileName: string = './04/input'
const lines: string = readFileSync(fileName, 'utf-8')
const assignments = lines.split('\n')

// Part 1
var part1 = 0
assignments.forEach(function(assignment) {
    const a = assignment.split(',')[0].split('-').map(x => parseInt(x))
    const b = assignment.split(',')[1].split('-').map(x => parseInt(x))
    const arange = tools.range(a[0], a[1])
    const brange = tools.range(b[0], b[1])
    const isSubset = brange.every(function(val) { return arange.indexOf(val) >= 0 }) || arange.every(function(val) { return brange.indexOf(val) >= 0 })
    if (isSubset)
        part1++
})
console.log("Part 1:", part1)

// Part 2
var part2 = 0
assignments.forEach(function(assignment) {
    const a = assignment.split(',')[0].split('-').map(x => parseInt(x))
    const b = assignment.split(',')[1].split('-').map(x => parseInt(x))
    const arange = tools.range(a[0], a[1])
    const brange = tools.range(b[0], b[1])
    const hasOverlap = brange.some(function(val) { return arange.indexOf(val) >= 0 }) || arange.some(function(val) { return brange.indexOf(val) >= 0 })
    if (hasOverlap)
        part2++
})
console.log("Part 2:", part2)