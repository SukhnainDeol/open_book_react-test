

export function setPass(pass) {

let temp = encryptor(pass);
let temp2 = encryptor(temp); // DOUBLE ENCRYPTED HALF

return temp2 + temp;
}

function ArrayToText(arr){
    return String.fromCharCode(...arr);
  };

  function encryptor(pass) {
    let range = {
        "lowercase" : [96, 122],
        "uppercase" : [64, 90],
        "numbers" : [48, 57],
        "special" : [33, 42],
        "letter-length": 25,
        "number-length": 9
    }

    let arr = [];

    for(let i = 0; i < pass.length; i++) {
        let tmp = pass.charCodeAt(i);

        if(tmp >= range.uppercase[0] && tmp <= range.uppercase[1]) { // LOWER CASE LETTER
            tmp += 32; // TURNS UPPER TO LOWERCASE LETTER

            if(tmp % 2 === 0){ // SHIFTS BY LENGTH OF PASSWORD
                tmp += pass.length;
            } else {
                tmp -= pass.length;
            }

            if(tmp > range.lowercase[1]) { // WRAPS AROUND TO MAKE SURE ITS STILL A LETTER
                tmp -= range["letter-length"];
            } else if(tmp < range.lowercase[0]) {
                tmp += range["letter-length"];
            }

        } else if(tmp >= range.lowercase[0] && tmp <= range.lowercase[1]) {
            tmp -= 32; // TURNS LOWER TO UPPERCASE LETTER

            if(tmp % 2 === 0){ // SHIFTS BY LENGTH OF PASSWORD
                tmp += pass.length;
            } else {
                tmp -= pass.length;
            }

            if(tmp > range.uppercase[1]) { // WRAPS AROUND TO MAKE SURE ITS STILL A LETTER
                tmp -= range["letter-length"];
            } else if(tmp < range.uppercase[0]) {
                tmp += range["letter-length"];
            }
        } else if(tmp >= range.numbers[0] && tmp <= range.numbers[1]) { // TURNS NUMBERS INTO [!"#$%&'()*]
            tmp -= 15; // TURNS NUMBERS INTO SPECIAL CHRACTERS
            if(tmp % 2 === 0){ // SHIFTS BY LENGTH OF PASSWORD
                tmp += pass.length;
            } else {
                tmp -= pass.length;
            }

            if(tmp > range.special[1]) { // WRAPS AROUND TO MAKE SURE ITS STILL A SPECIAL CHARACTER
                tmp -= range["number-length"];
            } else if(tmp < range.special[0]) {
                tmp += range["number-length"];
            }
        } else if(tmp >= range.special[0] && tmp <= range.special[1]) { // TURNS [!"#$%&'()*] INTO NUMBERS
            tmp += 15; // TURNS NUMBERS INTO SPECIAL CHRACTERS
            if(tmp % 2 === 0){ // SHIFTS BY LENGTH OF PASSWORD
                tmp += pass.length;
            } else {
                tmp -= pass.length;
            }

            if(tmp > range.numbers[1]) { // WRAPS AROUND TO MAKE SURE ITS STILL A NUMBER
                tmp -= range["number-length"];
            } else if(tmp < range.numbers[0]) {
                tmp += range["number-length"];
            }
        }



        arr.push(tmp);
    }

return ArrayToText(arr);
}