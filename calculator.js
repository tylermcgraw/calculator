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

let operand1 = ""; // Holds sum
let operand2 = ""; // Gets updated with user input
let operator = "";
let displayValue = "0";

function main() {
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
}

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
    // Check for overflow
    if (c >= Number.MAX_SAFE_INTEGER  || c <= Number.MIN_SAFE_INTEGER) {
        displayValue = OVERFLOW;
        resetValues();
        return "";
    }
    return c;
}

function subtract(a, b) {
    let c = a - b;
    // Check for overflow
    if (c >= Number.MAX_SAFE_INTEGER  || c <= Number.MIN_SAFE_INTEGER) {
        displayValue = OVERFLOW;
        resetValues();
        return "";
    }
    return c;
}

function multiply(a, b) {
    let c = a * b;
    // Check for overflow
    if (c >= Number.MAX_SAFE_INTEGER  || c <= Number.MIN_SAFE_INTEGER) {
        displayValue = OVERFLOW;
        resetValues();
        return "";
    }
    return c;
}

function divide(a, b) {
    // Check for divide by 0
    if (!b) {
        displayValue = DIVIDE_BY_ZERO;
        resetValues();
        return "";
    }
    let c = a / b;
    if (c >= Number.MAX_SAFE_INTEGER  || c <= Number.MIN_SAFE_INTEGER) {
        displayValue - OVERFLOW;
        resetValues();
        return"";
    }
    return c;
}

function power(a, b) {
    let c = Math.pow(a, b);
    // Check for overflow
    if (c >= Number.MAX_SAFE_INTEGER  || c <= Number.MIN_SAFE_INTEGER) {
        displayValue = OVERFLOW;
        resetValues();
        return "";
    }
    return c;
}

function fitToScreen(display) {
    let d = display;
    let len = display.length;
    if (len > MAX_DIGITS) {
        let neg = (d.charAt(0) === "-") ? 1 : 0;
        let digitsBeforeDecimal = display.indexOf(".");
        let exponent;
        if (digitsBeforeDecimal === -1) {
            // If num has no decimal, convert to scientific notation
            exponent = (len - 1 - neg).toString();
            d = display.substring(0, 1 + neg) + "." + display.substring(1 + neg, MAX_DIGITS - exponent.length - 2) + "e" + exponent;
        } else {
            let exp = d.indexOf("e");
            if (exp !== -1){
                // If num is already in scientific notation, shorten
                d = display.substring(0, MAX_DIGITS - len + exp) + display.substring(exp);
            } else {
                // Else, truncate digits
                d = display.substring(0, MAX_DIGITS);
            }
        }
        // Make sure num doesn't end with a decimal point
        if (d.charAt(d.length - 1) === ".") {
            d = d.substring(0, d.length - 1);
        }
    }
    return d;
}

function changeDisplayText() {
    const smallDisplay = document.getElementById("small-display");
    smallDisplay.textContent = `${operand1} ${operator} ${operand2}`;

    const display = document.getElementById("display");
    display.textContent = `${fitToScreen(displayValue)}`;
}

const operate = e => {
    let x;
    if (operand1 !== "" && operand2 !== "" && !ERRORS.includes(displayValue)) {
        switch (operator) {
            case MULTIPLY:
                operand1 = multiply(parseFloat(operand1), parseFloat(operand2)).toString();
                break;
            case DIVIDE:
                operand1 = divide(parseFloat(operand1), parseFloat(operand2)).toString();
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
        // At start and after clear move op2 to op1 so op2 can receive more input
        operand1 = operand2;
        operand2 = "";
    }
    // Set operator = button press unless it was an equals
    (e.target.textContent !== EQUALS) ? operator = e.target.textContent : operator = "";
    changeDisplayText();
}

const updateDisplay = e => {
    let button_pressed = e.target.textContent;
    switch (button_pressed) {
        case CLEAR:
            resetValues();
            displayValue = "0"; // Clear text even if it is an error message
            break;
        case DELETE:
            if (!ERRORS.includes(displayValue)) {
                if (displayValue.length > 1) {
                    displayValue = displayValue.substring(0, displayValue.length - 1);
                    (operand2 === "") ? operand1 = displayValue : operand2 = displayValue;
                } else {
                    displayValue = "0";
                    (operand2 === "") ? operand1 = "" : operand2 = "";
                }
            }
            break;       
        case SIGN:
            if (operand2 !== "") {
                // Reverse op2 sign
                (operand2[0] === "-") ? operand2 = operand2.substring(1) : operand2 = "-" + operand2;
            } else {
                operand2 = "-0"
            }
            displayValue = operand2;
            break;
        case DECIMAL:
            if (!ERRORS.includes(displayValue)) {
                // Only append a decimal if there aren't any decimals yet
                if (operand2.indexOf('.') === -1) {
                    (operand2 === "") ? operand2 = "0." : operand2 += ".";
                    displayValue = operand2;
                }
            }
            break;
        // If number button was pressed
        default:
            if (operand2 === "" || displayValue === "0") {
                // Don't append numbers to 0
                displayValue = button_pressed;
                operand2 = displayValue;
            } else if (!ERRORS.includes(displayValue) && operand2.length < 75) {
                // Append value if operand2 isn't null and operand2 isn't wrapping too far
                displayValue += button_pressed;
                operand2 += button_pressed;
            }
    }
    // Clean up negatives
    if(displayValue.length > 2 && displayValue.substring(0, 2) === "-0" && displayValue.charAt(2) !== ".") {
        displayValue = "-" + displayValue.substring(2);
        operand2 = displayValue;
    }
    changeDisplayText();
}

main();