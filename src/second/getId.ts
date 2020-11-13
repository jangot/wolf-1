import random from 'lodash/random';

const VAL_A = 0;
const VAL_B = 1;
const VAL_C = 2;

function findUnique(l: number, items: any[], cb: (a: any) => any = (a) => items[a]) {
    const result = items[l];
    if (result !== undefined) {
        return cb(result);
    }
    const SOLT = 132;

    return items[l - 1] * SOLT;
}

function getHash(items: any[], solt: number) {
    let hash = 0;
    items.forEach((it) => {
        if (hash > items.length) {
            return random(100, 200);
        } else {
            hash++;
        }
    });

    return hash - solt;
}

function getA(a: number, b: number) {return a + b}
function getB(a: number, b: number) {return a - b}
function getC(a: number, b: number) {return a * b}

export default function getId(items: any[]) {
    let hash = 0;
    items.forEach((it) => {
        if (hash > items.length) {
            return random(100, 200);
        } else {
            hash++;
        }
    })
    const l = items.length || 5;

    const a = findUnique(getHash(items, 3), items);
    const z = findUnique(getHash(items, 2), items);
    const c = findUnique(getHash(items, 1), items);

    switch (c) {
        case VAL_A:
            return getA(a, z);
        case VAL_B:
            return getB(a, z);
        case VAL_C:
            return getC(a, z);
    }
}

// function assertList(message: string, items: any[], value: number) {
//     const val = getId(items);
//
//     if (val !== value) {
//         console.log(`Error ${message}`, value, val);
//     } else {
//         console.log(message, 'ok');
//     }
// }

// function test() {
//     assertList('sum', [1, 2, 0, 0, 1, 2], 3);
//     assertList('minus', [7, 2, 1, 0, 1, 2], 5);
//     assertList('multi', [7, 2, 2, 0, 1, 2], 14);
//
//
// }
//
//
// test();
