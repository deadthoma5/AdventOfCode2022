import { Console } from "console"
import { readFileSync } from "fs"

// Parse input
const fileName: string = './03/input'
const lines: string = readFileSync(fileName, 'utf-8')
var rucksacks = lines.split('\n')


// Part 1
var part1 = 0

rucksacks.forEach(function (rucksack) {
    let left = rucksack.slice(0, rucksack.length/2)
    let right = rucksack.slice(rucksack.length/2)
    let intersection = intersect(left, right)

    part1 += priority(intersection)
})

console.log("Part 1:", part1)


// Part 2
var part2 = 0
var chunk = 3
var groups = []

for (let n = 0; n < rucksacks.length / chunk; n++) {
    groups.push(rucksacks.slice(n * chunk, n * chunk + 3))
}

groups.forEach(function (group) {
    let intersection = group.reduce(function(a, b) {
        return intersect(a, b)
    })
    part2 += priority(intersection)
})

console.log("Part 2:", part2)

// Function intersect() finds the intersection of two sets
function intersect(left, right) {
    let setA = new Set(left.split(""))
    let setB = new Set(right.split(""))
    const intersection = new Set(
        [...setA].filter(element => setB.has(element))
    )
    return [...intersection].join("")
}

// Function priority() translates a character into a priority number
function priority(c) {
    if (c == c.toLowerCase())
        return c.charCodeAt(0) - 'a'.charCodeAt(0) + 1
    else if (c == c.toUpperCase())
        return c.charCodeAt(0) - 'A'.charCodeAt(0) + 26 + 1
    else
        return 0
}