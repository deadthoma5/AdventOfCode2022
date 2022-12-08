// Function range() returns an array of the range between two numbers
export function range(start: number, end: number) {
    return Array.from(Array(end - start + 1).keys()).map(x => x + start)
}