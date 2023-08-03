'use strict'

import { isPrime, prime } from "./prime.js";
import functions from "./functions.js"
import { generateESD, verifyESD } from "./elgammal_signature.js"

let plainText = ''
let plainTextCheck = ''

const unzipper = require('unzipper');
const fs = require('fs');

// Elements

const buttonUploadFile0 = document.querySelector(".btn-file-upload-0")
const inputFileUpload0 = document.querySelector(".input-file-upload-0")
const outputFileName0 = document.querySelector(".output-file-name-0")

const buttonUploadFile1 = document.querySelector(".btn-file-upload-1")
const inputFileUpload1 = document.querySelector(".input-file-upload-1")
const outputFileName1 = document.querySelector(".output-file-name-1")

const buttonUploadFile2 = document.querySelector(".btn-file-upload-2")
const inputFileUpload2 = document.querySelector(".input-file-upload-2")
const outputFileName2 = document.querySelector(".output-file-name-2")

const error_0 = document.querySelector(".error-0")
const message_0 = document.querySelector(".message-0")
const error_1 = document.querySelector(".error-1")
const message_1 = document.querySelector(".message-1")
const error_2 = document.querySelector(".error-2")
const message_2 = document.querySelector(".message-2")
const error_3 = document.querySelector(".error-3")
const message_3 = document.querySelector(".message-3")
const error_4 = document.querySelector(".error-4")
const message_4 = document.querySelector(".message-4")
const error_5 = document.querySelector(".error-5")
const message_5 = document.querySelector(".message-5")
const error_6 = document.querySelector(".error-6")
const message_6 = document.querySelector(".message-6")
const error_7 = document.querySelector(".error-7")
const message_7 = document.querySelector(".message-7")
const error_8 = document.querySelector(".error-8")
const message_8 = document.querySelector(".message-8")

// Input tags
const inputPrimeP = document.querySelector(".p-prime")
const inputNumberAlpha = document.querySelector(".alpha-number")
const inputNumberBeta = document.querySelector(".beta-number")
const inputPrivateNumberA = document.querySelector(".private-number-a")
const inputPrivateNumberK = document.querySelector(".private-number-k")
const inputNumberGammal = document.querySelector(".gammal-number")
const inputPlainText = document.querySelector(".plain-text-input")
const outputSignatureDigital = document.querySelector(".output-signature-digital")
const inputPlainTextCheck = document.querySelector(".plain-text-input-check")
const inputSignatureDigitalCheck = document.querySelector(".input-signature-digital-check")
const outputCheckSignatureDigital = document.querySelector(".message-check")

// Buttons
const btnGenerateKey = document.querySelector(".generate-full")
const btnActionSignature = document.querySelector(".btn-action-signature")
const btnTranferSignature = document.querySelector(".btn-tranfer-signature")
const btnCheckSignature = document.querySelector(".btn-check-signature")
const btnSaveFile = document.querySelector(".btn-save-file")
const btnClearAll = document.querySelector(".btn-clear-all")

// Xử lý khi bấm nút ký
btnActionSignature.addEventListener("click", () => {
    let ok1 = checkKey()
    let ok2 = true
    
    let isUploadedFile = outputFileName0.innerText == '' ? false : true;

    if(!isUploadedFile) {
        plainText = inputPlainText.innerText
    }

    // Xử lý bản rõ
    if (plainText == '') {
        error_6.style.display = 'inline-block'
        message_6.innerText = 'Chưa chọn file hoặc nhập dữ liệu'
        ok2 = false
    } else {
        error_6.style.display = 'none'
    }

    if (ok1 && ok2) {
        console.time("Thời gian thực hiện ký: ")
        outputSignatureDigital.innerText = generateESD(plainText, Number(inputPrivateNumberK.value)
            , Number(inputNumberGammal.value), Number(inputPrimeP.value), Number(inputPrivateNumberA.value))
        console.timeEnd("Thời gian thực hiện ký: ")
    }
})

// Xử lý khi bấm nút kiểm tra chữ ký
btnCheckSignature.addEventListener("click", () => {
    let p = inputPrimeP.value.trim()
    let alpha = inputNumberAlpha.value.trim()
    let beta = inputNumberBeta.value.trim()

    let isUploadedFile = outputFileName1.innerText == '' ? false : true;

    if(!isUploadedFile) {
        plainTextCheck = inputPlainTextCheck.innerText
    }

    let signature = inputSignatureDigitalCheck.innerText

    let ok1 = true
    let ok2 = true

    // Xử lý số p
    if (p == '') {
        error_0.style.display = 'inline-block'
        message_0.innerText = 'Chưa nhập dữ liệu'
        ok1 = false
    } else if (isNaN(p)) {
        error_0.style.display = 'inline-block'
        message_0.innerText = 'Không đúng định dạng số'
        ok1 = false
    } else if (!isPrime(Number(p))) {
        error_0.style.display = 'inline-block'
        message_0.innerText = '"p" không phải số nguyên tố'
        ok1 = false
    } else {
        error_0.style.display = 'none'
        message_0.innerText = ''
    }

    // Xử lý số alpha
    if (alpha == '') {
        error_1.style.display = 'inline-block'
        message_1.innerText = 'Chưa nhập dữ liệu'
        ok1 = false
    } else if (isNaN(alpha)) {
        error_1.style.display = 'inline-block'
        message_1.innerText = 'Không đúng định dạng số'
        ok1 = false
    } else if (p != '' && (alpha < 1 || alpha > p - 1)) {
        error_1.style.display = 'inline-block'
        message_1.innerText = 'α ∉ {1, p - 1}'
        ok1 = false
    } else {
        error_1.style.display = 'none'
        message_1.innerText = ''
    }

    // Xử lý số beta
    if (beta == '') {
        error_2.style.display = 'inline-block'
        message_2.innerText = 'Chưa nhập dữ liệu'
        ok1 = false
    } else {
        error_2.style.display = 'none'
        message_2.innerText = ''
    }

    // Xử lý ô nhập văn bản
    if (plainTextCheck == '') {
        error_7.style.display = 'inline-block'
        message_7.innerText = 'Chưa chọn file hoặc nhập dữ liệu'
        ok2 = false
    } else {
        error_7.style.display = 'none'
    }

    // Xử lý ô nhập chữ ký
    if (signature == '') {
        error_8.style.display = 'inline-block'
        message_8.innerText = 'Chưa chọn file hoặc nhập dữ liệu'
        ok2 = false
    } else {
        error_8.style.display = 'none'
    }

    if (ok1 && ok2) {
        console.time('Thời gian thực hiện kiểm tra chữ kí')
        let message = verifyESD(plainTextCheck, signature, Number(beta), Number(alpha), Number(p))
        console.timeEnd('Thời gian thực hiện kiểm tra chữ kí')
        outputCheckSignatureDigital.innerText = message
    }
})

// Xử lý sự kiện khi bấm nút lưu
btnSaveFile.addEventListener('click', function () {
    const fileContent = outputSignatureDigital.innerText;

    const blob = new Blob([fileContent], { type: 'text/plain' });

    const fileURL = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = fileURL;
    link.download = 'ChuKi.txt';

    link.click();

    URL.revokeObjectURL(fileURL);
});

// Xử lý upload file
buttonUploadFile0.addEventListener('click', () => {
    inputFileUpload0.click()
})

inputFileUpload0.addEventListener('change', () => {
    const file = inputFileUpload0.files[0]
    const fileName = file.name
    outputFileName0.innerText = fileName

    const isFileText = (fileName.slice(fileName.length - 4, fileName.length) == '.txt') ? true : false
    let fr = new FileReader()
    if (isFileText) {
        fr.readAsText(file)
        fr.addEventListener('load', () => {
            inputPlainText.innerHTML = fr.result
            error_6.style.display = 'none'
        })
    } else {
        PreviewWordDocx(file, inputPlainText)
        error_6.style.display = 'none'
        fs.createReadStream(file.path)
            .pipe(unzipper.Parse())
            .on('entry', entry => {
                if (entry.path === 'word/document.xml') {
                    let xmlString = '';
                    entry.on('data', chunk => {
                        xmlString += chunk.toString();
                    });
                    entry.on('end', () => {
                        plainText = xmlString
                    });
                } else {
                    entry.autodrain();
                }
            })
            .on('error', error => {
                console.error('Lỗi giải nén tệp:', error);
            })
            .on('finish', () => {
                console.log('Trích xuất thành công');
            });
    }

    inputFileUpload0.value = null;
})

buttonUploadFile1.addEventListener('click', () => {
    inputFileUpload1.click()
})

inputFileUpload1.addEventListener('change', (e) => {
    const file = e.target.files[0]
    const fileName = file.name
    outputFileName1.innerText = fileName

    const isFileText = (fileName.slice(fileName.length - 4, fileName.length) == '.txt') ? true : false

    if (isFileText) {
        let fr = new FileReader()
        fr.readAsText(file)
        fr.addEventListener('load', () => {
            inputPlainTextCheck.innerHTML = fr.result
            error_7.style.display = 'none'
        })
    } else {
        PreviewWordDocx(file, inputPlainTextCheck)
        error_7.style.display = 'none'
        fs.createReadStream(file.path)
            .pipe(unzipper.Parse())
            .on('entry', entry => {
                if (entry.path === 'word/document.xml') {
                    let xmlString = '';
                    entry.on('data', chunk => {
                        xmlString += chunk.toString();
                    });
                    entry.on('end', () => {
                        plainTextCheck = xmlString
                    });
                } else {
                    entry.autodrain();
                }
            })
            .on('error', error => {
                console.error('Lỗi giải nén tệp:', error);
            })
            .on('finish', () => {
                console.log('Trích xuất thành công');
            });
    }
    inputFileUpload1.value = null;
})

buttonUploadFile2.addEventListener('click', () => {
    inputFileUpload2.click()
})

inputFileUpload2.addEventListener('change', (e) => {
    const file = e.target.files[0]
    const fileName = file.name
    outputFileName2.innerText = fileName

    const isFileText = (fileName.slice(fileName.length - 4, fileName.length) == '.txt') ? true : false

    if (isFileText) {
        let fr = new FileReader()
        fr.readAsText(file)
        fr.addEventListener('load', () => {
            inputSignatureDigitalCheck.innerHTML = fr.result
            error_8.style.display = 'none'
        })
    }

    inputFileUpload2.value = null;
})

// Xử lý nút tạo khóa
btnGenerateKey.addEventListener('click', () => {
    console.time("Thời gian sinh khóa tự động: ")
    let p = prime[Math.floor((Math.random() * prime.length - (1000)) + (1000))]
    let alpha = Math.floor((Math.random() * p - 1 - 1) + 1)
    let a = Math.floor((Math.random() * p - 2 - 2) + 2)
    let k
    for (let i = Math.floor(p / 8); i <= p - 2; i++) {
        if (functions.others.gcd(i, p - 1) == 1) {
            k = i
            break
        }
    }
    let beta = functions.others.powAndMod(alpha, a, p)
    let gammal = functions.others.powAndMod(alpha, k, p)
    inputPrimeP.value = p
    inputNumberAlpha.value = alpha
    inputNumberBeta.value = beta
    inputPrivateNumberA.value = a
    inputPrivateNumberK.value = k
    inputNumberGammal.value = gammal

    error_0.style.display = 'none'
    message_0.value = ''
    error_1.style.display = 'none'
    message_1.value = ''
    error_2.style.display = 'none'
    message_2.value = ''
    error_3.style.display = 'none'
    message_3.value = ''
    error_4.style.display = 'none'
    message_4.value = ''
    error_5.style.display = 'none'
    message_5.value = ''
    console.timeEnd("Thời gian sinh khóa tự động: ")
})


// Add DOM Events
inputPlainText.addEventListener('click', () => {
    error_6.style.display = 'none'
})

inputPlainTextCheck.addEventListener('click', () => {
    error_7.style.display = 'none'
})

inputSignatureDigitalCheck.addEventListener('click', () => {
    error_8.style.display = 'none'
})

// Xử lý khi click vào nút chuyển
btnTranferSignature.addEventListener('click', () => {
    inputSignatureDigitalCheck.innerText = outputSignatureDigital.innerText
    error_8.style.display = 'none'
})

// Click clear all
btnClearAll.addEventListener('click', () => {
    plainText = ''
    plainTextCheck = ''

    error_0.style.display = 'none'
    error_1.style.display = 'none'
    error_2.style.display = 'none'
    error_3.style.display = 'none'
    error_4.style.display = 'none'
    error_5.style.display = 'none'
    error_6.style.display = 'none'
    error_7.style.display = 'none'
    error_8.style.display = 'none'

    inputPrimeP.value = ''
    inputNumberAlpha.value = ''
    inputNumberBeta.value = ''
    inputPrivateNumberA.value = ''
    inputPrivateNumberK.value = ''
    inputNumberGammal.value = ''
    inputPlainText.innerHTML = ''
    outputSignatureDigital.innerHTML = ''
    inputPlainTextCheck.innerHTML = ''
    inputSignatureDigitalCheck.innerHTML = ''
    outputCheckSignatureDigital.innerHTML = ''

    outputFileName0.innerText = ''
    outputFileName1.innerText = ''
    outputFileName2.innerText = ''

    console.log("Clear all successfully!")
})

// Functions
function checkKey() {
    let p = inputPrimeP.value.trim()
    let alpha = inputNumberAlpha.value.trim()
    let beta = inputNumberBeta.value.trim()
    let a = inputPrivateNumberA.value.trim()
    let k = inputPrivateNumberK.value.trim()
    let gammal = inputNumberGammal.value.trim()

    let ok1 = true
    // Xử lý số p
    if (p == '') {
        error_0.style.display = 'inline-block'
        message_0.innerText = 'Chưa nhập dữ liệu'
        ok1 = false
    } else if (isNaN(p)) {
        error_0.style.display = 'inline-block'
        message_0.innerText = 'Không đúng định dạng số'
        ok1 = false
    } else if (!isPrime(Number(p))) {
        error_0.style.display = 'inline-block'
        message_0.innerText = '"p" không phải số nguyên tố'
        ok1 = false
    } else {
        error_0.style.display = 'none'
        message_0.innerText = ''
    }

    // Xử lý số alpha
    if (alpha == '') {
        error_1.style.display = 'inline-block'
        message_1.innerText = 'Chưa nhập dữ liệu'
        ok1 = false
    } else if (isNaN(alpha)) {
        error_1.style.display = 'inline-block'
        message_1.innerText = 'Không đúng định dạng số'
        ok1 = false
    } else if (p != '' && (alpha < 1 || alpha > p - 1)) {
        error_1.style.display = 'inline-block'
        message_1.innerText = 'α ∉ {1, p - 1}'
        ok1 = false
    } else {
        error_1.style.display = 'none'
        message_1.innerText = ''
    }

    // Xử lý số beta
    if (alpha != '' && a != '' && p != '') {
        let tmp = functions.others.powAndMod(alpha, a, p)
        if (Number(beta) != tmp) {
            inputNumberBeta.value = tmp
        }
        error_2.style.display = 'none'
        message_2.innerText = ''
    } else if (beta == '') {
        error_2.style.display = 'inline-block'
        message_2.innerText = 'Chưa nhập dữ liệu'
        ok1 = false
    } else {
        error_2.style.display = 'none'
        message_2.innerText = ''
    }

    // Xử lý a
    if (a == '') {
        error_3.style.display = 'inline-block'
        message_3.innerText = 'Chưa nhập dữ liệu'
        ok1 = false
    } else if (p != '' && (a < 2 || a > p - 2)) {
        error_3.style.display = 'inline-block'
        message_3.innerText = 'α ∉ {2, p - 2}'
        ok1 = false
    } else {
        error_3.style.display = 'none'
        message_3.innerText = ''
    }

    // Xử lý k
    if ((k == '' && p != '' && alpha != '') || (k != '' && p != '' && functions.others.gcd(Number(k), Number(p) - 1) != 1)) {
        let k_random
        let p_number = Number(p)
        for (let i = Math.floor(p / 8); i <= p_number - 2; i++) {
            if (functions.others.gcd(i, p_number - 1) == 1) {
                k_random = i
                break
            }
        }
        k = k_random
        inputPrivateNumberK.value = k_random
        inputNumberGammal.value = functions.others.powAndMod(Number(alpha), k, p_number)
        error_4.style.display = 'none'
        message_4.innerText = ''
    } else if (k == '') {
        error_4.style.display = 'inline-block'
        message_4.innerText = 'Chưa nhập dữ liệu'
        ok1 = false
    }
    else if (p != '' && (k < 1 || k > p - 2)) {
        error_4.style.display = 'inline-block'
        message_4.innerText = 'k ∉ {1, p - 2}'
        ok1 = false
    } else if (p != '' && functions.others.gcd(k, p - 1) != 1) {
        error_4.style.display = 'inline-block'
        message_4.innerText = 'GCD(k, p - 1) != 1'
        ok1 = false
    } else {
        error_4.style.display = 'none'
        message_4.innerText = ''
    }

    // Xử lý gammal
    if (alpha != '' && k != '' && p != '') {
        let tmp = functions.others.powAndMod(alpha, k, p)
        if (Number(gammal) != tmp) {
            inputNumberGammal.value = tmp
        }
        error_5.style.display = 'none'
        message_5.innerText = ''
    } else if (gammal == '') {
        error_5.style.display = 'inline-block'
        message_5.innerText = 'Chưa nhập dữ liệu'
        ok1 = false
    } else {
        error_5.style.display = 'none'
        message_5.innerText = ''
    }

    return ok1
}

function PreviewWordDocx(file, container) {
    if (file != null) {
        var docxOptions = Object.assign(docx.defaultOptions, {
            useMathMLPolyfill: true
        });

        docx.renderAsync(file, container, null, docxOptions);
    }
}