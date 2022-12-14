import { Console } from "console"
import { readFileSync } from "fs"
import * as tools from "./tools"

// Parse input
const fileName: string = './13/input'
const chunks: any[] = readFileSync(fileName, 'utf-8').split('\n\n')

// Part 1
var part1 = 0
for (let n = 1; n <= chunks.length; n++) {
    let left = eval(chunks[n - 1].split('\n')[0])     // don't hack me bro
    let right = eval(chunks[n - 1].split('\n')[1])    // don't hack me bro
    part1 += (compare(left, right) < 0) ? n : 0
}
console.log("Part 1:", part1)

// Part 2
var packets: any[] = []
chunks.forEach(function (chunk) {
    packets.push(JSON.parse(chunk.split('\n')[0]))
    packets.push(JSON.parse(chunk.split('\n')[1]))
})
const divider1 = JSON.parse("[[2]]")
const divider2 = JSON.parse("[[6]]")
packets.push(divider1)
packets.push(divider2)
packets.sort(compare)
const indexOfDivider1: number = packets.indexOf(divider1) + 1
const indexOfDivider2: number = packets.indexOf(divider2) + 1
const part2 = indexOfDivider1 * indexOfDivider2
console.log("Part 2:", part2)

// compare() compares left/right numbers or arrays. Returns -1 if correct order (left is smaller/fewer) and +1 if incorrect order (right is smaller/fewer)
function compare(left: any, right: any): number {
    if (Number.isInteger(left) && Number.isInteger(right))
        return Math.sign(left - right)    // -1 if left is smaller, +1 if right is smaller
    else if (Number.isInteger(left) && Array.isArray(right))
        left = [left]
    else if (Array.isArray(left) && Number.isInteger(right))
        right = [right]

    for (let i = 0; i < left.length; i++) {
        if (i >= right.length)
            return 1    // right ran out of items first
        else {
            const result = compare(left[i], right[i])
            if (result !== 0)
                return result
        }
    }

    if (left.length === right.length)
        return 0     // go on to the next index
    else
        return -1    // left ran out of items first
}