import { Console } from "console"
import { readFileSync } from "fs"
import * as tools from "./tools"

// Parse input
const fileName: string = './15/input'
const lines: string[] = readFileSync(fileName, 'utf-8').split('\n')
const pattern = /(Sensor at x=)(-?\d+)(, y=)(-?\d+)(: closest beacon is at x=)(-?\d+)(, y=)(-?\d+)/
var sensors = new Map()
lines.forEach(function (line) {
    let match = pattern.exec(line)
    let xs = Number(match[2])
    let ys = Number(match[4])
    let xb = Number(match[6])
    let yb = Number(match[8])
    sensors.set(JSON.stringify([xs, ys]), JSON.stringify([xb, yb]))
})

// Part 1
if (fileName == './15/input_test')
    var part1 = solve1(10)
else
    var part1 = solve1(2000000)
console.log("Part 1:", part1)

// Part 2
if (fileName == './15/input_test')
    var part2 = solve2(20)
else
    var part2 = solve2(4000000)
console.log("Part 2:", part2)

// distance() returns the Manhattan Distance between two points
function distance([x1, y1]: number[], [x2, y2]: number[]): number {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1)
}

// solve1() is the main program logic for Part 1
function solve1(ytarget: number) {
    let xbeacon = new Set<number>()
    let xblocked = new Set<number>()

    for (let [sensor, beacon] of sensors) {
        let [xs, ys] = JSON.parse(sensor)
        let [xb, yb] = JSON.parse(beacon)

        // mark locations of beacons at y=ytarget
        if (yb == ytarget) {
            xbeacon.add(xb)
            xblocked.add(xb)
        }

        // mark locations a sensor doesn't sense a beacon at y=ytarget
        let d = distance([xs, ys], [xb, yb])
        let dy = distance([xs, ys], [xs, ytarget])
        let dx = d - dy
        if (dx > 0) {
            for (let x = xs - dx; x <= xs + dx; x++) {
                xblocked.add(x)
            }
        }
    }

    return xblocked.size - xbeacon.size
}

// solve2() is the main program logic for Part 2
function solve2(xylimit: number) {
    let a_terms = new Set<number>()
    let b_terms = new Set<number>()
    let radii = new Map()

    for (let [sensor, beacon] of sensors) {
        let [xs, ys] = JSON.parse(sensor)
        let [xb, yb] = JSON.parse(beacon)

        // here, radius is the Manhattan Distance between scanner and its nearest beacon
        // this is also the distance between the scanner and one corner of its diamond
        let r = distance([xs, ys], [xb, yb])
        radii.set(sensor, r)

        // y = x + a = x + (ys - xs + r + 1) is diagonal line of slope +1 above scanner's upper boundary
        a_terms.add(ys - xs + r + 1)

        // y = x + a = x + (ys - xs - r - 1) is diagonal line of slope +1 below scanner's lower boundary
        a_terms.add(ys - xs - r - 1)

        // y = -x + b = -x + (xs + ys + r + 1) is diagonal line of slope -1 above scanner's upper boundary
        b_terms.add(xs + ys + r + 1)

        // y = -x + b = -x + (xs + ys - r - 1) is diagonal line of slope -1 below scanner's lower boundary
        b_terms.add(xs + ys - r - 1)
    }

    // find all intersections of scanners' diamond-lines that are within bounds and land on integer x,y points
    // formula: intersection of two lines y = x + a and y = -x + b are at (x, y):
    // x = (b - a) / 2
    // y = (a + b) / 2
    let intersections = []
    for (let a of a_terms) {
        for (let b of b_terms) {
            let xintersect = (b-a)/2
            let yintersect = (a+b)/2
            if (0 < xintersect && xintersect < xylimit && 0 < yintersect && yintersect < xylimit && (b-a) % 2 == 0)
                intersections.push(JSON.stringify([(b-a)/2, (a+b)/2]))
        }
    }

    for (let i of intersections) {
        let [xi, yi] = JSON.parse(i)

        // we're looking for intersection points that reside outside of every scanner's diamond (the scanner's radius)
        let test = Array.from(radii.keys()).every(function (sensor) {
            let [xs, ys] = JSON.parse(sensor)
            return (distance([xs, ys], [xi, yi]) > radii.get(sensor))
        })

        if (test)
            return xi * 4000000 + yi
    }
    
    return 0
}