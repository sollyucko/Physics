import { Range as IntRange, Head, Tail, Repeat, Cast, Cons } from "typepark/src";

export type Union<T extends any[], A = never> = {
    0: A,
    1: Union<Tail<T>, A | Head<T>>
}[T extends [] ? 0 : 1];

export type Repeat<T, N extends number, A extends any[] = []> = {
    0: A,
    1: Repeat<T, N, Cons<any, A>>
}[A["length"] extends N ? 0 : 1] extends infer X ? Cast<X, any[]> : never

export type _NaturalBelow<L extends any[], A extends any[] = never> = {
    0: A,
    1: _NaturalBelow<Tail<L>, A | L>
}[L extends [] ? 0 : 1] extends infer X ? Cast<X, any[]> : never

export type NaturalAtMost<B extends number> = (_NaturalBelow<Repeat<any, B> extends infer X ? Cast<X, any[]> : never>)["length"]
export type NaturalBelow<B extends number> = (_NaturalBelow<Tail<Repeat<any, B> extends infer X ? Cast<X, any[]> : never>>)["length"]

type _SizedArrayIndex<T, L extends number> = { [i in NaturalBelow<L>]: T }

interface _SizedArrayOther<T, L extends number> extends Array<T> {
    map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): SizedArray<U, L>
    length: L
}

type SizedArray<T, L extends number> = _SizedArrayIndex<T, L> & _SizedArrayOther<T, L>

export interface ArrayLikeIterable<T> extends ArrayLike<T>, Iterable<T> {
    [Symbol.iterator]: () => IterableIterator<T>;
}

export function zip<T>(): [][]
export function zip<T>(a: ArrayLike<T>): [T][]
export function zip<T>(a: [T, T], b: [T, T]): [[T, T], [T, T]]
export function zip<T, U>(a: ArrayLike<T>, b: ArrayLike<U>): [T, U][]
export function zip<T, U, V>(a: ArrayLike<T>, b: ArrayLike<U>, c: ArrayLike<V>): [T, U, V][]
export function zip<T, L extends number>(a: SizedArray<T, L>, b: SizedArray<T, L>): SizedArray<T, L>
export function zip<T>(...arrs: ArrayLike<T>[]): T[][] {
    if(arrs.length == 0)
        return [];
    
    const result: T[][] = [];
    for(const i in arrs[0]) {
        result.push(arrs.map(arr => arr[i]));
    }
    return result;
}

export const squared = (a: number): number => {
    return a * a;
};

export const cubed = (a: number): number => {
    return a * a * a;
};

export const add = (a: [number, number], b: [number, number]): [number, number] => [a[0] + b[0], a[1] + b[1]];

export const subtract = (a: [number, number], b: [number, number]): [number, number] => [a[0] - b[0], a[1] - b[1]];

export const scaled = (a: [number, number], scale: number): [number, number] => [a[0] * scale, a[1] * scale];

export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
};
