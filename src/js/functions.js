"use strict"

const _8_BITS = 8
const _4_BITS = 4
const _4_BITS_HEX = ['0000', "0001", '0010', '0011', '0100', '0101', '0110', '0111', '1000', '1001', '1010', '1011', '1100', '1101', '1110', '1111']
const _64_BITS = 64

const others = {
    ascii: (charCode) => { return String.fromCharCode(charCode) },
    charCode: (character) => { return character.charCodeAt(0) },
    mod: (a, b) => {
        // a = k * b + r
        let k = Math.floor(a / b)
        return a - k * b
    },
    getCharHexFrom4Bits: (_4_bits) => {
        switch (_4_bits) {
            case '0000':
                return '0'
            case '0001':
                return '1'
            case '0010':
                return '2'
            case '0011':
                return '3'
            case '0100':
                return '4'
            case '0101':
                return '5'
            case '0110':
                return '6'
            case '0111':
                return '7'
            case '1000':
                return '8'
            case '1001':
                return '9'
            case '1010':
                return 'A'
            case '1011':
                return 'B'
            case '1100':
                return 'C'
            case '1101':
                return 'D'
            case '1110':
                return 'E'
            case '1111':
                return 'F'
            default:
                return '?'
        }
    },
    // x ^ n mod m
    powAndMod: (x, n, m) => {
        let p = 1
        n = converter.decimalToBinary(n)
        for (let value of n) {
            p = p * p
            p = others.mod(p, m)
            if (value == '1') {
                p = p * x
                p = others.mod(p, m)
            }
        }
        return p
    },
    gcd: (a, b) => {
        if (a == 0 || b == 0) {
            return 0
        }
        let r = others.mod(a, b)
        while (r != 0) {
            a = b
            b = r
            r = others.mod(a, b)
        }
        return b
    },
    binarySearch: (arr, value) => {
        let left = 0;
        let right = arr.length - 1
        while (left <= right) {
            let mid = Math.floor((left + right) / 2)
            if (arr[mid] == value) {
                return mid
            } else if (arr[mid] < value) {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }
        return -1
    },
    euclideExtended: (r0, r1) => {
        let m = r0
        if (others.gcd(r0, r1) != 1) {
            return undefined
        }
        let s0 = 1, t0 = 0
        let s1 = 0, t1 = 1
        let si, ti
        let q, tmp
        while (true) {
            q = Math.floor(r0 / r1)
            tmp = r0
            r0 = r1
            r1 = others.mod(tmp, r1)
            si = s0 - q * s1
            ti = t0 - q * t1
            s0 = s1
            t0 = t1
            s1 = si
            t1 = ti
            if (others.mod(r0, r1) == 0) {
                break
            }
        }
        return t1 < 0 ? others.mod(t1, m) : t1
    }
}

const binary = {
    fixBit: (n, bits) => {
        let length = n.length
        if (bits > length) {
            while (length++ < bits) {
                n = '0' + n
            }
        }
        return n
    },
    _xor: (a, b) => {
        let len_a = a.length
        let len_b = b.length
        let k = Math.abs(len_a - len_b)
        while (k-- > 0) {
            if (len_a < len_b) {
                a = '0' + a
            } else {
                b = '0' + b
            }
        }
        let result = ""
        for (let i = Math.max(len_a, len_b) - 1; i >= 0; i--) {
            if ((a[i] == '0' && b[i] == '0') || (a[i] == '1' && b[i] == '1')) {
                result = '0' + result
            } else {
                result = '1' + result
            }
        }
        return result
    },
    XOR: (...args) => {
        let result = ""
        for (let value of args) {
            result = binary._xor(result, value)
        }
        return result
    },
    SHR: (n, k) => {
        let length = n.length
        let result = ""
        for (let i = 0; i < k; i++) {
            result += '0'
        }
        for (let i = 0; i < length - k; i++) {
            result += n[i]
        }
        return result
    },
    ROTR: (n, k) => {
        let length = n.length
        let result = ""
        for (let i = 0; i < length - k; i++) {
            result += n[i];
        }
        let subResult = ""
        for (let i = length - k; i < length; i++) {
            subResult += n[i]
        }
        return subResult + result
    },
    compare: (a, b) => {
        let tmp = 0
        while (a[tmp] == '0') {
            tmp++
        }
        a = a.slice(tmp, a.length)
        tmp = 0
        while (b[tmp] == '0') {
            tmp++
        }
        b = b.slice(tmp, b.length)
        let len_a = a.length
        let len_b = b.length
        if (len_a == len_b) {
            for (let i = 0; i < len_a; i++) {
                if (a[i] != b[i]) {
                    return a[i] == '0' ? -1 : 1
                }
            }
            return 0
        }
        return len_a > len_b ? 1 : -1
    },
    _add: (a, b) => {
        let len_a = a.length
        let len_b = b.length
        let k = Math.abs(len_a - len_b)
        while (k-- > 0) {
            if (len_a < len_b) {
                a = '0' + a
            } else {
                b = '0' + b
            }
        }
        let result = ""
        let carry = false
        for (let i = Math.max(len_a, len_b) - 1; i >= 0; i--) {
            let value
            if ((a[i] == '0' && b[i] == '0') || (a[i] == '1' && b[i] == '1')) {
                value = '0'
            } else {
                value = '1'
            }
            if ((carry == '0' && value == '0') || (carry == '1' && value == '1')) {
                result = '0' + result
            } else {
                result = '1' + result
            }
            carry = ((a[i] == '1' && b[i] == '1') || (carry == '1' && value == '1')) ? '1' : '0'
        }
        if (carry == '1') {
            result = '1' + result
        }
        return result
    },
    add: (...args) => {
        let result = ""
        for (let value of args) {
            result = binary._add(result, value)
        }
        return result
    },
    subtraction: (a, b) => {
        let len_a = a.length
        let len_b = b.length
        let k = Math.abs(len_a - len_b)
        while (k-- > 0) {
            if (len_a < len_b) {
                a = '0' + a
            } else {
                b = '0' + b
            }
        }
        let result = ""
        let isNegativeNumber = ''
        if (binary.compare(a, b) < 0) {
            let tmp = a
            a = b
            b = tmp
            isNegativeNumber = '-'
        }
        let carry = '0'
        for (let i = Math.max(len_a, len_b) - 1; i >= 0; i--) {
            let value
            if ((a[i] == '0' && b[i] == '0') || a[i] == '1' && b[i] == '1') {
                value = '0'
            } else {
                value = '1'
            }
            if ((value == '0' && carry == '0') || (value == '1' && carry == '1')) {
                result = '0' + result
            } else {
                result = '1' + result
            }
            carry = ((a[i] == '0' && b[i] == '1') || (value == '0' && carry == '1')) ? '1' : '0'
        }
        k = 0
        while (result[k] == '0') {
            k++
        }
        return isNegativeNumber + result.slice(k, result.length)
    },
    mod: (a, b) => {
        let result = ""
        let length = a.length
        let i = 0
        while (i < length) {
            if (binary.compare(result, b) >= 0) {
                result = binary.subtraction(result, b)
            } else {
                result += a[i]
                i++
            }
        }
        if (binary.compare(result, b) >= 0) {
            result = binary.subtraction(result, b)
        }
        return result
    },
    NOT: (x) => {
        let result = ""
        for (let value of x) {
            if (value == '0') {
                result += '1'
            } else {
                result += '0'
            }
        }
        return result
    },
    _AND: (a, b) => {
        let len_a = a.length
        let len_b = b.length
        let k = Math.abs(len_a - len_b)
        while (k-- > 0) {
            if (len_a < len_b) {
                a = '0' + a
            } else {
                b = '0' + b
            }
        }
        let result = ""
        for (let i = Math.max(len_a, len_b) - 1; i >= 0; i--) {
            let value = '1'
            if (a[i] == '0' || b[i] == '0') {
                value = '0'
            }
            result = value + result
        }
        return result
    },
    AND: (...args) => {
        if (args.length == 1) {
            return args[0]
        }
        let result = args[0]
        for (let value of args) {
            result = binary._AND(result, value)
        }
        return result
    },
    multiplication: (a, b) => {
        if(a == '0' != b == '0') {
            return '0'
        }
        let result = '0'
        let carry = ''
        for (let i = b.length - 1; i >= 0; i--) {
            let value = b[i]
            if (value == '1') {
                result = binary._add(result, a + carry)
            }
            carry += '0'
        }
        return binary.trim(result)
    },
    trim: (n) => {
        let k = 0
        while(n[k] != 1) {
            k++
        }
        return n.slice(k, n.length)
    },
    powAndMod: (x, n, m) => {
        let p = '1'
        for (let value of n) {
            p = binary.multiplication(p, p)
            p = binary.mod(p, m)
            if (value == '1') {
                p = binary.multiplication(p, x)
                p = binary.mod(p, m)
            }
        }
        return p
    }
}

const converter = {
    decimalToBinary: (number) => {
        let result = ""
        while (number > 0) {
            if (others.mod(number, 2) == 0) {
                result = '0' + result
            } else {
                result = '1' + result
            }
            number = Math.floor(number / 2)
        }
        return result
    },
    textToBinary: (text) => {
        let encoder = new TextEncoder()
        let textEncoded = encoder.encode(text)
        console.log()
        let result = []
        let length = textEncoded.length
        let n = Math.floor(length / _64_BITS) + 1
        for (let i = 0; i < n; i++) {
            let subResult = ""
            let start = i * _64_BITS
            let end = (start + _64_BITS > length) ? length : start + _64_BITS
            for (let j = start; j < end; j++) {
                let _8_bits = converter.decimalToBinary(textEncoded[j]);
                _8_bits = binary.fixBit(_8_bits, _8_BITS)
                subResult += _8_bits
            }
            result.push(subResult)
        }
        return [result, length * 8]
    },
    hexToBinary: (n) => {
        n = n.toUpperCase()
        let result = ""
        for (let value of n) {
            let index = (value >= '0' && value <= '9') ? others.charCode(value) - others.charCode('0') : others.charCode(value) - others.charCode('A') + 10
            result += _4_BITS_HEX[index]
        }
        let k = 0
        while (result[k] == '0') {
            k++
        }
        return result.slice(k, result.length)
    },
    binaryToDecimal: (n) => {
        let result = 0
        for (let value of n) {
            if (value == '0') {
                result *= 2
            } else {
                result = result * 2 + 1
            }
        }
        return result
    },
    binaryToHex: (n) => {
        let result = ""
        let k = others.mod(n.length, _4_BITS)
        if (k != 0) {
            n = binary.fixBit(n, n.length + _4_BITS - k)
        }
        for (let i = 0; i < n.length; i += 4) {
            let _4_bits = n.slice(i, i + 4)
            result += others.getCharHexFrom4Bits(_4_bits)
        }
        return result
    }
}

export default { others, binary, converter }