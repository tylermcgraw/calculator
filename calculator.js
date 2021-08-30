const CLEAR = "Clear";
const DELETE = "Delete";
const SIGN = "+-";
const POWER = "^";
const MULTIPLY = "x"
const DIVIDE = "/"
const ADD = "+"
const SUBTRACT = "-"
const EQUALS = "="
const DECIMAL = "."

const operate = e => {
    let x;
    if (operand1 !== "" && operand2 !== "") {
        switch (operator) {
            case MULTIPLY:
                x = parseInt(operand1) * parseInt(operand2);
                operand1 = x.toString();
                break;
            case DIVIDE:
                x = parseInt(operand1) / parseInt(operand2);
                operand1 = x.toString();
                break;
            case ADD:
                x = parseInt(operand1) + parseInt(operand2);
                operand1 = x.toString();
                break;
            case SUBTRACT:
                x = parseInt(operand1) - parseInt(operand2);
                operand1 = x.toString();
                break;
            case POWER:
                x = parseInt(operand1) ** parseInt(operand2);
                operand1 = x.toString();
                break;
            // If EQUALS ...
        }
        // Update displayValue, reset operand2 and operator
        displayValue = operand1;
        operand2 = "";
        changeDisplayText();
    } else if (operand1 = "") {
        // If operand1 = "", set = to operand2 and reset operand2
        operand1 = operand2;
        operand2 = "";
    }
    // If operand2 = "", wait for user input
    operator = e.target.textContent;
    if (operator === EQUALS) {
        operand2 = displayValue;
    }
}

function changeDisplayText() {
    const display = document.getElementById("display");
    display.textContent = `${displayValue}`;
    console.log(display.textContent);
}

const updateDisplay = e => {
    let button_pressed = e.target.textContent;
    switch (button_pressed) {
        case CLEAR:
            // Reset to default values
            operand1 = "";
            operand2 = "";
            operator = null;
            displayValue = "0";
            break;
        case DELETE:
            // Delete last value of display, update operand
            if (displayValue.length > 1) {
                displayValue = displayValue.substring(0, displayValue.length - 1);
                operand2 = displayValue;
            } else {
                displayValue = "0";
                operand2 = "";
            }
            break;       
        case SIGN:
            if (operand2 !== "") {
                if (operand2[0] === "-") {
                    operand2 = operand2.substring(1);
                } else {
                    operand2 = "-" + operand2;
                }
                displayValue = operand2;
            }
            break;
        // If number button was pressed
        default:
            if (operand2 === "") {
                displayValue = button_pressed;
                operand2 = displayValue;
            } else {
                displayValue += button_pressed;
                operand2 += button_pressed;
            }
    }
    changeDisplayText();
}

let operand1 = ""; // holds sum
let operand2 = ""; // gets updated with user input
let operator = null;
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