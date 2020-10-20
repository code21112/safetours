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

// let arrayTest = [400, 599, 2000];
// let arrayStrings = ["0"];


// // const sumArray = (arr) => {
// //     for (let index = 0; index < arr.length; index++) {
// //         arrayStrings.push(arr[index].toString())
// //         // add(arrayStrings[index], arrayStrings[index + 1])
// //     }
// // }

// // console.log(sumArray(arrayTest))

// console.log(typeof (arrayTest[0].toString()))
// newArray = arrayStrings.push(arrayTest[0])
// console.log('newArray', newArray)


// let test = ["10", "22", "3000"];
// let newValue = 34;
// test.unshift(newValue.toString())
// console.log(test)
// let sumTest = add(test[0], test[1])
// console.log(sumTest)

// let target = [1000000001, 1000000002, 1000000003, 1000000004, 1000000005]
// let toString = (array) => {
//     arrayOfStrings = []
//     for (let i = 0; i < array.length; i++) {
//         arrayOfStrings.push(array[i].toString())
//     }
//     return arrayOfStrings
// };

// console.log(toString(target));
// let targetStrings = toString(target)

// let sumTestViaLoop = (array) => {
//     let sumTotal = "0"
//     // arrayCopy.unshift('0')
//     for (let i = 0; i < array.length - 1; i++) {
//         sum = add(array[i], array[i + 1])
//         sumTotal += sum
//     }
//     add(sumTotal, array[array.length])
// };

// console.log(sumTestViaLoop(targetStrings))


function chunk(array, size) {
    const chunked_arr = [];
    for (let i = 0; i < array.length; i++) {
        const last = chunked_arr[chunked_arr.length - 1];
        if (!last || last.length === size) {
            chunked_arr.push([array[i]]);
        } else {
            last.push(array[i]);
        }
    }
    return chunked_arr;
}

// let myArray = ["2", "3", "4"]
// let divided = chunk(myArray, 2)
// console.log(divided)

// function adding(array) {
//     sumTotal = '0'
//     for (let i = 0; i < array.length; i++) {
//         sumTotal += add(array[i][0], array[i][1])
//     }
//     return sumTotal

// }
// adding(divided)
// let mySum = 0
// for (let i = 0; i < myArray.length; i++) {
//     add(myArray[i - 1], myArray[i])
// }

// console.log(adding)
// console.log(mySum)



// function sum(input) {

//     if (toString.call(input) !== "[object Array]")
//         return false;

//     var total = 0;
//     for (var i = 0; i < input.length; i++) {
//         if (isNaN(input[i + 1])) {
//             continue;
//         }
//         total += add(input[i], input[i + 1]);
//     }
//     return total;
// }

// console.log(sum(myArray))




// let myArray2 = ["2", "3", "4", "20", "44"]
// let chunked = chunk(myArray2, 2)
// console.log(chunked)
// // console.log(chunked[0])
// // console.log(add(chunked[1][0], chunked[1][1]))

// // console.log(chunked.length)
// var summ = '0'
// console.log('SUMM', summ)
// let toAdd = []

// function chunkedAdding(array) {
//     for (let i = 0; i < array.length; i++) {
//         if (array[i].length = 2) {
//             toAdd.push(add(array[i][0], array[i][1]))
//         } else if (array[i].length = 1) {
//             toAdd.push(array[i][0])
//         }
//         // return toAdd
//     }
// }
// console.log(chunkedAdding(chunked))
// console.log('toAdd', toAdd)

// // sum1 = add(myArray[0], myArray[1])
// // sum2 = add(myArray[1], myArray[2])
// // sum3 = sum1 + sum2
// // totalSum = add(sum, myArray[2])
// // console.log(sum3)





// console.log(add(myArray[0], myArray[1]))
// console.log(add(myArray[1], myArray[2]))



let myArray = ["2", "3", "4", "20", "44"]
let target = [1000000001, 1000000002, 1000000003, 1000000004, 1000000005]

let targetString = (array) => {
    arrayOfStrings = []
    for (let i = 0; i < array.length; i++) {
        arrayOfStrings.push(array[i].toString())
    }
    return arrayOfStrings
};

// let tryStock = add(stock, myArray[4])
// console.log(tryStock)

let stock = "0"

function arrayAddition(array) {
    arrayChanged = targetString(array)
    for (let i = 0; i < arrayChanged.length; i++) {
        stock = add(stock, arrayChanged[i])
    }
    return stock
}

console.log(arrayAddition(target))