let a = 0;
let b = 0;
let op = '';

// operate();

function operate() {
    a = Number(prompt("get a"));
    b = Number(prompt("get b"));
    op = prompt("Enter operator (+, -, *, /)");

    switch(op) {
        case "+":
            console.log(add(a,b));
            break;
        case "-":
            console.log(subtract(a,b));
            break;
        case "*":
            console.log(multiply(a,b));
            break;
        case "/":
            console.log(divide(a,b));
            break;
        default:
            alert("The operator do no match!");
    }
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}


function divide(a, b) {
    if (b === 0){
        return alert('Division by zero!');
    }
    return decimalRoundTo(a / b, 2);
}

function decimalRoundTo(n, decimals) {
    return Math.round(n * 10 ** decimals) / 10 ** decimals;
}

