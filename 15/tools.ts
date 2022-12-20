// Function range() returns an array of the range between two numbers
export function range(start, end) {
    return Array.from(Array(end - start + 1).keys()).map(x => x + start)
}