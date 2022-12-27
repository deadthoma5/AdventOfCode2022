import { Console } from "console"
import { readFileSync } from "fs"
import * as tools from "./tools"


// Custom types
type Point = {
    x: number,
    y: number
}


// Common variables
const dir = {
    "NW": <Point> { x: -1, y: -1 },
    "N": <Point> { x: 0, y: -1 },
    "NE": <Point> { x: 1, y: -1 },
    "W": <Point> { x: -1, y: 0 },
    "E": <Point> { x: 1, y: 0 },
    "SW": <Point> { x: -1, y: 1 },
    "S": <Point> { x: 0, y: 1 },
    "SE": <Point> { x: 1, y: 1 }
}

var moves = ["N", "S", "W", "E"]

var movesChecks = {
    "N": ["N", "NE", "NW"],
    "S": ["S", "SE", "SW"],
    "W": ["W", "NW", "SW"],
    "E": ["E", "NE", "SE"]
}

var noMoreMoves = false

// Functions
// str() returns the JSON string formatted x,y coordinates of a point (so set "has" works)
const str = (p: Point): string => {
    return JSON.stringify(p)
}

// checkNeighbor() returns true if a point's neighbor exists, false otherwise
const checkNeighbor = (p: Point, d: string): boolean => {
    let neighbor: Point = { x: p.x + dir[d].x, y: p.y + dir[d].y }
    return (elves.has(str(neighbor))) ? true : false
}

// hasNoNeighbors() returns true if a point has no neighbors, false otherwise
const hasNoNeighbors = (p: Point): boolean => {
    return Object.keys(dir).every((d) => checkNeighbor(p, d) === false)
}

// canMove() returns true if a point can move to a given direction based on provided ruleset
const canMove = (p: Point, m: string): boolean => {
    return (movesChecks[m].every((d) => checkNeighbor(p, d) == false)) ? true : false
}

// move() returns a new point after moving it one step in a given direction
const move = (p: Point, d: string): Point => {
    return <Point> { x: p.x + dir[d].x, y: p.y + dir[d].y }
}

// findDuplicate() returns a set of duplicate points in a list of destinations
const findDuplicates = (destinations: Map<string, string>) => {
    let seen = new Set<string>()
    let duplicates = new Set<string>()
    let dests = Array.from(destinations.values())

    while (dests.length > 0) {
        let d = dests.pop()
        if (!seen.has(d)) {
            seen.add(d)
        } else {
            duplicates.add(d)
        }
    }

    return duplicates
}

// round() is the main program logic with first and second halves per provided instructions
const round = (): Map<string, string> => {
    // First Half: Generate move proposals
    let proposals = new Map<string, string>()
    for (let elf of elves) {
        let pos = JSON.parse(elf) as Point
        if (hasNoNeighbors(pos)) {
            continue
        }
        for (let move of moves) {
            if (canMove(pos, move)) {
                proposals.set(elf, move)
                break
            }
        }
    }
    moves.push(moves.shift())

    // Part 2: check for empty proposals list and exit if there are no more moves
    if (proposals.size == 0) {
        noMoreMoves = true
        return
    }
    
    // Second Half: Remove duplicate proposals and execute moves
    let destinations = new Map<string, string>()
    proposals.forEach((dir, elf) => {
        destinations.set(elf, str(move(JSON.parse(elf) as Point, dir)))
    })

    let duplicates = findDuplicates(destinations)
    let toMove = new Map<string, string> ()
    destinations.forEach((v, k) => {
        if (!duplicates.has(v)) {
            toMove.set(k, v)
        }
    })

    toMove.forEach((new_pos, old_pos) => {
        elves.delete(old_pos)
        elves.add(new_pos)
    })

    return
}

// countEmptyTiles() returns the number of ground tiles unoccupied by any elf after all rounds complete
const countEmptyTiles = (): number => {
    let xmin = Number.MAX_SAFE_INTEGER
    let xmax = Number.MIN_SAFE_INTEGER
    let ymin = Number.MAX_SAFE_INTEGER
    let ymax = Number.MIN_SAFE_INTEGER

    for (let elf of elves) {
        let p = JSON.parse(elf) as Point
        if (p.x < xmin)
            xmin = p.x
        if (p.x > xmax)
            xmax = p.x
        if (p.y < ymin)
            ymin = p.y
        if (p.y > ymax)
            ymax = p.y
    }
    
    return (xmax - xmin + 1) * (ymax - ymin + 1) - elves.size
}


// Parse input
const fileName: string = './23/input'
const lines: string[] = readFileSync(fileName, 'utf-8').split('\n')
var elves = new Set<string>()
lines.forEach((line, y) => {
    line.split("").forEach((char, x) => {
        if (char === "#") {
            let p: Point = { x: x, y: y }    // North: -y, East: +x, South: +y, West: -x, origin (0, 0) = top left of input
            elves.add(str(p))
        }
    })
})


// Parts 1 and 2
var n = 0
var part1: number
var part2: number
while (!noMoreMoves) {
    round()
    n++
    if (n == 10) {
        part1 = countEmptyTiles()
    }
}
part2 = n
console.log("Part 1:", part1)
console.log("Part 2:", part2)