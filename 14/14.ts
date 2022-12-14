import { Console } from "console"
import { readFileSync } from "fs"
import * as tools from "./tools"

// Parse input
const fileName: string = './14/input'
const lines: string[] = readFileSync(fileName, 'utf-8').split('\n')
var grid: string[][] = initGrid(lines, 1)

// Part 1
var part1 = simulate(grid)
console.log("Part 1:", part1)

// Part 2
var grid: string[][] = initGrid(lines, 2)
var part2 = simulate(grid)
console.log("Part 2:", part2)

// initGrid() returns a 2D grid initialized per input and Part 1+2 specifications
function initGrid(lines: string[], part: number): string[][] {
    let dimensions: number[] = findDimensions(lines)
    if (part == 1)
        grid = Array.from({length: dimensions[0] + 1}, () => Array.from({length: dimensions[1] + 1}))
    else if (part == 2)
        grid = Array.from({length: dimensions[0] * 2}, () => Array.from({length: dimensions[1] + 10}))
    else
        throw new Error()

    for (let i = 0; i < grid.length; i++)
        for (let j = 0; j < grid[0].length; j++)
            grid[i][j] = '.'
    lines.forEach(function (line) {
        let points = line.split(' -> ')
        for (let n = 0; n < points.length - 1; n++) {
            let xi = parseInt(points[n].split(',')[0])
            let xf = parseInt(points[n + 1].split(',')[0])
            let yi = parseInt(points[n].split(',')[1])
            let yf = parseInt(points[n + 1].split(',')[1])

            if (xi == xf) {    // vertical
                let range: number[]
                if (yf > yi) {    // up
                    range = tools.range(yi, yf)
                } else {    // down
                    range = tools.range(yf, yi).reverse()
                }
                for (let y in range) {
                    grid[xi][range[y]] = '#'
                }
            }
            if (yi == yf) {    // horizontal
                let range: number[]
                if (xf > xi) {    // right
                    range = tools.range(xi, xf)
                } else {
                    range = tools.range(xf, xi).reverse()
                }
                for (let x in range) {
                    grid[range[x]][yi] = '#'
                }
            }
        }
    })
    grid[500][0] = '+'

    if (part == 2) {
        for (let x = 0; x < grid.length; x++) {
            grid[x][dimensions[1] + 2] = '#'
        }
    }

    return grid
}

// Debug helper function: printGrid() outputs the grid state to the screen
function printGrid(grid: string[][]) {
    let padding = 5
    for (let y = 0; y <= 9 + padding; y++) {
        let output = ""
        for (let x = 494 - padding; x <= 503 + padding; x++) {
            output += grid[x][y]
        }
        console.log(output)
    }
}

// Main program logic to send sand until end conditions are reached
function simulate(grid: string[][]): number {
    let sand = 0
    let xsand = 500
    let ysand = 0

    while (true) {
        if (grid[xsand][ysand + 1] == '.' || grid[xsand][ysand + 1] == '~') {
            ysand += 1
            grid[xsand][ysand] = '~'
        } else if (grid[xsand - 1][ysand + 1] == '.' || grid[xsand - 1][ysand + 1] == '~') {
            xsand -= 1
            ysand += 1
            grid[xsand][ysand] = '~'
        } else if (grid[xsand + 1][ysand + 1] == '.' || grid[xsand + 1][ysand + 1] == '~') {
            xsand += 1
            ysand += 1
            grid[xsand][ysand] = '~'
        } else if (grid[xsand][ysand] == "O") {    // Part 2: sand source has a piece of sand in it
            return sand
        } else {
            if (xsand < grid.length - 1 && ysand < grid[0].length - 1) {
                grid[xsand][ysand] = 'O'
                sand++
                xsand = 500
                ysand = 0
            } else {
                return sand
            }
        }
    }
    return sand
}

// findDimensions() returns the max X and Y values from the input
function findDimensions(lines: string[]) {
    let x = []
    let y = []
    lines.forEach(function (line) {
        let points = line.split(' -> ')
        points.forEach(function (point) {
            x.push(parseInt(point.split(',')[0]))
            y.push(parseInt(point.split(',')[1]))
        })
    })
    x.sort((a, b) => b - a)
    y.sort((a, b) => b - a)
    
    let xmax = x[0]
    let ymax = y[0]
    return [xmax, ymax]
}