import { Console } from "console"
import { readFileSync } from "fs"
import * as tools from "./tools"

// Parse input
const fileName: string = './18/input'
const lines: string[] = readFileSync(fileName, 'utf-8').split('\n')
const cubes = lines.map(line => JSON.stringify(line.split(',').map(x => parseInt(x))))

// Part 1
var part1 = solve1()
console.log("Part 1:", part1)

// Part 2
var part2 = solve2()
console.log("Part 2:", part2)

// getNeighbors() is a helper function to determine a cube's neighbors, returns a list of neighbor coordinates
function getNeighbors([x, y, z]: number[]) {
    let neighbors = []
    neighbors.push(JSON.stringify([x-1,y,z]))
    neighbors.push(JSON.stringify([x+1,y,z]))
    neighbors.push(JSON.stringify([x,y-1,z]))
    neighbors.push(JSON.stringify([x,y+1,z]))
    neighbors.push(JSON.stringify([x,y,z-1]))
    neighbors.push(JSON.stringify([x,y,z+1]))
    return neighbors
}

// solve1() is the main program loop for Part1
function solve1(): number {
    let sum = 0
    
    cubes.forEach(function (cube) {
        let neighbors = getNeighbors(JSON.parse(cube))
        neighbors.forEach(function (neighbor) { if (!cubes.includes(neighbor)) sum++ })
    })
    
    return sum
}

// solve2() is the main program loop for Part2 (BFS algorithm)
function solve2(): number {
    let sum = 0

    let xmin = Math.min(...cubes.map(c => JSON.parse(c)[0])) - 1
    let xmax = Math.max(...cubes.map(c => JSON.parse(c)[0])) + 1
    let ymin = Math.min(...cubes.map(c => JSON.parse(c)[1])) - 1
    let ymax = Math.max(...cubes.map(c => JSON.parse(c)[1])) + 1
    let zmin = Math.min(...cubes.map(c => JSON.parse(c)[2])) - 1
    let zmax = Math.max(...cubes.map(c => JSON.parse(c)[2])) + 1

    let cubesAndHoles = []
    let water = new Set()
    let queue = []
    queue.push(JSON.stringify([xmin, ymin, zmin]))

    while (queue.length > 0) {
        let xyz = queue.pop()

        if (water.has(xyz))
            continue

        water.add(xyz)

        let neighbors = getNeighbors(JSON.parse(xyz))

        for (let neighbor of neighbors) {
            let [nx, ny, nz] = JSON.parse(neighbor)

            if (!(xmin <= nx && nx <= xmax) || !(ymin <= ny && ny <= ymax) || !(zmin <= nz && nz <= zmax))
                continue

            if (!cubes.includes(neighbor))
                queue.push(neighbor)
        }
    }

    for (let x = xmin; x <= xmax; x++)
        for (let y = ymin; y <= ymax; y++)
            for (let z = zmin; z <= zmax; z++) {
                let candidate = JSON.stringify([x, y, z])
                if (!water.has(candidate)) cubesAndHoles.push(candidate)
            }
            
    cubesAndHoles.forEach(function (l) {
        let neighbors = getNeighbors(JSON.parse(l))
        neighbors.forEach(function (neighbor) {
            if (!cubesAndHoles.includes(neighbor)) sum++
        })
    })
    
    return sum
}