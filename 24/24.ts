import { Console } from "console"
import { readFileSync } from "fs"
import math = require("mathjs")
import * as tools from "./tools"


// Common variables
const dir = {
    '^': math.complex('-1'),    // up:    -1
    'v': math.complex('1'),     // down:  +1
    '<': math.complex('-i'),    // left:  -i
    '>': math.complex('i'),     // right: +i
    'x': math.complex('0')      // do nothing
}


// Parse input
const fileName: string = './24/input'
const grid: string[] = readFileSync(fileName, 'utf-8').split('\n')

const height: number = grid.length - 2
const width: number = grid[0].length - 2

const start: math.Complex = math.complex(-1, 0)
const finish: math.Complex = math.complex(height, width - 1)

var blizzards = new Map<string, Set<math.Complex>>()
for (let d in dir) {
    let bliz_ = new Set<math.Complex>()
    for (let x = 0; x < height; x++) {
        for (let y = 0; y < width; y++) {
            if (grid[x + 1][y + 1] == d) {
                bliz_.add(math.complex(x, y))
            }
        }
    }
    blizzards.set(d, bliz_)
}


// Functions
// wrap() returns the coordinates of a blizzard after it wraps around the edges
const wrap = (p: math.Complex) => {
    return math.complex((p.re + height) % height, (p.im + width) % width)    // modulus of negative number has unexpected result in JavaScript
}

// evolveBlizzards() increments all blizzard positions by one unit in its facing direction
const evolveBlizzards = () => {
    for (let d in dir) {
        let bliz_ = new Set<math.Complex>()
        for (let b of blizzards.get(d)) {
            let b_ = wrap(math.add(b, dir[d]))
            bliz_.add(b_)
        }
        blizzards.set(d, bliz_)
    }  
}

// getBlizards() returns a set of all blizzard positions
const getBlizzards = (): Set<math.Complex> => {
    let blizSet_ = new Set<string>()
    for (let d in dir) {
        for (let b of blizzards.get(d)) {
            if (!blizSet_.has(b.toString()))
                blizSet_.add(b.toString())
        }
    }

    let blizSet = new Set<math.Complex>()
    blizSet_.forEach(b => blizSet.add(math.complex(b)))
    return blizSet
}

// isInBounds() returns true if a proposed position is within legal bounds, and false otherwise
const isInBounds = (p: math.Complex): boolean => {
    if (p.equals(start) || p.equals(finish)) {
        return true
    } else if (0 <= p.re && p.re < height && 0 <= p.im && p.im < width) {
        return true
    }
    else
        return false
}

//getValidMoves() returns a set of possible next positions (not a border or blizzard) from a given position
const getValidMoves = (p: math.Complex): Set<math.Complex> => {
    let nextMoves_ = new Set<string>()
    let blizSet = getBlizzards()

    for (let d in dir) {
        let next_p = math.add(p, dir[d])
        if ([...blizSet].every(b => !b.equals(next_p)) && isInBounds(next_p))
            nextMoves_.add(next_p.toString())
    }

    let nextMoves = new Set<math.Complex>()
    nextMoves_.forEach(m => nextMoves.add(math.complex(m)))
    return nextMoves
}


// Main program loop
var part1: number
var part2: number
var entrances: math.Complex[] = [start, finish, start]
var entrance = entrances.pop()
var goals: math.Complex[] = [finish, start, finish]
var goal = goals.pop()
var time: number = 0
var queue = new Set<math.Complex>()
queue.add(entrance)
var isDone = false

while (queue.size > 0) {
    time++
    evolveBlizzards()

    let nextQueue_ = new Set<string>()
    queue.forEach(q => {
        let nextMoves = getValidMoves(q)
        nextMoves.forEach(m => {
            if (m.equals(goal)) {
                isDone = true
                return
            }
            nextQueue_.add(m.toString())
        })
    })
    let nextQueue = new Set<math.Complex>()
    nextQueue_.forEach(q => nextQueue.add(math.complex(q)))
    queue = nextQueue
    //console.log("time:", time, ", queue size:", queue.size)
    //console.log()

    if (isDone && goals.length > 0) {
        if (goal.equals(finish)) {
            part1 = time    // Part 1
        }
        queue = new Set<math.Complex>()
        entrance = entrances.pop()
        goal = goals.pop()
        queue.add(entrance)
        isDone = false
        continue
    } else if (isDone && goals.length == 0) {
        part2 = time    // Part 2
        break
    }
}

// Parts 1 + 2
console.log("Part 1:", part1)
console.log("Part 2:", part2)