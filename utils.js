export function zip(...arrs) {
    if (arrs.length == 0)
        return [];
    const result = [];
    for (const i in arrs[0]) {
        result.push(arrs.map(arr => arr[i]));
    }
    return result;
}
export const squared = (a) => {
    return a * a;
};
export const cubed = (a) => {
    return a * a * a;
};
export const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
export const subtract = (a, b) => [a[0] - b[0], a[1] - b[1]];
export const scaled = (a, scale) => [a[0] * scale, a[1] * scale];