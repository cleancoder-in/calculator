//global variables
let firstOperand, secondOperand, op;
let resetScreen = false;
let expAvailable = false;
let equalsBtnNotClicked = false;
let numberCount = 0;

//selection
const primaryDisplay = document.querySelector(".displayPrimary");
const secondaryDisplay = document.querySelector(".displaySecondary");
const numberBtns = document.querySelectorAll(".digit");
const operatorBtns = document.querySelectorAll(".op");
const equalsBtn = document.querySelector(".equalsBtn");
const decimalBtn = document.querySelector(".decimal");
const clearBtn = document.querySelector(".clear");
const deleteBtn = document.querySelector(".delete");

//event listeners
numberBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    getNumber(btn.textContent);
  });
});

operatorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    getOperator(btn.textContent);
  });
});

equalsBtn.addEventListener("click", evaluate);
decimalBtn.addEventListener("click", getDecimal);
clearBtn.addEventListener("click", clear);
deleteBtn.addEventListener("click", deleteNumber);
document.addEventListener("keydown", handleKeyboardInput);
// main functions
function getNumber(num) {
  if (resetScreen) {
    clearScreen();
  }
  primaryDisplay.textContent += num;
  numberCount += 1;
  checkLimitAndUpdateFont();
  if (!op) {
    firstOperand = primaryDisplay.textContent;
  } else {
    secondOperand = primaryDisplay.textContent;
    expAvailable = true;
  }
}

function getOperator(opStr) {
  if (firstOperand && !secondOperand) {
    op = opStr;
    secondaryDisplay.textContent = `${firstOperand} ${op}`;
    resetScreen = true;
    numberCount = 0;
  } else if (firstOperand && secondOperand) {
    equalsBtnNotClicked = true;
    evaluate();
    op = opStr;
    secondaryDisplay.textContent = `${firstOperand} ${op}`;
  }
}

function evaluate() {
  if (expAvailable) {
    let result = operate(op, firstOperand, secondOperand);
    if (result === null) return;
    result = roundOff(result);
    primaryDisplay.textContent = result;

    if (!equalsBtnNotClicked) {
      secondaryDisplay.textContent = `${firstOperand} ${op} ${secondOperand} =`;
    }
    firstOperand = result;
    secondOperand = "";
    op = "";
    numberCount = 0;
    expAvailable = false;
    equalsBtnNotClicked = false;
    resetScreen = true;
  }
}

function getDecimal() {
  if (resetScreen) clearScreen();
  if (primaryDisplay.textContent.includes(".")) return;
  if (primaryDisplay.textContent === "") primaryDisplay.textContent = "0";
  primaryDisplay.textContent += ".";
  if (!firstOperand) {
    firstOperand = primaryDisplay.textContent;
  } else {
    secondOperand = primaryDisplay.textContent;
    expAvailable = true;
  }
}

function deleteNumber() {
  primaryDisplay.textContent = primaryDisplay.textContent
    .toString()
    .slice(0, -1);
  numberCount -= 1;
  checkLimitAndUpdateFont();
  if (!expAvailable) firstOperand = primaryDisplay.textContent;

  if (expAvailable) {
    secondOperand = primaryDisplay.textContent;
    if (!secondOperand) {
      expAvailable = false;
    }
  }
}

function clear() {
  primaryDisplay.textContent = "";
  secondaryDisplay.textContent = "";
  firstOperand = secondOperand = op = "";
  expAvailable = resetScreen = false;
  numberCount = 0;
  primaryDisplay.style.fontSize = 36 + "px";
}

function clearScreen() {
  primaryDisplay.textContent = "";
  resetScreen = false;
}

function handleKeyboardInput(e) {
  if (e.key >= 0 && e.key <= 9) getNumber(e.key);
  if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/")
    getOperator(e.key);
  if (e.key === ".") getDecimal();
  if (e.key === "=" || e.key === "Enter") evaluate();
  if (e.key === "Backspace") deleteNumber();
  if (e.key === "Escape") clear();
}

// helper functions
function roundOff(result) {
  return Number(result.toFixed(3));
}
function checkLimitAndUpdateFont() {
  if (numberCount <= 10) primaryDisplay.style.fontSize = 36 + "px";
  else if (numberCount > 10 && numberCount <= 15)
    primaryDisplay.style.fontSize = 20 + "px";
  else if (numberCount > 15) {
    alert("Can't enter more than 15 digits");
    primaryDisplay.textContent = primaryDisplay.textContent
      .toString()
      .slice(0, -1);
  }
}

// calculator functions
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
  if (b === 0) {
    alert("can't divide by zero");
    return null;
  }
  return a / b;
}

// operate function
function operate(op, a, b) {
  a = Number(a);
  b = Number(b);
  switch (op) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      return divide(a, b);
    default:
      return null;
  }
}
