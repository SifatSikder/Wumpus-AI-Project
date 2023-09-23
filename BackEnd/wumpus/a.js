


function equals(array1, array2) {
    if (array1.length == array2.length) {
        for (let i = 0; i < array1.length; i++) {
            if (array1[i] != array2[i]) return false
        }
    }
    return true
}



// console.log(equals([0, 1], [0, 1]));

var a = 10;


function print() {
    console.log(a);
}

module.exports = { setA: (value) => a = value, getA: () => a, print }
