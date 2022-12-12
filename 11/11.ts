import { Console } from "console"
import { readFileSync } from "fs"
import * as tools from "./tools"

// Parse input
const fileName: string = './11/input'
const chunks: string[] = readFileSync(fileName, 'utf-8').split('\n\n')

// Monkey object to hold each chunk of input data and described operations
class Monkey {
    private id: number
    private items: number[]
    private operation: string
    public divisor: number
    private targetIfTrue: number
    private targetIfFalse: number
    public inspected: number

    // Initialize a new Monkey given a chunk of input
    public constructor(text: string) {
        const lines = text.split('\n')
        this.id = Number(lines[0].split(' ')[1].split(':')[0])
        this.items = Array.from(lines[1].split('Starting items: ')[1].split(',').map(x => parseInt(x)))
        this.operation = lines[2].split('Operation: new = ')[1]
        this.divisor = Number(lines[3].split('Test: divisible by ')[1])
        this.targetIfTrue = Number(lines[4].split('If true: throw to monkey ')[1])
        this.targetIfFalse = Number(lines[5].split('If false: throw to monkey ')[1])
        this.inspected = 0
    }

    public operate(worryFactor: number, LCM: number) {
        const operation = this.operation
        this.items = this.items.map(function (old) {
            return Math.floor(eval(operation) / worryFactor % LCM)
        })
    }

    public test(): number[] {
        let targets: number[] = []
        let divisor = this.divisor
        let targetIfTrue = this.targetIfTrue
        let targetIfFalse = this.targetIfFalse
        this.inspected += this.items.length
        this.items.forEach(function (item) {
            if (item % divisor == 0)
                targets.push(targetIfTrue)
            else
                targets.push(targetIfFalse)
        })
        return targets
    }

    public throw(target: Monkey) {
        let items_reverse = this.items.reverse()
        let item = items_reverse.pop()
        this.items = items_reverse.reverse()
        target.items.push(item)
    }

    // debug helper function to print this Monkey's items
    public printItems() {
        console.log("Monkey", this.id, ":", this.items)
    }

    // debug helper function to print this Monkey's inspection count
    public printInspected() {
        console.log("Monkey", this.id, "inspected items", this.inspected, "times")
    }

    // debug helper function to print all of this Monkey's data
    public printAll() {
        console.log("id:", this.id)
        console.log("items:", this.items)
        console.log("operation:", this.operation)
        console.log("divisor:", this.divisor)
        console.log("targetIfTrue:", this.targetIfTrue)
        console.log("targetIfFalse:", this.targetIfFalse)
        console.log("inspected:", this.inspected)
        console.log('')
    }
}

// Part 1
var part1: number = solve(20, 3)
console.log("Part 1:", part1)

// Part 2
var part2: number = solve(10000, 1)
console.log("Part 2:", part2)

// solve() is the main program logic for both parts
function solve(rounds: number, worryFactor: number): number {
    var monkeys: Monkey[] = []
    chunks.forEach(function (chunk) { monkeys.push(new Monkey(chunk)) })
    var LCM = monkeys.map(x => x.divisor).reduce((a, b) => a * b)   // LCM of all monkeys' divisors (primes) to help make operate() results a manageable size
    for (let n = 1; n <= rounds; n++) {
        monkeys.forEach(function (monkey) {
            monkey.operate(worryFactor, LCM)
            let targets = monkey.test()
            targets.forEach(function (target) {
                monkey.throw(monkeys[target])
            })
        })
    }
    return monkeys.map(x => x.inspected).sort((a, b) => b - a).slice(0, 2).reduce((a, b) => a * b)
}

// debug helper function to print all Monkeys' items
function showItems(monkeys: Monkey[]) {
    monkeys.forEach(function (monkey) {
        monkey.printItems()
    })
}

// debug helper function to print all Monkeys' inspection counts
function showInspected(monkeys: Monkey[]) {
    monkeys.forEach(function (monkey) {
        monkey.printInspected()
    })
}