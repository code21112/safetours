// let string = " uruu intinon tngtntn"
// const split = string.trim().split(" ").join('-')
// // console.log(split)


// const array = string.trim().split(" ")[1]
// console.log(array)
// console.log(typeof (array))
// const arrayWithout = array[1]
// const arrayCleaned = array[1]
// console.log(arrayCleaned)
// console.log(arrayWithout)


// const array2 = [etefer]
// console.log(typeof (array2))


// let Latlng = "40.786671,                     -73.980362"
// const destr = Latlng.split(",")[1].trim()
// console.log(destr)


// const array = ['test']
// const obj = { test: 'r88r88r' };

// array.push(obj)
// console.log(array)


// COMPARING 2 ARRAYS
// let a = [12, 12, 20];
// // let aString = JSON.stringify(a)
// let b = [24, 24, 40];

// let scoreA = 0;
// let scoreB = 0;


// // Looping with for
// function compare(a, b) {
//     for (let i = 0; i < a.length; i++) {
//         if (a[i] > b[i]) scoreA++;
//         if (a[i] < b[i]) scoreB++;
//     }
//     return ([scoreA, scoreB])
// }

// console.log(compare(a, b))






// let bigA = BigInt(1457697777764647684768768787)
// console.log(bigA)


let BIGARRAY = [1000000001, 1000000002, 1000000003, 1000000004, 1000000005]
let BIGARRAYCHANGED = BIGARRAY.map(element => BigInt(element))
BIGARRAY = BIGARRAYCHANGED
// console.log(BIGARRAY)
// console.log(typeof (BIGARRAY))

sum = BIGARRAY.reduce((a, b) => {
    return a + b;
});

// console.log('The sum is: ', sum);


let array = [1000000001, 1000000002, 1000000003, 1000000004, 1000000005]
// sum2 = array.reduce((a, b) => {
//     return a + b;
// });

// console.log('The sum is: ', sum2);


function aVeryBigSum(ar) {
    let arInString = ar.map(element => element.toString())
    let sum = "";

}

// console.log(aVeryBigSum(array))


// 

// let sum = "";  // our result will be stored in a string.

//     // we'll need these in the program many times.
//     let str1Length = str1.length;
//     let str2Length = str2.length;

//     // if s2 is longer than s1, swap them.
//     if(str2Length > str1Length ){
//         let temp = str2;
//         str2 = str1;
//         str1 = temp;
//     }

//     let carry = 0;  // number that is carried to next decimal place, initially zero.
//     let a;
//     let b;
//     let temp;
//     let digitSum;
//     for (let i = 0; i < str1.length; i++) {
//         a = parseInt(str1.charAt(str1.length - 1 - i));      // get ith digit of str1 from right, we store it in a
//         b = parseInt(str2.charAt(str2.length - 1 - i));      // get ith digit of str2 from right, we store it in b
//         b = (b) ? b : 0;                                    // make sure b is a number, (this is useful in case, str2 is shorter than str1
//         temp = (carry + a + b).toString();                  // add a and b along with carry, store it in a temp string.
//         digitSum = temp.charAt(temp.length - 1);            //
//         carry = parseInt(temp.substr(0, temp.length - 1));  // split the string into carry and digitSum ( least significant digit of abSum.
//         carry = (carry) ? carry : 0;                        // if carry is not number, make it zero.

//         sum = (i === str1.length - 1) ? temp + sum : digitSum + sum;  // append digitSum to 'sum'. If we reach leftmost digit, append abSum which includes carry too.

//     }

//     return sum;


let string1 = "100"
let string2 = "600"

strings = string1 + string2
// console.log(strings)



function add(str1, str2) {

    let sum = "";  // our result will be stored in a string.

    // we'll need these in the program many times.
    let str1Length = str1.length;
    let str2Length = str2.length;

    // if s2 is longer than s1, swap them.
    if (str2Length > str1Length) {
        let temp = str2;
        str2 = str1;
        str1 = temp;
    }

    let carry = 0;  // number that is carried to next decimal place, initially zero.
    let a;
    let b;
    let temp;
    let digitSum;
    for (let i = 0; i < str1.length; i++) {
        a = parseInt(str1.charAt(str1.length - 1 - i));      // get ith digit of str1 from right, we store it in a
        b = parseInt(str2.charAt(str2.length - 1 - i));      // get ith digit of str2 from right, we store it in b
        b = (b) ? b : 0;                                    // make sure b is a number, (this is useful in case, str2 is shorter than str1
        temp = (carry + a + b).toString();                  // add a and b along with carry, store it in a temp string.
        digitSum = temp.charAt(temp.length - 1);            //
        carry = parseInt(temp.substr(0, temp.length - 1));  // split the string into carry and digitSum ( least significant digit of abSum.
        carry = (carry) ? carry : 0;                        // if carry is not number, make it zero.

        sum = (i === str1.length - 1) ? temp + sum : digitSum + sum;  // append digitSum to 'sum'. If we reach leftmost digit, append abSum which includes carry too.

    }

    return sum;     // return sum

}

let arrayTest = [400, 599, 2000];
let arrayStrings = ["0"];


const sumArray = (arr) => {
    for (let index = 0; index < arr.length; index++) {
        arrayStrings.push(arr[index].toString())
        add(arrayStrings[index], arrayStrings[index + 1])
    }
}


console.log(sumArray(arrayTest))