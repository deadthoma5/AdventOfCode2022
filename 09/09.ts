import { Console } from "console"
import { readFileSync } from "fs"
import * as tools from "./tools"

// Parse input
const fileName: string = './09/input'
const lines: string[] = readFileSync(fileName, 'utf-8').split('\n')

// Part 1
var part1 = solve(lines, 2)
console.log("Part 1:", part1)

// Part 2
var part2 = solve(lines, 10)
console.log("Part 2:", part2)

// solve() moves rope per input and rules, and returns number of visited positions by rope tail
function solve(lines: string[], knots: number) {
    // initialize rope and its knots at the origin
    var visited = new Set()
    let rope = []
    for (let n = 0; n < knots; n++) {
        rope.push([0, 0])
    }

    lines.forEach(function (step) {
        let direction = step.split(' ')[0]
        let steps = parseInt(step.split(' ')[1])

        for (let i = 0; i < steps; i++) {
            // update rope head
            if (direction == 'R')
                rope[0][0]++
            else if (direction == 'L')
                rope[0][0]--
            else if (direction == 'U')
                rope[0][1]++
            else
                rope[0][1]--

            // update rope tail
            for (let n = 1; n < knots; n++) {
                let dx = rope[n][0] - rope[n-1][0]
                let dy = rope[n][1] - rope[n-1][1]
                if (dx == 0 || dy == 0) {
                    if (Math.abs(dx) >= 2)
                        rope[n][0] -= Math.sign(dx)
                    if (Math.abs(dy) >= 2)
                        rope[n][1] -= Math.sign(dy)
                }
                else if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                    rope[n][0] -= Math.sign(dx)
                    rope[n][1] -= Math.sign(dy)
                }
            }

            // add rope tail position to visited set
            visited.add(rope[knots - 1][0].toString() + "," + rope[knots - 1][1].toString())
        }
    })

    // return the number of positions visited by rope tail
    return visited.size
}
