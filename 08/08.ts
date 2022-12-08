import { Console } from "console"
import { readFileSync } from "fs"
import * as tools from "./tools"

// Parse input
const fileName: string = './08/input'
const lines: string[] = readFileSync(fileName, 'utf-8').split('\n')

var rows = lines.length
var cols = lines[0].length
var grid: number[][] = Array.from({length: rows}, () => Array.from({length: cols}))
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        grid[row][col] = parseInt(lines[row].charAt(col))
    }
}

// Part 1
var part1 = 0
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        let tree = grid[row][col]
        let rowarray = grid[row]
        let colarray = grid.map(x => x[col])
        let top = colarray.slice(0, row)
        let bottom = colarray.slice(row + 1)
        let left = rowarray.slice(0, col)
        let right = rowarray.slice(col + 1)
        let isVisibleAllDirections: boolean = isVisible(top, tree) || isVisible(bottom, tree) || isVisible(left, tree) || isVisible(right, tree)
        if (isVisibleAllDirections)
            part1++
    }
}
console.log("Part 1:", part1)

// Part 2
var part2 = 0
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        let tree = grid[row][col]
        let rowarray = grid[row]
        let colarray = grid.map(x => x[col])
        let top = colarray.slice(0, row).reverse()
        let bottom = colarray.slice(row + 1)
        let left = rowarray.slice(0, col).reverse()
        let right = rowarray.slice(col + 1)
        let scenicScore = score(top, tree) * score(bottom, tree) * score(left, tree) * score(right, tree)
        if (scenicScore > part2)
            part2 = scenicScore
    }
}
console.log("Part 2:", part2)

// isVisible() determines if a given tree is visible from one view's direction for Part 1
function isVisible(others: number[], tree: number) {
    return others.every((n: number) => { return n < tree })
}

// score() finds the scenic subscore for one view's direction from a given tree for Part 2
function score(others: number[], tree: number) {
    let count = 0
    for (let i = 0; i < others.length; i++) {
        count++
        if (others[i] >= tree)
            break
    }
    return count
}