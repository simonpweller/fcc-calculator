export default function init() {
  var calcStr = "0";
  var curr = "0";

  setUpHandlers();

  function setUpHandlers() {
    document.querySelector("#keys").addEventListener("click", function (e) {
      var id = e.target.id;
      var newVals = {
        calcStr: calcStr,
        curr: curr
      };
      var renderVals;

      if (e.target.nodeName !== "BUTTON") {
        return;
      }

      if (isOperator(id)) {
        //operator;
        newVals = processOperator(curr, calcStr, id);
      } else if (id === "=") {
        // equal sign
        newVals = processEqual(curr, calcStr);
      } else if (id === "AC") {
        // AC
        newVals = {
          calcStr: "0",
          curr: "0"
        };
      } else if (id === "CE") {
        // CE
        newVals = processCE(calcStr);
      } else if (id === ".") {
        // decimal
        newVals = processDecimal(curr, calcStr);
      } else {
        // number
        newVals = processNum(curr, calcStr, id);
      }

      calcStr = newVals.calcStr;
      curr = newVals.curr;

      if (curr.length >= 9 || calcStr.length >= 23) {
        curr = "";
        calcStr = "";

        document.querySelector("#summaryDisplay").textContent = "Digit Limit Met";
        document.querySelector("#mainDisplay").textContent = "0";
      } else {
        // render
        document.querySelector("#summaryDisplay").textContent = calcStr;
        document.querySelector("#mainDisplay").textContent = curr;
      }

    });
  }

  function processOperator(curr, calcStr, operator) {
    var length = calcStr.length;
    if ((length === 0 || calcStr === "-") && operator !== "-") {
      // invalid - do nothing;
    } else {
      // if current state is calculation result - reset calcStr to curr
      if (calcStr.indexOf("=") > -1) {
        calcStr = curr;
      }

      var lastEntry = calcStr[length - 1];
      if (isOperator(lastEntry) || lastEntry === ".") {
        // lastEntry already operator or decimal -> replace
        calcStr = calcStr.substring(0, length - 1);
      }
      // append
      calcStr += operator;
      curr = operator;
    }
    return {
      curr: curr,
      calcStr: calcStr
    };
  }

  function processEqual(curr, calcStr) {
    var length = calcStr.length;
    var lastEntry = calcStr[length - 1];
    if (length === 0 || isOperator(lastEntry) || calcStr.indexOf("=") > -1) {
      // invalid - do nothing;
    } else {
      if (lastEntry === ".") { // slice of decimal;
        calcStr = calcStr.substring(0, length - 1);
      }
      curr = cutDecimals(eval(calcStr), 2);
      calcStr = calcStr + "=" + curr;
    }
    return {
      curr: curr,
      calcStr: calcStr
    };
  }

  function processNum(curr, calcStr, id) {
    // if current state is calculation result - reset calcStr and curr
    if (calcStr.indexOf("=") > -1) {
      calcStr = "";
      curr = "";
    }

    var length = calcStr.length;
    var lastEntry = calcStr[length - 1];

    // if lastEntry is operator, reset curr;
    if (isOperator(lastEntry)) {
      curr = "";
    }

    // if curr is 0 reset curr and slice of the 0;
    if (curr === "0") {
      curr = "";
      calcStr = calcStr.substring(0, calcStr.length - 1);
    }


    calcStr += id;
    curr += id;

    return {
      curr: curr,
      calcStr: calcStr
    };
  }

  function processDecimal(curr, calcStr) {
    // if current state is calculation result - reset calcStr and curr
    if (calcStr.indexOf("=") > -1) {
      calcStr = "";
      curr = "";
    }

    var length = calcStr.length;
    var lastEntry = calcStr[length - 1];
    // if last entry is decimal - do nothing;
    if (lastEntry === ".") {
    } else if (isOperator(lastEntry) || calcStr.length === 0) {
      curr = "0.";
      calcStr += "0.";
    } else {
      curr += ".";
      calcStr += ".";
    }
    return {
      curr: curr,
      calcStr: calcStr
    };
  }

  function processCE(calcStr) {
    // if current state is calculation result - reset calcStr and curr
    if (calcStr.indexOf("=") > -1) {
      return {
        calcStr: "0",
        curr: "0"
      }
    }

    var curr = "";
    var match = calcStr.match(/[\/\*\-\+]/gi);
    if (match === null) { // no operators found;
      calcStr = "";
    } else { // operators found
      var lastIndex = calcStr.lastIndexOf(match[match.length - 1]);
      if (lastIndex < calcStr.length - 1) { // doesn't end with operator;
        curr = calcStr[lastIndex] // set curr to last operator;
        lastIndex++; // increment to preserve operator;
      }
      calcStr = calcStr.substring(0, lastIndex);
    }

    if (calcStr === "") {
      curr = "0";
      calcStr = "0";
    }

    return {
      curr: curr,
      calcStr: calcStr
    };
  }

  function isOperator(id) {
    return "/*-+".indexOf(id) > -1;
  }

  function cutDecimals(value, precision) {
    var exponentialForm = Number(value + 'e' + precision);
    var rounded = Math.round(exponentialForm);
    var finalResult = Number(rounded + 'e-' + precision);
    return finalResult;
  }

}
