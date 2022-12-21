import { Console } from "console"
import { readFileSync } from "fs"
import * as tools from "./tools"

// Parse input
const fileName: string = './17/input'
const data: string = readFileSync(fileName, 'utf-8')
var rocks = new Set<number[]>()

// Part 1
var part1 = solve(2022)
console.log("Part 1:", part1)

// Part 2
var part2 = solve(1000000000000)
console.log("Part 2:", part2)

// create_piece() returns an array of (x, y) points representing one of five game piece shapes
function create_piece(type: number, y: number) {
    switch (type) {
        case 0:
            return [[2, y], [3, y], [4, y], [5, y]]
        case 1:
            return [[3, y+2], [2, y+1], [3, y+1], [4, y+1], [3, y]]
        case 2:
            return [[2, y], [3, y], [4, y], [4, y+1], [4, y+2]]
        case 3:
            return [[2, y], [2, y+1], [2, y+2], [2, y+3]]
        case 4:
            return [[2, y], [3, y], [2, y+1], [3, y+1]]
        default:
            throw new Error()
    }
}

// move_left() returns the piece shifted to the left by 1, unless one of its points is already at x=0
function move_left(piece) {
    if (piece.some(function ([x, y]) { return x == 0 }))
        return piece
    else
        return piece.map(function ([x, y]) { return [x-1, y] })
}

// move_right() returns the piece shifted to the right by 1, unless one of its points is already at x=6 (chamber is 7 units wide)
function move_right(piece) {
    if (piece.some(function ([x, y]) { return x == 6 }))
        return piece
    else
        return piece.map(function ([x, y]) { return [x+1, y] })
}

// move_down() returns the piece shifted downward by 1
function move_down(piece) {
    return piece.map(function ([x, y]) { return [x, y-1] })
}

// move_up() returns the piece shifted upward by 1, used when colliding with floor at y=0
function move_up(piece) {
    return piece.map(function ([x, y]) { return [x, y+1] })
}

// check_floor() returns true if the piece hit the floor at y=0
function check_collision(piece) {
    if (piece.some(function ([x, y]) {
        for (let [rx, ry] of rocks) {
            if (x == rx && y == ry) {
                return true
            }
        }
    }))
        return true
    else
        return false
}

// solve() is the main program logic, returns height of rock tower
function solve(limit: number): number {
    rocks = new Set([[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]])    // initialize with floor at x=0..6, y=0
    let i = 0
    let type = 0
    let top = 0
    let yshift = 0
    let seen = new Map()
    let skip = false

    while (type < limit) {
        let piece = create_piece(type % 5, top + 4)
        while (true) {
            // process a move step from input data
            if (data[i] == '<') {
                piece = move_left(piece)
                if (check_collision(piece)) {
                    piece = move_right(piece)
                }
            } else {
                piece = move_right(piece)
                if (check_collision(piece)) {
                    piece = move_left(piece)
                }
            } 
            i = (i + 1) % data.length

            // after input step, move piece downward and add to "rocks" collection if downward collision
            piece = move_down(piece)
            if (check_collision(piece)) {
                piece = move_up(piece)
                for (let p of piece) {
                    rocks.add(p)
                }
                for (let [px, py] of piece) {
                    if (py > top) {
                        top = py
                    }
                }
                
                // for Part 2, make a note of the current state (vent index and current piece) and check for a cycle after 2022 iterations
                let state = [i, type % 5]
                if (seen.has(JSON.stringify(state)) && type >= 2022) {
                    let [oldtype, oldy] = seen.get(JSON.stringify(state))
                    let dy = top - oldy
                    let dt = type - oldtype
                    let shiftsize = Math.floor((limit - type) / dt)
                    yshift += shiftsize * dy
                    type += shiftsize * dt
                }
                seen.set(JSON.stringify(state), [type, top])
                break
            }
        }
        type++
    }
    return top + yshift
}