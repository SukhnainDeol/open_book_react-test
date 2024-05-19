

export function setPass(pass) {

    let range = {
        "lowercase" : [96, 122],
        "uppercase" : [64, 90],
        "numbers" : [48, 57],
        "letter-length": 25,
        "number-length": 9
    }
    let arr = [];
    let temp;

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
        } else if(tmp >= range.numbers[0] && tmp <= range.numbers[1]) { // FOR NUMBERS IN THE PASSWORD
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

    temp = ArrayToText(arr) + ArrayToText(arr.reverse()); // CREATES A PALINDROME OUT OF THE PASSWORD FOR FUN

return temp;
}

function ArrayToText(arr){
    return String.fromCharCode(...arr);
  };