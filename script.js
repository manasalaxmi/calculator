window.onload = function () {
  // Math functions
  function add(a, b) { return a + b; }
  function subtract(a, b) { return a - b; }
  function multiply(a, b) { return a * b; }
  function divide(a, b) { return b === 0 ? "ERROR!" : a / b; }

  function operate(operator, a, b) {
    a = parseFloat(a);
    b = parseFloat(b);
    switch (operator) {
      case '+': return add(a, b);
      case '-': return subtract(a, b);
      case '*': return multiply(a, b);
      case '/': return divide(a, b);
      default: return null;
    }
  }

  let firstOperand = null;
  let operator = null;
  let waitingForSecondOperand = false;
  let justEvaluated = false;

  const display = document.getElementById('display');
  const subdisplay = document.getElementById('subdisplay');

  function updateDisplay(value) {
    display.textContent = value;
  }

  function resetCalculator() {
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    justEvaluated = false;
    updateDisplay('0');
    subdisplay.textContent = '';
  }

  // Make all functions available to HTML
  window.appendNumber = function (num) {
    if (display.textContent === "ERROR!") {
      resetCalculator();
    }
    if (waitingForSecondOperand || display.textContent === '0' || justEvaluated) {
      updateDisplay(num);
      waitingForSecondOperand = false;
      justEvaluated = false;
    } else if (display.textContent.length < 12) {
      updateDisplay(display.textContent + num);
    }
  };

  window.appendDecimal = function () {
    if (display.textContent === "ERROR!") {
      resetCalculator();
    }
    if (waitingForSecondOperand || justEvaluated) {
      updateDisplay('0.');
      waitingForSecondOperand = false;
      justEvaluated = false;
      return;
    }
    if (!display.textContent.includes('.')) {
      updateDisplay(display.textContent + '.');
    }
  };

  window.setOperator = function (nextOperator) {
    if (display.textContent === "ERROR!") {
      resetCalculator();
    }
    const inputValue = display.textContent;
    if (operator && !waitingForSecondOperand && !justEvaluated) {
      // Chained operation
      const result = operate(operator, firstOperand, inputValue);
      updateDisplay(roundResult(result).toString());
      firstOperand = display.textContent;
      subdisplay.textContent = `${firstOperand} ${nextOperator}`;
    } else {
      firstOperand = inputValue;
      subdisplay.textContent = `${firstOperand} ${nextOperator}`;
    }
    operator = nextOperator;
    waitingForSecondOperand = true;
    justEvaluated = false;
  };

 window.calculate = function () {
  if (!operator || waitingForSecondOperand) return; 
  const secondOperand = display.textContent;
  if (operator === '/' && secondOperand === '0') {
    updateDisplay("ERROR!");
    subdisplay.textContent = '';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    justEvaluated = false;
    return;
  }
  const result = operate(operator, firstOperand, secondOperand);
  subdisplay.textContent = `${firstOperand} ${operator} ${secondOperand}`;
  updateDisplay(roundResult(result).toString());
  firstOperand = display.textContent;
  operator = null;
  waitingForSecondOperand = false;
  justEvaluated = true;
};


  function roundResult(num) {
    if (typeof num === 'string') return num;
    return Math.round(num * 1000) / 1000;
  }

  window.clearAll = function () {
    resetCalculator();
  };

  window.backspace = function () {
    if (display.textContent === "ERROR!") {
      resetCalculator();
      return;
    }
    if (display.textContent.length > 1 && !waitingForSecondOperand && !justEvaluated) {
      updateDisplay(display.textContent.slice(0, -1));
    } else {
      updateDisplay('0');
    }
  };

  window.toggleSign = function () {
    if (display.textContent === '0' || display.textContent === "ERROR!") return;
    if (display.textContent.startsWith('-')) {
      updateDisplay(display.textContent.slice(1));
    } else {
      updateDisplay('-' + display.textContent);
    }
  };

  window.percent = function () {
    if (display.textContent !== "ERROR!") {
      updateDisplay((parseFloat(display.textContent) / 100).toString());
    }
  };

  document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') window.appendNumber(e.key);
    if (e.key === '.') window.appendDecimal();
    if (e.key === '=' || e.key === 'Enter') window.evaluate();
    if (e.key === 'Backspace') window.backspace();
    if (e.key === 'Escape') window.clearAll();
    if (e.key === '%') window.percent();
    if (e.key === '+') window.setOperator('+');
    if (e.key === '-') window.setOperator('-');
    if (e.key === '*') window.setOperator('*');
    if (e.key === '/') window.setOperator('/');
  });
};
