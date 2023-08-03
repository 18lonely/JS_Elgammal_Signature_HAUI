// Source: https://sha256algorithm.com/
"use strict"

import functions from "./functions.js"

// Constants
const _448_BITS = 448
const _512_BITS = 512
const _32_BITS = 32
const _64_BITS = 64
const BINARY_2_POW_32 = "100000000000000000000000000000000"
const SQRT_2_DECIMAL_32BITS = "01101010000010011110011001100111"
const SQRT_3_DECIMAL_32BITS = "10111011011001111010111010000101"
const SQRT_5_DECIMAL_32BITS = "00111100011011101111001101110010"
const SQRT_7_DECIMAL_32BITS = "10100101010011111111010100111010"
const SQRT_11_DECIMAL_32BITS = "01010001000011100101001001111111"
const SQRT_13_DECIMAL_32BITS = "10011011000001010110100010001100"
const SQRT_17_DECIMAL_32BITS = "00011111100000111101100110101011"
const SQRT_19_DECIMAL_32BITS = "01011011111000001100110100011001"

// 32 bits phần thập phân căn bậc 2 của 64 số nguyên tố đầu tiên
const K = ['01000010100010100010111110011000',
    '01110001001101110100010010010001',
    '10110101110000001111101111001111',
    '11101001101101011101101110100101',
    '00111001010101101100001001011011',
    '01011001111100010001000111110001',
    '10010010001111111000001010100100',
    '10101011000111000101111011010101',
    '11011000000001111010101010011000',
    '00010010100000110101101100000001',
    '00100100001100011000010110111110',
    '01010101000011000111110111000011',
    '01110010101111100101110101110100',
    '10000000110111101011000111111110',
    '10011011110111000000011010100111',
    '11000001100110111111000101110100',
    '11100100100110110110100111000001',
    '11101111101111100100011110000110',
    '00001111110000011001110111000110',
    '00100100000011001010000111001100',
    '00101101111010010010110001101111',
    '01001010011101001000010010101010',
    '01011100101100001010100111011100',
    '01110110111110011000100011011010',
    '10011000001111100101000101010010',
    '10101000001100011100011001101101',
    '10110000000000110010011111001000',
    '10111111010110010111111111000111',
    '11000110111000000000101111110011',
    '11010101101001111001000101000111',
    '00000110110010100110001101010001',
    '00010100001010010010100101100111',
    '00100111101101110000101010000101',
    '00101110000110110010000100111000',
    '01001101001011000110110111111100',
    '01010011001110000000110100010011',
    '01100101000010100111001101010100',
    '01110110011010100000101010111011',
    '10000001110000101100100100101110',
    '10010010011100100010110010000101',
    '10100010101111111110100010100001',
    '10101000000110100110011001001011',
    '11000010010010111000101101110000',
    '11000111011011000101000110100011',
    '11010001100100101110100000011001',
    '11010110100110010000011000100100',
    '11110100000011100011010110000101',
    '00010000011010101010000001110000',
    '00011001101001001100000100010110',
    '00011110001101110110110000001000',
    '00100111010010000111011101001100',
    '00110100101100001011110010110101',
    '00111001000111000000110010110011',
    '01001110110110001010101001001010',
    '01011011100111001100101001001111',
    '01101000001011100110111111110011',
    '01110100100011111000001011101110',
    '01111000101001010110001101101111',
    '10000100110010000111100000010100',
    '10001100110001110000001000001000',
    '10010000101111101111111111111010',
    '10100100010100000110110011101011',
    '10111110111110011010001111110111',
    '11000110011100010111100011110010']

function SHA_256(text) {
    // Chuyển văn bản sang dạng nhị phân
    let [blocks, lenText] = functions.converter.textToBinary(text)
    let n = blocks.length

    // Thêm các bit để số bit bằng bội của 512
    let lastBlock = blocks[n - 1]
    let lengthLastBlock = lastBlock.length + 1
    lastBlock += '1'
    if (lengthLastBlock > _448_BITS) {
        while (lengthLastBlock++ < _512_BITS) {
            lastBlock += '0'
        }
        let tmpBlock = functions.converter.decimalToBinary(lenText)
        tmpBlock = functions.binary.fixBit(tmpBlock, _512_BITS)
        blocks[n - 1] = lastBlock
        blocks.push(tmpBlock)
        n++
    } else {
        let tmpBlock = functions.converter.decimalToBinary(lenText)
        tmpBlock = functions.binary.fixBit(tmpBlock, _64_BITS + (_448_BITS - lengthLastBlock))
        blocks[n - 1] = lastBlock + tmpBlock
    }

    let h0 = SQRT_2_DECIMAL_32BITS
    let h1 = SQRT_3_DECIMAL_32BITS
    let h2 = SQRT_5_DECIMAL_32BITS
    let h3 = SQRT_7_DECIMAL_32BITS
    let h4 = SQRT_11_DECIMAL_32BITS
    let h5 = SQRT_13_DECIMAL_32BITS
    let h6 = SQRT_17_DECIMAL_32BITS
    let h7 = SQRT_19_DECIMAL_32BITS

    // Chuyển đổi mỗi block thành 64 đoạn mỗi đoạn 32 bits
    for (let i = 0; i < n; i++) {
        // Khởi tạo
        let a = h0
        let b = h1
        let c = h2
        let d = h3
        let e = h4
        let f = h5
        let g = h6
        let h = h7

        let w = []
        // 16 đoạn đầu tiên lấy từ việc chia từ khối block 512 bits
        for (let j = 0; j < 16; j++) {
            let start = j * _32_BITS
            let end = start + _32_BITS
            w.push(blocks[i].slice(start, end))

            let T1 = functions.binary.fixBit(functions.binary.mod(functions.binary.add(h, functions.binary.XOR(functions.binary.ROTR(e, 6), functions.binary.ROTR(e, 11), functions.binary.ROTR(e, 25)), functions.binary.XOR(functions.binary.AND(e, f), functions.binary.AND(functions.binary.NOT(e), g)), K[j], w[j]), BINARY_2_POW_32), 32)
            let T2 = functions.binary.fixBit(functions.binary.mod(functions.binary.add(functions.binary.XOR(functions.binary.ROTR(a, 2), functions.binary.ROTR(a, 13), functions.binary.ROTR(a, 22)), functions.binary.XOR(functions.binary.AND(a, b), functions.binary.AND(a, c), functions.binary.AND(b, c))), BINARY_2_POW_32), 32);
            h = g
            g = f
            f = e
            e = functions.binary.fixBit(functions.binary.mod(functions.binary.add(d, T1), BINARY_2_POW_32), 32)
            d = c
            c = b
            b = a
            a = functions.binary.fixBit(functions.binary.mod(functions.binary.add(T1, T2), BINARY_2_POW_32), 32)
        }
        /*
        * 48 đoạn còn lại tính theo công thức w[i] = (sigma_1(w[i - 2]) + w[i - 7] + sigma_0(w[i - 15]) + w[i - 16]) mod 2 ^ 32
        * sigma_0(x) = ROTR(x, 7) XOR ROTR(x, 18) XOR SHR(x, 3)
        * sigma_1(x) = ROTR(x, 17) XOR ROTR(x, 19) XOR SHR(x, 10)
        */
        for (let j = 16; j < 64; j++) {
            let tmp = functions.binary.fixBit(functions.binary.mod(functions.binary.add(
                functions.binary.XOR(
                    functions.binary.ROTR(w[j - 2], 17),
                    functions.binary.ROTR(w[j - 2], 19),
                    functions.binary.SHR(w[j - 2], 10)
                ),
                w[j - 7],
                functions.binary.XOR(
                    functions.binary.ROTR(w[j - 15], 7),
                    functions.binary.ROTR(w[j - 15], 18),
                    functions.binary.SHR(w[j - 15], 3)
                ),
                w[j - 16]), BINARY_2_POW_32), _32_BITS)
            w.push(tmp)

            let T1 = functions.binary.fixBit(functions.binary.mod(functions.binary.add(h, functions.binary.XOR(functions.binary.ROTR(e, 6), functions.binary.ROTR(e, 11), functions.binary.ROTR(e, 25)), functions.binary.XOR(functions.binary.AND(e, f), functions.binary.AND(functions.binary.NOT(e), g)), K[j], w[j]), BINARY_2_POW_32), 32)
            let T2 = functions.binary.fixBit(functions.binary.mod(functions.binary.add(functions.binary.XOR(functions.binary.ROTR(a, 2), functions.binary.ROTR(a, 13), functions.binary.ROTR(a, 22)), functions.binary.XOR(functions.binary.AND(a, b), functions.binary.AND(a, c), functions.binary.AND(b, c))), BINARY_2_POW_32), 32);
            h = g
            g = f
            f = e
            e = functions.binary.fixBit(functions.binary.mod(functions.binary.add(d, T1), BINARY_2_POW_32), 32)
            d = c
            c = b
            b = a
            a = functions.binary.fixBit(functions.binary.mod(functions.binary.add(T1, T2), BINARY_2_POW_32), 32)
        }
        // blocks[i] = w

        h0 = functions.binary.fixBit(functions.binary.mod(functions.binary.add(a, h0), BINARY_2_POW_32), 32)
        h1 = functions.binary.fixBit(functions.binary.mod(functions.binary.add(b, h1), BINARY_2_POW_32), 32)
        h2 = functions.binary.fixBit(functions.binary.mod(functions.binary.add(c, h2), BINARY_2_POW_32), 32)
        h3 = functions.binary.fixBit(functions.binary.mod(functions.binary.add(d, h3), BINARY_2_POW_32), 32)
        h4 = functions.binary.fixBit(functions.binary.mod(functions.binary.add(e, h4), BINARY_2_POW_32), 32)
        h5 = functions.binary.fixBit(functions.binary.mod(functions.binary.add(f, h5), BINARY_2_POW_32), 32)
        h6 = functions.binary.fixBit(functions.binary.mod(functions.binary.add(g, h6), BINARY_2_POW_32), 32)
        h7 = functions.binary.fixBit(functions.binary.mod(functions.binary.add(h, h7), BINARY_2_POW_32), 32)
    }

    // let h0 = SQRT_2_DECIMAL_32BITS
    // let h1 = SQRT_3_DECIMAL_32BITS
    // let h2 = SQRT_5_DECIMAL_32BITS
    // let h3 = SQRT_7_DECIMAL_32BITS
    // let h4 = SQRT_11_DECIMAL_32BITS
    // let h5 = SQRT_13_DECIMAL_32BITS
    // let h6 = SQRT_17_DECIMAL_32BITS
    // let h7 = SQRT_19_DECIMAL_32BITS

    // for(let i = 0; i < n; i++) {
    //     let a = h0
    //     let b = h1
    //     let c = h2
    //     let d = h3
    //     let e = h4
    //     let f = h5
    //     let g = h6
    //     let h = h7
    //     let w = blocks[i]
    //     for(let j = 0; j < 64; j++) {
    //         // T1 = h + (ROTR(e, 6) XOR ROTR(e, 11) XOR ROTR(e, 25)) + ((e AND f) XOR (NOT(e) AND g)) + K[j] + w[j]
    //         // T2 = (ROTR(a, 2) XOR ROTR(a, 13) XOR ROTR(a, 22)) + ((a AND b) XOR (a AND c) XOR (b AND c))
    //         // h = g
    //         // g = f
    //         // f = e
    //         // e = d + T1
    //         // d = c
    //         // c = b
    //         // b = a
    //         // a = T1 + T2
    //         let T1 = functions.binary.fixBit(functions.binary.mod(functions.binary.add(h, functions.binary.XOR(functions.binary.ROTR(e, 6), functions.binary.ROTR(e, 11), functions.binary.ROTR(e, 25)), functions.binary.XOR(functions.binary.AND(e, f), functions.binary.AND(functions.binary.NOT(e), g)), K[j], w[j]), BINARY_2_POW_32), 32)
    //         let T2 = functions.binary.fixBit(functions.binary.mod(functions.binary.add(functions.binary.XOR(functions.binary.ROTR(a, 2), functions.binary.ROTR(a, 13), functions.binary.ROTR(a, 22)), functions.binary.XOR(functions.binary.AND(a, b), functions.binary.AND(a, c), functions.binary.AND(b, c))), BINARY_2_POW_32), 32);
    //         h = g
    //         g = f
    //         f = e
    //         e = functions.binary.fixBit(functions.binary.mod(functions.binary.add(d, T1), BINARY_2_POW_32), 32)
    //         d = c
    //         c = b
    //         b = a
    //         a = functions.binary.fixBit(functions.binary.mod(functions.binary.add(T1, T2), BINARY_2_POW_32), 32)
    //     }
    //     h0 = functions.binary.fixBit(functions.binary.mod(functions.binary.add(a, h0), BINARY_2_POW_32), 32)
    //     h1 = functions.binary.fixBit(functions.binary.mod(functions.binary.add(b, h1), BINARY_2_POW_32), 32)
    //     h2 = functions.binary.fixBit(functions.binary.mod(functions.binary.add(c, h2), BINARY_2_POW_32), 32)
    //     h3 = functions.binary.fixBit(functions.binary.mod(functions.binary.add(d, h3), BINARY_2_POW_32), 32)
    //     h4 = functions.binary.fixBit(functions.binary.mod(functions.binary.add(e, h4), BINARY_2_POW_32), 32)
    //     h5 = functions.binary.fixBit(functions.binary.mod(functions.binary.add(f, h5), BINARY_2_POW_32), 32)
    //     h6 = functions.binary.fixBit(functions.binary.mod(functions.binary.add(g, h6), BINARY_2_POW_32), 32)
    //     h7 = functions.binary.fixBit(functions.binary.mod(functions.binary.add(h, h7), BINARY_2_POW_32), 32)
    // } 

    return functions.converter.binaryToHex(h0 + h1 + h2 + h3 + h4 + h5 + h6 + h7).toUpperCase()
}

export { SHA_256 }


