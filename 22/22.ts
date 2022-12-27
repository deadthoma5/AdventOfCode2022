import { Console } from "console"
import { readFileSync } from "fs"
import math = require("mathjs")
import * as tools from "./tools"

// Parse input
const fileName: string = './22/input'
const grid: string[] = readFileSync(fileName, 'utf-8').split('\n\n')[0].split('\n')
const instructions: string = readFileSync(fileName, 'utf-8').split('\n\n')[1]
const pattern = /\d+|[RL]/g

// Functions
// wrap() returns the correct position per wrapping around map edges per instructions
const wrap = (part: number, pos: math.Complex, dir: math.Complex) => {
    let x: number = pos.re    // down = +1
    let y: number = pos.im    // right = +i
    let blockSize: number

    if (part == 1 && fileName === './22/input_test') {    // part 1 & test input
        blockSize = 4
        switch (true) {
            case (dir.equals(math.complex('i')) && Math.floor(x/blockSize) == 0): return [math.complex(x, blockSize * 2), dir]
            case (dir.equals(math.complex('i')) && Math.floor(x/blockSize) == 1): return [math.complex(x, blockSize * 0), dir]
            case (dir.equals(math.complex('i')) && Math.floor(x/blockSize) == 2): return [math.complex(x, blockSize * 2), dir]
            case (dir.equals(math.complex('-i')) && Math.floor(x/blockSize) == 0): return [math.complex(x, blockSize * 3 - 1), dir]
            case (dir.equals(math.complex('-i')) && Math.floor(x/blockSize) == 1): return [math.complex(x, blockSize * 3 - 1), dir]
            case (dir.equals(math.complex('-i')) && Math.floor(x/blockSize) == 2): return [math.complex(x, blockSize * 4 - 1), dir]
            case (dir.equals(math.complex('1')) && Math.floor(y/blockSize) == 0): return [math.complex(blockSize * 1, y), dir]
            case (dir.equals(math.complex('1')) && Math.floor(y/blockSize) == 1): return [math.complex(blockSize * 1, y), dir]
            case (dir.equals(math.complex('1')) && Math.floor(y/blockSize) == 2): return [math.complex(blockSize * 0, y), dir]
            case (dir.equals(math.complex('1')) && Math.floor(y/blockSize) == 3): return [math.complex(blockSize * 2, y), dir]
            case (dir.equals(math.complex('-1')) && Math.floor(y/blockSize) == 0): return [math.complex(blockSize * 2 - 1, y), dir]
            case (dir.equals(math.complex('-1')) && Math.floor(y/blockSize) == 1): return [math.complex(blockSize * 2 - 1, y), dir]
            case (dir.equals(math.complex('-1')) && Math.floor(y/blockSize) == 2): return [math.complex(blockSize * 3 - 1, y), dir]
            case (dir.equals(math.complex('-1')) && Math.floor(y/blockSize) == 3): return [math.complex(blockSize * 3 - 1, y), dir]
            default: {
                //console.log("wrap() => error at pos:", pos, ", dir:", dir)
                throw new Error("Unknown edge condition in wrap()")
            }
        }
    } else if (part == 1 && fileName === './22/input') {    // part 1 & real input
        blockSize = 50
        switch (true) {
            case (dir.equals(math.complex('i')) && Math.floor(x/blockSize) == 0): return [math.complex(x, blockSize * 1), dir]
            case (dir.equals(math.complex('i')) && Math.floor(x/blockSize) == 1): return [math.complex(x, blockSize * 1), dir]
            case (dir.equals(math.complex('i')) && Math.floor(x/blockSize) == 2): return [math.complex(x, blockSize * 0), dir]
            case (dir.equals(math.complex('i')) && Math.floor(x/blockSize) == 3): return [math.complex(x, blockSize * 0), dir]
            case (dir.equals(math.complex('-i')) && Math.floor(x/blockSize) == 0): return [math.complex(x, blockSize * 3 - 1), dir]
            case (dir.equals(math.complex('-i')) && Math.floor(x/blockSize) == 1): return [math.complex(x, blockSize * 2 - 1), dir]
            case (dir.equals(math.complex('-i')) && Math.floor(x/blockSize) == 2): return [math.complex(x, blockSize * 2 - 1), dir]
            case (dir.equals(math.complex('-i')) && Math.floor(x/blockSize) == 3): return [math.complex(x, blockSize * 1 - 1), dir]
            case (dir.equals(math.complex('1')) && Math.floor(y/blockSize) == 0): return [math.complex(blockSize * 2, y), dir]
            case (dir.equals(math.complex('1')) && Math.floor(y/blockSize) == 1): return [math.complex(blockSize * 0, y), dir]
            case (dir.equals(math.complex('1')) && Math.floor(y/blockSize) == 2): return [math.complex(blockSize * 0, y), dir]
            case (dir.equals(math.complex('-1')) && Math.floor(y/blockSize) == 0): return [math.complex(blockSize * 4 - 1, y), dir]
            case (dir.equals(math.complex('-1')) && Math.floor(y/blockSize) == 1): return [math.complex(blockSize * 3 - 1, y), dir]
            case (dir.equals(math.complex('-1')) && Math.floor(y/blockSize) == 2): return [math.complex(blockSize * 1 - 1, y), dir]
            default: {
                //console.log("wrap() => error at pos:", pos, ", dir:", dir)
                throw new Error("Unknown edge condition in wrap()")
            }
        }
    } else if (part == 2 && fileName === './22/input_test') {    // part 2 & test input
        blockSize = 4
        switch (true) {
            case (dir.equals(math.complex('i')) && Math.floor(x/blockSize) == 0): return [math.complex(blockSize * 2 - 1 - x, blockSize * 4 - 1), math.complex('-i')]
            case (dir.equals(math.complex('i')) && Math.floor(x/blockSize) == 1): return [math.complex(blockSize * 2, blockSize * 5 - 1 - x), math.complex('1')]
            case (dir.equals(math.complex('i')) && Math.floor(x/blockSize) == 2): return [math.complex(blockSize * 3 - 1 - x, blockSize * 3 - 1), math.complex('-i')]
            case (dir.equals(math.complex('-i')) && Math.floor(x/blockSize) == 0): return [math.complex(blockSize * 1, blockSize + x), math.complex('1')]
            case (dir.equals(math.complex('-i')) && Math.floor(x/blockSize) == 1): return [math.complex(blockSize * 3 - 1, blockSize * 5 - 1 - x), math.complex('-1')]
            case (dir.equals(math.complex('-i')) && Math.floor(x/blockSize) == 2): return [math.complex(blockSize * 2 - 1, blockSize * 4 - 1 - x), math.complex('-1')]
            case (dir.equals(math.complex('1')) && Math.floor(y/blockSize) == 0): return [math.complex(blockSize * 3 - 1, blockSize * 3 - 1 - y), math.complex('-1')]
            case (dir.equals(math.complex('1')) && Math.floor(y/blockSize) == 1): return [math.complex(blockSize * 4 - 1 - y, blockSize * 2), math.complex('i')]
            case (dir.equals(math.complex('1')) && Math.floor(y/blockSize) == 2): return [math.complex(blockSize * 2 - 1, blockSize * 3 - 1 - y), math.complex('-1')]
            case (dir.equals(math.complex('1')) && Math.floor(y/blockSize) == 3): return [math.complex(blockSize * 5 - 1 - y, blockSize * 0), math.complex('i')]
            case (dir.equals(math.complex('-1')) && Math.floor(y/blockSize) == 0): return [math.complex(blockSize * 0, blockSize * 3 - 1 - y), math.complex('1')]
            case (dir.equals(math.complex('-1')) && Math.floor(y/blockSize) == 1): return [math.complex(blockSize * (-1) + y, blockSize * 2), math.complex('i')]
            case (dir.equals(math.complex('-1')) && Math.floor(y/blockSize) == 2): return [math.complex(blockSize * 1, blockSize * 3 - 1 - y), math.complex('1')]
            case (dir.equals(math.complex('-1')) && Math.floor(y/blockSize) == 3): return [math.complex(blockSize * 5 - 1 - y, blockSize * 3 - 1), math.complex('-i')]
            default: {
                //console.log("wrap() => error at pos:", pos, ", dir:", dir)
                throw new Error("Unknown edge condition in wrap()")
            }
        }
    } else if (part == 2 && fileName === './22/input') {    // part 2 & real input
        blockSize = 50
        switch (true) {
            case (dir.equals(math.complex('i')) && Math.floor(x/blockSize) == 0): return [math.complex(blockSize * 3 - 1 - x, blockSize * 2 - 1), math.complex('-i')]
            case (dir.equals(math.complex('i')) && Math.floor(x/blockSize) == 1): return [math.complex(blockSize * 1 - 1, blockSize + x), math.complex('-1')]
            case (dir.equals(math.complex('i')) && Math.floor(x/blockSize) == 2): return [math.complex(blockSize * 3 - 1 - x, blockSize * 3 - 1), math.complex('-i')]
            case (dir.equals(math.complex('i')) && Math.floor(x/blockSize) == 3): return [math.complex(blockSize * 3 - 1, blockSize * (-2) + x), math.complex('-1')]
            case (dir.equals(math.complex('-i')) && Math.floor(x/blockSize) == 0): return [math.complex(blockSize * 3 - 1 - x, blockSize * 0), math.complex('i')]
            case (dir.equals(math.complex('-i')) && Math.floor(x/blockSize) == 1): return [math.complex(blockSize * 2, blockSize * (-1) + x), math.complex('1')]
            case (dir.equals(math.complex('-i')) && Math.floor(x/blockSize) == 2): return [math.complex(blockSize * 3 - 1 - x, blockSize * 1), math.complex('i')]
            case (dir.equals(math.complex('-i')) && Math.floor(x/blockSize) == 3): return [math.complex(blockSize * 0, blockSize * (-2) + x), math.complex('1')]
            case (dir.equals(math.complex('1')) && Math.floor(y/blockSize) == 0): return [math.complex(blockSize * 0, blockSize * 2 + y), math.complex('1')]
            case (dir.equals(math.complex('1')) && Math.floor(y/blockSize) == 1): return [math.complex(blockSize * 2 + y, blockSize * 1 - 1), math.complex('-i')]
            case (dir.equals(math.complex('1')) && Math.floor(y/blockSize) == 2): return [math.complex(blockSize * (-1) + y, blockSize * 2 - 1), math.complex('-i')]
            case (dir.equals(math.complex('-1')) && Math.floor(y/blockSize) == 0): return [math.complex(blockSize * 1 + y, blockSize * 1), math.complex('i')]
            case (dir.equals(math.complex('-1')) && Math.floor(y/blockSize) == 1): return [math.complex(blockSize * 2 + y, blockSize * 0), math.complex('i')]
            case (dir.equals(math.complex('-1')) && Math.floor(y/blockSize) == 2): return [math.complex(blockSize * 4 - 1, blockSize * (-2) + y), math.complex('-1')]
            default: {
                //console.log("wrap() => error at pos:", pos, ", dir:", dir)
                throw new Error("Unknown edge condition in wrap()")
            }
        }
    } else throw new Error("Unknown part or input filename in wrap()")
}

// isInGrid() returns true if the given point is in the input grid, or false otherwise
const isInGrid = (pos: math.Complex): boolean => {
    let x: number = pos.re
    let y: number = pos.im
    //console.log("isInGrid() => checking x:", x, ", y:", y)
    try {
        if (grid[x][y] === "." || grid[x][y] === "#")
            return true
        else
            return false
    } catch (e) {
        if (e instanceof TypeError) {
            return false
        }
    }
}

// move() is the main program logic, processing each input instruction
const move = (part: number) => {
    for (let step of instructions.match(pattern)) {
        //console.log("move() => step:", step, ", pos:", pos, ", dir:", dir)
        //console.log()
        switch (true) {
            case (step === 'L'): {
                dir = math.complex(math.multiply(dir, math.complex('i')).toString())
                //console.log("move() => new dir:", dir)
                continue
            }
            case (step === 'R'): {
                dir = math.complex(math.multiply(dir, math.complex('-i')).toString())
                //console.log("move() => new dir:", dir)
                continue
            }
            default: {
                for (let _ = 0; _ < Number(step); _++) {
                    let nextpos = math.add(pos, dir)
                    let nextdir = dir
                    if (!isInGrid(nextpos)) {
                        [nextpos, nextdir] = wrap(part, nextpos, nextdir)
                        //console.log("move() => nextpos wrapped to", nextpos)
                    }
                    let nx:number = nextpos.re
                    let ny:number = nextpos.im
                    if (grid[nx].at(ny) === '.') {
                        pos = nextpos
                        dir = nextdir
                    } else {
                        //console.log("move() => stopped at pos:", pos)
                        break
                    }           
                }
                continue
            }
        }
    }
}

// Common variables
var pos: math.Complex    // down = +1, right = +i
var dir: math.Complex
const dirValue = {'i': 0, '1': 1, '-i': 2, '-1': 3}

// Part 1
pos = math.complex(0, grid[0].indexOf('.'))
dir = math.complex('i')
move(1)
var part1 = (1000 * (pos.re + 1)) + (4 * (pos.im + 1)) + (dirValue[dir.toString()])
console.log("Part 1:", part1)

// Part 2
pos = math.complex(0, grid[0].indexOf('.'))
dir = math.complex('i')
move(2)
var part2 = (1000 * (pos.re + 1)) + (4 * (pos.im + 1)) + (dirValue[dir.toString()])
console.log("Part 2:", part2)