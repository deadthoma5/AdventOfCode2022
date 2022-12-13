import { Console } from "console"
import { readFileSync } from "fs"
import * as tools from "./tools"

// Parse input
const fileName: string = './12/input'
var lines: string[] = readFileSync(fileName, 'utf-8').split('\n')

const rows: number = lines.length
const cols: number = lines[0].length
var startRow: number
var startCol: number
var endRow: number
var endCol: number
var grid: number[][] = Array.from({length: rows}, () => Array.from({length: cols}))
var cost: number[][] = Array.from({length: rows}, () => Array.from({length: cols}))
var maxCost = 65535
var visited = []
var toVisit = []
var startsPart2 = []

// Initialize grid for Part 1
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        if (lines[row].charAt(col) == 'S') {
            startRow = row
            startCol = col
            lines[row] = lines[row].substring(0, col) + 'a' + lines[row].substring(col+1)
        }
        else if (lines[row].charAt(col) == 'E') {
            endRow = row
            endCol = col
            lines[row] = lines[row].substring(0, col) + 'z' + lines[row].substring(col+1)
        }
        grid[row][col] = lines[row].charCodeAt(col) - 'a'.charCodeAt(0) + 1
    }
}

// Initialize cost grid for Part 1
for (let row = 0; row < cost.length; row++ ) {
    for (let col = 0; col < cost[0].length; col++ ) {
        cost[row][col] = maxCost
    }
}

// Part 1
var part1 = Dijkstra(grid, [startRow, startCol], [endRow, endCol])
console.log("Part 1:", part1)


// Initialize a reversed-height grid for Part 2
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        if (lines[row].charAt(col) == 'S') {
            startRow = row
            startCol = col
            lines[row] = lines[row].substring(0, col) + 'a' + lines[row].substring(col+1)
        }
        else if (lines[row].charAt(col) == 'E') {
            endRow = row
            endCol = col
            lines[row] = lines[row].substring(0, col) + 'z' + lines[row].substring(col+1)
        }
        grid[row][col] = 27 - (lines[row].charCodeAt(col) - 'a'.charCodeAt(0) + 1)
        if (grid[row][col] == 26)
            startsPart2.push(String(row) + "," + String(col))
    }
}

// Reinitialize the cost grid for Part 2
for (let row = 0; row < cost.length; row++ ) {
    for (let col = 0; col < cost[0].length; col++ ) {
        cost[row][col] = maxCost
    }
}

// Part 2
var part2 = maxCost
startsPart2.forEach(function (start) {
    let startRow = parseInt(start.split(",")[0])
    let startCol = parseInt(start.split(",")[1])
    let result = Dijkstra(grid, [endRow, endCol], [startRow, startCol])    // reversed: start 'E' -> end any 'a'
    if (result < part2)
        part2 = result
})
console.log("Part 2:", part2)

// Dijkstra() pathfinding algorithm with constant (1) cost per step, returns minimum cost to get to the end
function Dijkstra(grid, [startRow, startCol]: [number, number], [endRow, endCol]: [number, number]) {
    visited = []
    toVisit = []
    cost[startRow][startCol] = 0
    toVisit.push([String(startRow) + "," + String(startCol), 0])

    while (toVisit.length > 0) {
        toVisit.sort((a, b) => b[1] - a[1])
        var curr = toVisit.pop()[0]
        visited.push(curr)
        var currRow = parseInt(curr.split(",")[0])
        var currCol = parseInt(curr.split(",")[1])
        var neighbors = getNeighbors(grid, [currRow, currCol])
        neighbors.forEach(function (neighbor) {
            var neighborRow = parseInt(neighbor.split(",")[0])
            var neighborCol = parseInt(neighbor.split(",")[1])
            var tentativeCost = cost[currRow][currCol] + 1
            if (tentativeCost >= cost[neighborRow][neighborCol])
                return
            else {
                cost[neighborRow][neighborCol] = tentativeCost
                toVisit.push([String(neighbor), tentativeCost])
            }
        })
    }
    return cost[endRow][endCol]
}

// getNeighbors() is a Dijkstra's algorithm helper function. Return a node's unvisited neighbors
function getNeighbors(grid: number[][], [row, col]) {
    let neighbors = []
    if (row > 0 && !visited.includes(String(row - 1) + "," + String(col)) && grid[row - 1][col] - grid[row][col] <= 1) {
        neighbors.push(String(row - 1) + "," + String(col))
    }    // up
    if (row < grid.length - 1 && !visited.includes(String(row + 1) + "," + String(col)) && grid[row + 1][col] - grid[row][col] <= 1) {
        neighbors.push(String(row + 1)+ "," + String(col))
    }    // down
    if (col > 0 && !visited.includes(String(row) + "," + String(col - 1)) && grid[row][col - 1] - grid[row][col] <= 1) {
        neighbors.push(String(row) + "," + String(col - 1))
    }    // left
    if (col < grid[0].length - 1 && !visited.includes(String(row) + "," + String(col + 1)) && grid[row][col + 1] - grid[row][col] <= 1) {
        neighbors.push(String(row) + "," + String(col + 1))
    }    // right
        
    return neighbors
}