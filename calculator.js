const CLEAR = "Clear";
const DELETE = "Delete";
const SIGN = "+-";
const POWER = "^";
const MULTIPLY = "x";
const DIVIDE = "/";
const ADD = "+";
const SUBTRACT = "-";
const EQUALS = "=";
const DECIMAL = ".";
const DIVIDE_BY_ZERO = "Div by 0";
const OVERFLOW = "Overflow";
const ERRORS = [DIVIDE_BY_ZERO, OVERFLOW];
const MAX_DIGITS = 9;

function resetValues() {
    operand1 = "";
    operand2 = "";
    operator = "";
    if (!ERRORS.includes(displayValue)) {
        displayValue = "0";
    }
}

function add(a, b) {
    let c = a + b;
    // check for overflow
    if (a !== c-b || b !== c-a) {
        displayValue = OVERFLOW;
        resetValues();
        return "";
    }
    return c;
}

function subtract(a, b) {
    let c = a - b;
    // check for overflow
    if (a !== c+b || b !== a-c) {
        displayValue = OVERFLOW;
        resetValues();
        return "";
    }
    return c;
}

function multiply(a, b) {
    let c = a * b;
    // check for overflow
    if (a !== c/b || b !== c/a) {
        displayValue = OVERFLOW;
        resetValues();
        return "";
    }
    return c;
}

function divide(a, b) {
    // check for divide by 0
    if (!b) {
        displayValue = DIVIDE_BY_ZERO;
        resetValues();
        return "";
    }
    let c = a / b;
    // check for overflow
    if (a !== c*b || b !== c/a) {
        displayValue = OVERFLOW;
        resetValues();
        return "";
    }
    return c;
}

function power(a, b) {
    let c = a;
    while (b-- > 1) {
        c = multiply(c, a);
        if (c = "") {
            return c;
        }
    }
    return c;
}

const operate = e => {
    let x;
    if (operand1 !== "" && operand2 !== "" && !ERRORS.includes(displayValue)) {
        switch (operator) {
            case MULTIPLY:
                operand1 = multiply(parseFloat(operand1) * parseFloat(operand2)).toString();
                break;
            case DIVIDE:
                operand1 = divide(parseFloat(operand1) * parseFloat(operand2)).toString();
                break;
            case ADD:
                operand1 = add(parseFloat(operand1), parseFloat(operand2)).toString();
                break;
            case SUBTRACT:
                operand1 = subtract(parseFloat(operand1), parseFloat(operand2)).toString();
                break;
            case POWER:
                operand1 = power(parseFloat(operand1), parseFloat(operand2)).toString();
                break;
            default:
                operand1 = operand2;
        }
        // Update displayValue, reset operand2
        if (!ERRORS.includes(displayValue)) {
            displayValue = operand1;
            operand2 = "";
        }
    } else if (operand1 === "") {
        // only occurs at start and after clear
        operand1 = operand2;
        operand2 = "";
    }
    // set operator = button press unless it was an equals
    (e.target.textContent !== EQUALS) ? operator = e.target.textContent : operator = "";

    changeDisplayText();
}

function changeDisplayText() {
    const smallDisplay = document.getElementById("small-display");
    smallDisplay.textContent = `${operand1} ${operator} ${operand2}`;
    const display = document.getElementById("display");
    let d = displayValue;
    let len = displayValue.length;
    if (len > MAX_DIGITS) {
        let decimals = displayValue.indexOf(".");
        if (decimals === -1) {
            d = displayValue.substring(0, 1) + "." + displayValue.substring(1, 3) + "x10^" + (len - 1).toString();
        } else {
            d = parseFloat(displayValue).toFixed(MAX_DIGITS - decimals);
        }
    }
    display.textContent = `${d}`;
}

const updateDisplay = e => {
    let button_pressed = e.target.textContent;
    switch (button_pressed) {
        case CLEAR:
            resetValues();
            displayValue = "0";
            break;
        case DELETE:
            // Delete last value of display, update operand
            if (!ERRORS.includes(displayValue)) {
                if (displayValue.length > 1) {
                    displayValue = displayValue.substring(0, displayValue.length - 1);
                    operand2 = displayValue;
                } else {
                    displayValue = "0";
                    operand2 = "";
                }
            }
            break;       
        case SIGN:
            // Reverse current sign
            if (operand2 !== "") {
                if (operand2[0] === "-") {
                    operand2 = operand2.substring(1);
                } else {
                    operand2 = "-" + operand2;
                }
                displayValue = operand2;
            } else if (operand1 !== "") {
                if (operand1[0] === "-") {
                    operand1 = operand1.substring(1);
                } else {
                    operand1 = "-" + operand1;
                }
                displayValue = operand1;
            } else {
                operand2 = "-0"
                displayValue = operand2;
            }
            break;
        case DECIMAL:
            if (displayValue !== DIVIDE_BY_ZERO && operand2 !== "") {
                // Only append a decimal if there aren't any decimals yet
                if (operand2.indexOf('.') === -1) {
                    displayValue += button_pressed;
                    if (operand2 !== "") {
                        operand2 += button_pressed;
                    } else {
                        operand2 = "0.";
                    }
                }
            }
            break;
        // If number button was pressed
        default:
            if (operand2 === "" || displayValue === "0") {
                // If operand2 is null, replace display value (0) with number, set operand2
                // Don't append numbers to 0
                displayValue = button_pressed;
                operand2 = displayValue;
            } else if (displayValue !== DIVIDE_BY_ZERO) {
                // Append value if operand2 isn't null
                displayValue += button_pressed;
                operand2 += button_pressed;
            }
    }
    // clean up negatives
    if(displayValue.length > 2 && displayValue.substring(0, 2) === "-0" && displayValue.charAt(2) !== ".") {
        displayValue = "-" + displayValue.substring(2);
        operand2 = displayValue;
    }
    changeDisplayText();
}

let operand1 = ""; // holds sum
let operand2 = ""; // gets updated with user input
let operator = "";
let displayValue = "0";

const numbers = document.getElementsByClassName('number');
for(let i = 0; i < numbers.length; i++) {
    numbers[i].addEventListener('click', updateDisplay);
}
const operations = document.getElementsByClassName('operation');
for(let i = 0; i < operations.length; i++) {
    operations[i].addEventListener('click', operate);
}
const edits = document.getElementsByClassName('edit');
for(let i = 0; i < edits.length; i++) {
    edits[i].addEventListener('click', updateDisplay);
}