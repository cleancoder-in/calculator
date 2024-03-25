//global variables
let text = "";
let finalExp = false;
let a, b, op;

//selection
const display = document.querySelector(".display");
const btns = document.querySelectorAll(".btn");

// calculate` functions
function add(a, b) {
  text = a + b;
  text = Number(text.toFixed(3));
  display.textContent = text;
}

function subtract(a, b) {
  text = a - b;
  text = Number(text.toFixed(3));
  display.textContent = text;
}

function multiply(a, b) {
  text = a * b;
  text = Number(text.toFixed(3));
  display.textContent = text;
}

function divide(a, b) {
  if (b === 0) {
    alert("can't divide by zero");
    return (display.textContent = "");
  }
  text = a / b;
  text = Number(text.toFixed(3));
  display.textContent = text;
}

// operate function
function operate(op, a, b) {
  switch (op) {
    case "+":
      add(a, b);
      break;
    case "-":
      subtract(a, b);
      break;
    case "*":
      multiply(a, b);
      break;
    case "/":
      divide(a, b);
  }
}

function callOperate(expression) {
  const arr = expression.split(" ");
  a = parseFloat(arr[0]);
  op = arr[1];
  b = parseFloat(arr[2]);
  operate(op, a, b);
}

function getIndexOfDecimal(str, whichOperand) {
  let index;
  if (whichOperand === "secondOp") {
    const strArr = str.split(" ");
    let secondOp = strArr[2];
    return (index = secondOp.indexOf("."));
  } else if (whichOperand === "firstOp") {
    return (index = str.indexOf("."));
  }
}

function getTextWidth(str) {
  let text = document.createElement("span");
  document.body.appendChild(text);

  text.style.font = "times new roman";
  text.style.fontSize = 36 + "px";
  text.style.height = "auto";
  text.style.width = "auto";
  text.style.position = "absolute";
  text.style.whiteSpace = "no-wrap";
  text.innerHTML = str;

  width = Math.ceil(text.clientWidth);
  document.body.removeChild(text);
  return width;
}

function onClick(btn) {
  //clear btn
  if (btn.classList.contains("clear")) {
    display.textContent = "";
    text = display.textContent;
    a = b = op = "";
  }
  //delete btn
  else if (btn.classList.contains("delete")) {
    text = text.toString();
    if (text) {
      let lastChar = text[text.length - 1];
      if (lastChar === " ") {
        display.textContent = text.slice(0, text.length - 2);
      } else {
        display.textContent = text.slice(0, text.length - 1);
      }

      text = display.textContent;
    }
  }
  //decimal btn
  else if (btn.classList.contains("dot")) {
    // if first operand empty, put 0 in front of decimal
    if (text === "") {
      display.textContent += "0" + btn.textContent;
      text = display.textContent;
    } else {
      // check for not repeating decimal in second operand
      if (/[+\-*/]/.test(text)) {
        let lastChar = text[text.length - 1];
        // if second operand empty, put 0 in front of decimal
        if (lastChar === " ") {
          display.textContent += "0" + btn.textContent;
          text = display.textContent;
        } else {
          let indexOfDecimal = getIndexOfDecimal(text, "secondOp");
          if (indexOfDecimal === -1) {
            display.textContent += btn.textContent;
            text = display.textContent;
          }
        }
      }
      // check for not repeating decimal in first operand
      else {
        let indexOfDecimal = getIndexOfDecimal(text, "firstOp");
        if (indexOfDecimal === -1) {
          display.textContent += btn.textContent;
          text = display.textContent;
        }
      }
    }
  }
  //equals btn
  else if (btn.classList.contains("equalsBtn")) {
    //check for expression availability
    let lastChar = text[text.length - 2];
    if (!/[+\-*/]/.test(lastChar)) {
      finalExp = true;
      callOperate(text);
    }
  }
  //digit btns
  else if (btn.classList.contains("digit")) {
    if (finalExp) {
      display.textContent = "";
      finalExp = false;
    }
    display.textContent += btn.textContent;
    text = display.textContent;
    let displayWidth = display.clientWidth - 50;
    let textWidth = getTextWidth(text);
    if (textWidth >= displayWidth) {
      display.style.fontSize = 18 + "px";
    } else {
      display.style.fontSize = 36 + "px";
    }
  }
  // operator btns
  else if (btn.classList.contains("op")) {
    if (text !== "") {
      text = text.toString();
      let lastChar = text[text.length - 2];
      // don't add another operator if last character is operator
      if (!/[+\-*/]/.test(lastChar)) {
        //check for expression availability
        let exp = text.match(/[+\-*/]/);
        if (exp) {
          //if exp available, operate on it
          callOperate(text);
        }
        text += ` ${btn.textContent} `;
        display.textContent = text;
        if (finalExp) finalExp = false;
      }
    }
  }
}

//event listeners
btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    onClick(btn);
  });
});
