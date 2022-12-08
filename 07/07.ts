import { Console } from "console"
import { readFileSync } from "fs"
import * as tools from "./tools"

// Parse input
const fileName: string = './07/input'
const lines: string[] = readFileSync(fileName, 'utf-8').split('\n')

// Common logic for both parts
var cwd = []
var dirs: Map<string, number> = new Map
lines.forEach(function (line) {
    const terminal = line.split(' ')
    if (terminal[0] == "$") {
        if (terminal[1] == 'cd') {
            if (terminal[2] == "..")
                cwd.pop()
            else {
                const dirname = terminal[2]
                cwd.push(dirname)
                const fullpath = cwd.join('/')
                dirs[fullpath] = {}
                dirs[fullpath].size = 0
            }             
        }
    }
    else if (terminal[0] != "dir") {
        const filesize = parseInt(terminal[0])
        const temppath = []
        cwd.forEach(d => {
            temppath.push(d)
            const tempfullpath = temppath.join('/')
            dirs[tempfullpath].size += filesize
        })            
    }
})

// Part 1
var part1 = 0
for (let dir in dirs) {
    if (dirs[dir].size <= 100000)
        part1 += dirs[dir].size
}
console.log("Part 1:", part1)

// Part 2
var totaldiskavailable = 70000000
var diskneeded = 30000000
var unuseddisk = totaldiskavailable - dirs['/'].size
var candidates = []
for (let dir in dirs) {
    if (unuseddisk + dirs[dir].size > diskneeded)
        candidates.push(dirs[dir].size)
}
var part2 = candidates.reduce((a, b) => a < b ? a : b)
console.log("Part 2:", part2)
