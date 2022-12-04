import { Console } from "console"
import { readFileSync } from "fs"

// Parse input
const fileName: string = './04/input'
const lines: string = readFileSync(fileName, 'utf-8')
const assignments = lines.split('\n')

// Part 1
var part1 = 0
assignments.forEach(function(assignment) {
    const a = assignment.split(',')[0].split('-').map(x => parseInt(x))
    const b = assignment.split(',')[1].split('-').map(x => parseInt(x))
    const arange = range(a[0], a[1])
    const brange = range(b[0], b[1])
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
    const arange = Array.from(Array(a[1] - a[0] + 1).keys()).map(x => x + a[0])
    const brange = Array.from(Array(b[1] - b[0] + 1).keys()).map(x => x + b[0])
    const hasOverlap = brange.some(function(val) { return arange.indexOf(val) >= 0 }) || arange.some(function(val) { return brange.indexOf(val) >= 0 })
    if (hasOverlap)
        part2++
})
console.log("Part 2:", part2)

// Function range() returns an array of the range between two numbers
function range(start, end) {
    return Array.from(Array(end - start + 1).keys()).map(x => x + start)
}