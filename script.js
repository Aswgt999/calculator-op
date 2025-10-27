// Calculator controller for the DOM in index.html
// This version keeps a string `currentInput` for the operand currently being typed
// and renders "firstOperand operator currentInput" so the operator is visually
// represented. Only two operands are shown at a time.

let firstOperand = null;      // number or null
let operator = null;          // '+', '-', '*', '/' or null
let currentInput = '';        // string for the operand being typed

const display = document.querySelector('.screen input[type="text"]');
const buttons = Array.from(document.querySelectorAll('.btn'));

function updateDisplay() {
    if (!operator) {
        display.value = currentInput;
    } else {
        if (currentInput === '') {
            display.value = `${firstOperand} ${operator}`;
        } else {
            display.value = `${firstOperand} ${operator} ${currentInput}`;
        }
    }
}

function parseCurrentInput() {
    return currentInput === '' ? 0 : Number(currentInput);
}

function inputDigit(digit) {
    // prevent multiple leading zeros
    if (currentInput === '0' && digit === '0') return;
    currentInput = currentInput === '0' ? digit : currentInput + digit;
    updateDisplay();
}

function inputDecimal() {
    if (currentInput.includes('.')) return;
    currentInput = currentInput === '' ? '0.' : currentInput + '.';
    updateDisplay();
}

function clearAll() {
    firstOperand = null;
    operator = null;
    currentInput = '';
    updateDisplay();
}

function backspace() {
    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
    } else if (operator) {
        // remove operator and move firstOperand back into currentInput for editing
        currentInput = String(firstOperand === null ? '' : firstOperand);
        firstOperand = null;
        operator = null;
    }
    updateDisplay();
}

function handleOperator(nextOperator) {
    // If there is no current input but there's a firstOperand, just change operator
    if (currentInput === '' && firstOperand != null) {
        operator = nextOperator;
        updateDisplay();
        return;
    }

    // If no firstOperand yet, move currentInput into it
    if (firstOperand == null) {
        firstOperand = parseCurrentInput();
        currentInput = '';
        operator = nextOperator;
        updateDisplay();
        return;
    }

    // If operator already present and we have a currentInput, compute and chain
    if (operator && currentInput !== '') {
        const second = parseCurrentInput();
        const result = compute(firstOperand, second, operator);
        if (result === null) {
            // e.g., division by zero -> reset
            clearAll();
            return;
        }
        firstOperand = result;
        currentInput = '';
        operator = nextOperator;
        updateDisplay();
        return;
    }

    // fallback: set operator
    operator = nextOperator;
    updateDisplay();
}

function handleEquals() {
    if (!operator || currentInput === '') return;
    const second = parseCurrentInput();
    const result = compute(firstOperand, second, operator);
    if (result === null) {
        clearAll();
        return;
    }
    // Show only the result after equals; allow continued operations by typing
    currentInput = String(result);
    firstOperand = null;
    operator = null;
    updateDisplay();
}

function compute(a, b, op) {
    const x = Number(a);
    const y = Number(b);
    if (Number.isNaN(x) || Number.isNaN(y)) return 0;

    switch (op) {
        case '+':
            return x + y;
        case '-':
            return x - y;
        case '*':
            return x * y;
        case '/':
            if (y === 0) {
                alert('Division by zero!');
                return null;
            }
            return decimalRoundTo(x / y, 6);
        default:
            return y;
    }
}

function decimalRoundTo(n, decimals) {
    return Math.round(n * 10 ** decimals) / 10 ** decimals;
}

// Attach listeners
buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const v = btn.textContent.trim();

        if (/^[0-9]$/.test(v)) {
            inputDigit(v);
            return;
        }

        if (v === '.') {
            inputDecimal();
            return;
        }

        if (v === 'C') {
            clearAll();
            return;
        }

        if (v === '#') {
            // treat '#' as backspace
            backspace();
            return;
        }

        if (v === '=') {
            handleEquals();
            return;
        }

        if (/^[+\-*/]$/.test(v)) {
            handleOperator(v);
            return;
        }
    });
});

// initialize display empty
clearAll();

