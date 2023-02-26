/*
Godfrey
WYWM intro to javascript
*/
//variables

var testDate = new Date(2022,5,4,3,2,1,1);
x=testDate.toDateString();
y=testDate.toISOString();
console.log(x);
console.log(y);

var animal = {
    type1: "flying bee",
    name1: "Arceus",
    wingspan: 2,
    wingspan_unit: "cm",
    about: function(){
        return "hello, my name is " + this.name1 + ". I'm a " + this.type1 + ", with a wingspan of " + this.wingspan + this.wingspan_unit +"!";
    }};

z = animal.about();

console.log(z);

var bee1 = [];

const arr3 = [1, 2, [3, 4, [5, 6]]];
w = arr3.flat(1);
console.log(w);

a=1

switch(a){
    case 1:
        console.log(a);
        break
    case a < 3:
        console.log(a);
        break
}

var nam = `Shirley`;

sayHello(nam);
sayHello();

function sayHello(nam = `Bruce`){
    nam=nam.toLowerCase()
    console.log(`Hello, ${nam}`);
}

console.log(nam)

scopeTest();

function scopeTest(){
    let x=10;
    {
        let x=20;
        console.log(x)
    }
    console.log(x)
}


var x;

x = multiplier (3,4);

function multiplier(x,y){
    let newnumber = x*y;
    return newnumber;
}

console.log(x);