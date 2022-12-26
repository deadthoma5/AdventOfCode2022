import { Console } from "console"
import { readFileSync } from "fs"
import * as tools from "./tools"

// Functions
// parse() returns state arrays costs[] and productions[] from input
// array order is: geode, obsidian, clay, ore
// last row is null cost/production to represent if it's more optimal to wait and do nothing for a cycle
const parse = (line: string): [number, number[][], number[][]] => {
    const [i, a, b, c, d, e, f] = line.match(pattern).map(x => Number(x))
    const costs: number[][] = [
        [0, 0, 0, a],
        [0, 0, 0, b],
        [0, 0, d, c],
        [0, f, 0, e],
        [0, 0, 0, 0]
    ]
    const productions:number[][] = [
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [0, 1, 0, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0]
    ]
    return [i, costs, productions]
}

// sort criteria for state arrays by index, in ascending order:
// [0, 0, 0, 1, 0, 0, 0] is greater than [0, 0, 0, 0, 2, 0, 0, 0]
const sortArray = (a, b) => {
    for (let i = 0; i < a.length; i++) {
        if (a[i] == b[i])
            continue
        else
            return (a[i] - b[i])
    }
    return 0
}

// prune() returns sorted state arrays and pruned to keep top 1000 (need 3000 for test input to work)
// uses heuristic: considers current "have" + next "make", concatenated with next "make"
const prune = (x) => { 
    let unordered = new Map()
    for (let a of x) {
        let haveplusmake = []
        for (let i=0; i < a[0].length; i++) {
            haveplusmake.push(a[0][i] + a[1][i])
        }
        unordered.set([...haveplusmake, ...a[1]], a)
    }

    let keys = [...unordered.keys()]
    keys.sort(sortArray)

    let ordered = []
    for (let key of keys) {
        ordered.push(unordered.get(key))
    }

    let sliced = ordered.slice(-1000)    // need about top 3000 for test input

    return sliced
}

// simulate() runs the simulation for possible outcomes, keeping the top 1000 (or 3000 for test input) outcomes per cycle
// returns the best outcome's geode count
const simulate = (costs: number[][], productions: number[][], time: number) => {
    let todo = [[[0, 0, 0, 0], [0, 0, 0, 1]]]
    for (let t = time; t > 0; t--) {
        let todo_ = []
        for (let [have, make] of todo) {
            for (let i = 0; i < costs.length; i++ ) {
                let cost = costs[i]
                let production = productions[i]
                if (cost.every((_, idx) => cost[idx] <= have[idx])) {
                    let have_ = []
                    let make_ = []
                    for (let j = 0; j < have.length; j++ ) {
                        have_[j] = have[j] + make[j] - cost[j]
                        make_[j] = make[j] + production[j]
                    }
                    todo_.push([have_, make_])
                }
            }
        }
        todo = prune(todo_)
    }
    return todo.slice(-1)[0][0][0]
}

// Parse input
const fileName: string = './19/input'
const lines: string[] = readFileSync(fileName, 'utf-8').split('\n')
const pattern = /\d+/g

// Part 1
var part1 = 0
for (let [i, costs, productions] of lines.map(line => parse(line))) {
    const geodes = simulate(costs, productions, 24)
    part1 += i * geodes
}
console.log("Part 1:", part1)

// Part 2
var part2 = 1
for (let [i, costs, productions] of lines.map(line => parse(line))) {
    const geodes = simulate(costs, productions, 32)
    if (i < 4)
        part2 *= geodes
}
console.log("Part 2:", part2)