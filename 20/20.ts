import { Console } from "console"
import { readFileSync } from "fs"
import * as tools from "./tools"

// Parse input
const fileName: string = './20/input'
var numbers: number[] = readFileSync(fileName, 'utf-8').split('\n').map(x => Number(x))
var indices = tools.range(0, numbers.length - 1)


// Part 1
for (let i of tools.range(0, numbers.length - 1)) {
    let j = indices.indexOf(i)
    indices.splice(j, 1)
    indices.splice((j + numbers[i]) % indices.length, 0, i)
}

let zero_index = indices.indexOf(numbers.indexOf(0))

let part1 = [numbers[indices[(zero_index + 1000) % numbers.length]],
    numbers[indices[(zero_index + 2000) % numbers.length]],
    numbers[indices[(zero_index + 3000) % numbers.length]]]
    .reduce((a, b) => a + b)

console.log("Part 1:", part1)

// Part 2
let decryption_key = 811589153
numbers = numbers.map(x => x * decryption_key)
indices = tools.range(0, numbers.length - 1)

for (let n = 0; n < 10; n++) {
    for (let i of tools.range(0, numbers.length - 1)) {
        let j = indices.indexOf(i)
        indices.splice(j, 1)
        indices.splice((j + numbers[i]) % indices.length, 0, i)
    }
}

zero_index = indices.indexOf(numbers.indexOf(0))

let part2 = [numbers[indices[(zero_index + 1000) % numbers.length]],
    numbers[indices[(zero_index + 2000) % numbers.length]],
    numbers[indices[(zero_index + 3000) % numbers.length]]]
    .reduce((a, b) => a + b)

console.log("Part 2:", part2)