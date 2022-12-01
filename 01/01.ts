import { readFileSync } from "fs"

const fileName: string = './01/input'
const lines: string = readFileSync(fileName, 'utf-8')

var elves = lines.split('\n\n')
var calories = []

elves.forEach(function (elf) {
    let sum = 0
    elf.split('\n').forEach(function (item) {
        sum = sum + parseInt(item)
    })
    calories.push(sum)
})

// Part 1: top calorie
var topOne = calories.sort((a,b) => b-a).slice(0,1)
var part1 = topOne.reduce(function(a, b) {
    return a + b
})
console.log("Part 1:", part1)

// Part 2: sum of top 3 calories
var topThree = calories.sort((a,b) => b-a).slice(0,3)
var part2 = topThree.reduce(function(a, b) {
    return a + b
})
console.log("Part 2:", part2)