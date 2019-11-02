(function() {
  var calculator = document.querySelector(".calculator");
  var calculator_visor = document.querySelector(".calculator__visor");
  var tempCalculation = "";
  var calculationSequence = [];
  var debug = document.querySelector(".debug tbody");

  calculator.addEventListener("click", function(e) {
    if (e.target.classList.contains("calculator__button")) {

      // if a number is clicked
      if (e.target.getAttribute("data-num")) {
        var newNum = e.target.getAttribute("data-num");
        tempCalculation += newNum;
        updateVisor(tempCalculation);
      }

      // if an operator is clicked
      if (e.target.getAttribute("data-operation")) {
        var operation = e.target.getAttribute("data-operation");
        var operator = convertOperation(operation);

        if (operation == 'square') {
          tempCalculation = Math.sqrt(tempCalculation);
          updateVisor(tempCalculation);
          return;
        }

        // if it is a regular operation
        if (operation !== "result" && calculationSequence[calculationSequence.length - 1] !== operator) {
          if (tempCalculation) {
            calculationSequence.push(tempCalculation);
          }
          // prevent same operation from being added to the calculation sequence
          if (hasOperation()) {
            calculationSequence[calculationSequence.length - 1] = operator;
          } else {
            calculationSequence.push(operator);
          }
          tempCalculation = "";
          logMessage("Operation: " + operation);
        }

        // if result
        if (hasOperation()) {
          if (tempCalculation) {
            calculationSequence.push(tempCalculation);
            calculateSequence();
          }
        }

      }

      // if an action is clicked
      if (e.target.getAttribute("data-action")) {
        var action = e.target.getAttribute("data-action");

        if (action === "ac" || action === "off") {
          resetCalculation(true);
          clearVisor();
          logMessage("Calculator restarted");
        } else if (action === "c") {
          resetCalculation();
          clearVisor();
          logMessage("Cleared LCD");
        }
      }
    }
  });

  function hasOperation() {
    return calculationSequence.length && isNaN(calculationSequence[calculationSequence.length - 1]);
  }

  function clearVisor() {
    calculator_visor.innerHTML = "";
  }

  function logMessage(message) {
    console.log(message);
    logMsg = document.createElement("tr");
    logMsgTD = document.createElement("td");
    logMsgTD.textContent = message;
    logMsg.appendChild(logMsgTD);
    debug.insertBefore(logMsg, debug.childNodes[0]);
  }

  function resetCalculation(hardReset) {
    if (hardReset) {
      calculationSequence = [];
    }
    tempCalculation = "";
  }

  function calculateSequence() {
    if (calculationSequence.length > 1) {
      var result = eval(calculationSequence.join("")).toString();
      tempCalculation = result;
      logMessage("Calculation: " + calculationSequence);
      updateVisor(result);
      calculationSequence = [];      
    }
  }

  function convertOperation(operation) {
    if (operation == "divide") {
      operation = "/";
    } else if (operation == "add") {
      operation = "+";
    } else if (operation == "subtract") {
      operation = "-";
    } else if (operation == "multiply") {
      operation = "*";
    }
    return operation;
  }

  function updateVisor(num) {
    var numbers = num.toString().split("");
    var isNegative = false;
    clearVisor();
    for (i = 0; i < numbers.length; i++) {
      var className = numbers[i];
      if (numbers[i] === ".") {
        className = "dot";
      } else if (numbers[i] === "-") {
        isNegative = true;
      }
      var domNumber = createVisorDom(className);
      calculator_visor.appendChild(domNumber);
    }
    if (isNegative) {
      var domNegative = createVisorDom('minus');
      calculator_visor.appendChild(domNegative);
    }
    logMessage("Updated LCD: " + num);
  }

  function createVisorDom(className) {
    var domNumber = document.createElement("span");
    domNumber.classList.add("calculator__visor__number");
    domNumber.classList.add("calculator__visor__number--" + className);
    return domNumber;
  }
})();
