const uuidHex = '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b';
const uuidDec = BigInt('0x' + uuidHex.replace(/-/g, ''));
console.log(uuidDec.toString().substr(1,10));