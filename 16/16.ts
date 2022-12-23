import { Console } from "console"
import { readFileSync } from "fs"
import path = require("path")
import { start } from "repl"
import * as tools from "./tools"

// Custom types
type Room = {
    name: string
    flowrate: number
    neighbors: string[]
}

type InputMap = {
    [name: string]: Room
}

type CostMap = {
    [name: string]: number
}

type PriceMap = {
    [name: string]: CostMap
}

type Path = {
    current: string
    toVisit: string[]
    timeLeft: number
    isDone: boolean
    steps: string[]
    totalPressure: number
}


// Parse input
const pattern = /(Valve )([A-Z]*)( has flow rate=)(\d+)(; \btunnels?\b \bleads?\b to \bvalves?\b )(.*)/
const fileName: string = './16/input'
const input: Room[] = readFileSync(fileName, 'utf-8')
    .split('\n')
    .map(line => {
        const match = pattern.exec(line)
        const name = match[2]
        const flowrate = parseInt(match[4])
        const neighbors = Array.from(match[6].split(', '))
        return {
            name: name,
            flowrate: flowrate,
            neighbors: neighbors
        } as Room
    })
const inputRooms: InputMap = input.reduce((map, currRoom) => ({
    ...map,
    [currRoom.name]: currRoom
}), {} as InputMap)


// Functions

// sortByPressure() returns a pair of Path objects in order of decreasing total pressure
const sortByPressure = (a: Path, b: Path) => b.totalPressure - a.totalPressure

// getMaxPressureWithElephant() returns the optimal max pressure from both elephant and human working for Part 2 (their paths do not intersect)
const getMaxPressureWithElephant = (destinationRooms: Room[], roomsMovePrices: PriceMap, inputRooms: InputMap): number => {
    let bestTotalPressure = -1
    const paths = getAllPaths(26, destinationRooms, roomsMovePrices, inputRooms)
    for (let humanPath = 0; humanPath < paths.length; humanPath++) {
        for (let elephantPath = humanPath + 1; elephantPath < paths.length; elephantPath++) {
            if (paths[humanPath].steps.every(s => !paths[elephantPath].steps.includes(s))) {
                let bothTotalPressure = paths[humanPath].totalPressure + paths[elephantPath].totalPressure
                if (bothTotalPressure > bestTotalPressure) {
                    bestTotalPressure = bothTotalPressure
                }
            }
        }
    }
    return bestTotalPressure
}

// getAllPaths() returns the total pressure from all paths
const getAllPaths = (time: number, destinations: Room[], prices: PriceMap, rooms: InputMap): Path[] => {
    const paths: Path[] = [{
        current: 'AA',
        toVisit: destinations.map(r => r.name),
        timeLeft: time,
        isDone: false,
        steps: [],
        totalPressure: 0
    }]

    for (let n = 0; n < paths.length; n++) {
        const path = paths[n]

        if (path.timeLeft <= 0 || path.isDone) {
            path.isDone = true
            continue
        }

        const currentPrices = prices[path.current]
        let isNewPath = false

        path.toVisit.forEach(room => {
            const newTimeLeft = path.timeLeft - currentPrices[room] - 1
            if (room !== path.current && newTimeLeft > 0) {
                isNewPath = true
                paths.push({
                    current: room,
                    toVisit: path.toVisit.filter(v => v != room),
                    timeLeft: newTimeLeft,
                    isDone: false,
                    steps: [...path.steps, room],
                    totalPressure: path.totalPressure + (newTimeLeft) * rooms[room].flowrate
                })
                paths.push({
                    current: room,
                    toVisit: [],
                    timeLeft: newTimeLeft,
                    isDone: true,
                    steps: [...path.steps, room],
                    totalPressure: path.totalPressure + (newTimeLeft) * rooms[room].flowrate
                })
            }
        })
        if (!isNewPath) {
            path.isDone = true
        }
    }

    return paths.filter(p => p.isDone).sort(sortByPressure)
}

// dijkstra() uses Dijkstra's Algorithm to find the most economic route to a destination room
const dijkstra = (start: Room, destinations: Room[], map: InputMap): CostMap => {
    const visited: string[] = []
    const toVisit: Room[] = [start]
    const minCost: CostMap = {
        [start.name]: 0
    }
    let current: Room

    while (current = toVisit.shift()) {
        if (visited.includes(current.name)) {
            continue
        }

        const candidates = current.neighbors.filter(n => !visited.includes(n)).map(n => map[n])
        toVisit.push(...candidates)

        const costToCurrent = minCost[current.name]
        candidates.forEach(n => {
            const newCostToNeighbor = costToCurrent + 1
            const costToNeighbor = minCost[n.name] === undefined ? newCostToNeighbor : minCost[n.name]

            if (newCostToNeighbor <= costToNeighbor) {
                minCost[n.name] = newCostToNeighbor
            }
        })

        visited.push(current.name)
    }
    return destinations.reduce((map: CostMap, room: Room) => {
        return {
            ...map,
            [room.name]: minCost[room.name]
        }
    }, {} as CostMap)
}


// Initialize variables
const startRoom: Room = inputRooms['AA']
const startRooms = [startRoom, ...input.filter(room => room.flowrate != 0)]
const destinationRooms = [...input.filter(room => room.flowrate > 0)]
const roomsMovePrices: PriceMap = startRooms.reduce((map: PriceMap, room: Room) => {
    return {
        ...map,
        [room.name]: dijkstra(room, destinationRooms.filter(r => r.name != room.name), inputRooms)
    }
}, {} as PriceMap)


// Part 1
const part1 = getAllPaths(30, destinationRooms, roomsMovePrices, inputRooms)[0].totalPressure
console.log("Part 1:", part1)


// Part 2
var part2 = getMaxPressureWithElephant(destinationRooms, roomsMovePrices, inputRooms)
console.log("Part 2:", part2)