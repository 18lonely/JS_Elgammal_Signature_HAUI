import { SHA_256 } from "./sha256.js"
import functions from "./functions.js"

// ESD = Elgammal Signature Digital
function generateESD(plainText, k, gammal, p, a) {
    // Tạo hash
    console.time('Thời gian tạo hash: ')
    let hash = SHA_256(plainText)
    console.timeEnd('Thời gian tạo hash: ')
    console.log("HASH : " + hash)
    let bin_hash = functions.converter.hexToBinary(hash)
    let bin_reverseModuloK = functions.converter.decimalToBinary(functions.others.euclideExtended(p - 1, k))
    let bin_gammal = functions.converter.decimalToBinary(gammal)
    let bin_a = functions.converter.decimalToBinary(a)
    let bin_p_subtrac_1 = functions.converter.decimalToBinary(p - 1)
    // delta = (x - a * gammal) * k ^ (-1) mod (p - 1)
    let y = functions.binary.subtraction(bin_hash, functions.binary.multiplication(bin_a, bin_gammal))
    let delta = functions.binary.mod(functions.binary.multiplication(y, bin_reverseModuloK), bin_p_subtrac_1)
    bin_gammal = functions.binary.trim(bin_gammal)
    delta = functions.binary.trim(delta)
    return functions.converter.binaryToHex(bin_gammal) + '+' + functions.converter.binaryToHex(delta)
}

function verifyESD(plainText, signature, beta, alpha, p) {
    // beta ^ gammal * gammal ^ delta = alpha ^ x mod p
    // Lấy gammal, delta từ chữ ký
    let arr = signature.split('+')
    if (arr.length != 2) {
        return 'Chữ ký không đúng định dạng'
    }
    let [gammal, delta] = arr
    let bin_gammal = functions.converter.hexToBinary(gammal)
    let bin_delta = functions.converter.hexToBinary(delta)
    let bin_p = functions.converter.decimalToBinary(p)
    let bin_beta = functions.converter.decimalToBinary(beta)
    let bin_alpha = functions.converter.decimalToBinary(alpha)

    // left = (beta ^ gammal * gammal ^ delta) mod p
    //      = ((beta ^ gammal) mod p * gammal ^ delta mod p) mod p
    //      = (y1 * y2) mod p
    let y1 = functions.binary.powAndMod(bin_beta, bin_gammal, bin_p)
    let y2 = functions.binary.powAndMod(bin_gammal, bin_delta, bin_p)
    let left = functions.binary.mod(functions.binary.multiplication(y1, y2), bin_p)

    let hash = SHA_256(plainText)
    console.log('Hash check: ' + hash)
    let bin_hash = functions.converter.hexToBinary(hash)
    let right = functions.binary.powAndMod(bin_alpha, bin_hash, bin_p)

    if(functions.binary.trim(left) == functions.binary.trim(right)) {
        return "Chữ ký đúng và văn bản không bị sửa đổi!"
    } else {
        return "Chữ ký sai hoặc văn bản đã bị sửa đổi!"
    }
}

export { generateESD, verifyESD }