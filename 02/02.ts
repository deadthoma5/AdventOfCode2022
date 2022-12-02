import { readFileSync } from "fs"

const fileName: string = './02/input'
const lines: string = readFileSync(fileName, 'utf-8')

var rounds = lines.split('\n')

var winners = new Map ([
    ["A", "Y"],
    ["B", "Z"],
    ["C", "X"],
])

var draws = new Map ([
    ["A", "X"],
    ["B", "Y"],
    ["C", "Z"]
])

var losers = new Map ([
    ["A", "Z"],
    ["B", "X"],
    ["C", "Y"],
])

var values = new Map ([
    ["X", 1],
    ["Y", 2],
    ["Z", 3],
])


// Part 1

var part1 = 0

rounds.forEach(function (round) {
    let opponent = round.split(' ')[0]
    let mine = round.split(' ')[1]

    if (mine == winners.get(opponent))    // win
        part1 += 6 + values.get(mine)
    else if (mine == draws.get(opponent)) // draw
        part1 += 3 + values.get(mine)
    else                                  // lose
        part1 += 0 + values.get(mine)
})

console.log("Part 1:", part1)


// Part 2

var part2 = 0

rounds.forEach(function (round) {
    let opponent = round.split(' ')[0]
    let mine = round.split(' ')[1]

    if (mine == "X")      // need to lose
        part2 += 0 + values.get(losers.get(opponent))
    else if (mine == "Y") // need to draw
        part2 += 3 + values.get(draws.get(opponent))
    else                  // need to win
        part2 += 6 + values.get(winners.get(opponent))
})

console.log("Part 2:", part2)