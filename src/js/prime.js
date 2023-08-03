"use strict"
import functions from "./functions.js"

const INT_10e5 = 10e5

// Sàng nguyên tố
let arr = initArr(1, INT_10e5)
arr[0] = 0
arr[1] = 0
let prime = sieve(arr, INT_10e5)

// Functions
function isPrime(n) {
    if(n < INT_10e5) {
        return functions.others.binarySearch(prime, n) != -1
    } else {
        let sqrtn = Math.sqrt(n)
        for(let i = 2; i <= sqrtn; i++) {
            if(n % i == 0) {
                return false;
            }
        }
        return n > 1
    }
}

function initArr(value, length) {
    let arr = []
    for(let i = 0; i < length; i++) {
        arr.push(value)
    }
    return arr
}

function sieve(arr, length) {
    let prime = []
    for(let i = 2; i < length; i++) {
        if(arr[i] == 1) {
            prime.push(i)
        }
        for(let j = i * 2; j < length; j += i) {
            arr[j] = 0
        }
    }
    return prime
}

export {isPrime, prime}