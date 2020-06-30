import React from "react";
import logo from "./logo.svg";
import { create, all } from "mathjs";

const config = {};
const math = create(all, config);

const CAL_STATES = {
  DEFAULT: {
    screen: "",
    display: "0",
    prevInput: null,
    answer: 0,
  },
  NAN: {
    screen: "NaN",
    display: "NaN",
  },

  OVER_CHAR_LIMIT: {
    display: "NUM LIMIT REACHED",
  },
};

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="container h-100">
        <div class="row h-100">
          <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 d-flex flex-column justify-content-center align-items-center">
            <Calculator />

            <div class="text-center font-weight-bold text-black mt-2">
              Designed and coded by{" "}
              <a class="credits" href="https://github.com/peter-huang">
                Peter Huang
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);

    this.state = CAL_STATES.DEFAULT;

    this.calculate = this.calculate.bind(this);
    this.toggleEvent = this.toggleEvent.bind(this);
    this.isValidNumber = this.isValidNumber.bind(this);
    this.isOperand = this.isOperand.bind(this);
    this.cleanOperands = this.cleanOperands.bind(this);
    this.updateScreen = this.updateScreen.bind(this);
  }

  cleanOperands(ele, input) {
    let screen = [...ele];

    // clean using splice and traversing array backwards
    let matched = "";
    for (let i = screen.length - 1; i >= 0; i--) {
      let e = screen[i];

      if (this.isOperand(e) && e === matched) {
        screen.splice(i, 1);
      }

      if (this.isOperand(e)) {
        matched = e;
      }
    }

    return screen;
  }

  // Checks if input is a valid operand (true) or not (false)
  isOperand(e) {
    if (/^(\+|\-|\*|\/)/.test(e)) {
      return true;
    }

    return false;
  }

  updateScreen(state, data) {
    let total;
    let prevInput = state.prevInput;

    // Initial upaate to screen
    if (state.screen.length === 0 && !this.isOperand(prevInput)) {
      total = state.screen + state.display;
    }

    // Subsequent updates
    else {
      total = state.screen;

      // Add Operands
      if (this.isOperand(prevInput) && this.isOperand(data)) {
        total += data;

        // screen with more than 2 elements
        if (total.length > 2) {
          // last three elements in screen
          let x = total.substring(total.length - 3, total.length - 2);
          let y = total.substring(total.length - 2, total.length - 1);
          let z = total.substring(total.length - 1);

          // check if all three operands are present
          if (this.isOperand(x) && this.isOperand(y) && this.isOperand(z)) {
            return total.substring(0, total.length - 3) + z;
          }

          // check if last two are operands and last element does not equal to "-"
          if (this.isOperand(y) && this.isOperand(z) && z !== "-") {
            return total.substring(0, total.length - 2) + z;
          }

          // check if last two are operands and are BOTH "-" (special case)
          else if (
            this.isOperand(y) &&
            this.isOperand(z) &&
            z === "-" &&
            y === "-"
          ) {
            return total.substring(0, total.length - 2) + z;
          }
        }

        // strip last element which is the duplicate operand
        if (data !== "-") {
          total = state.screen.substring(0, total.length - 1);
        }

        return total;
      } // end of operands

      // Add Number + Additoinal operations from display field
      else {
        // Add from previous answer
        if (prevInput === "=" && state.answer === 0) {
          total = state.screen;
        }

        // Add Numbers
        else {
          total = state.screen + state.display;
        }
      }
    }

    return total + data;
  }

  // Validates the current stored number with the new input element as a valid number
  isValidNumber(state, input) {
    let num = (state.display + input).split("");
    let counter = 0;
    let c = [];

    if (state.display === "0" && input === ".") {
      return "0" + input;
    } else if (state.display === "0" && input !== ".") {
      return input;
    } else if (this.isOperand(state.display) && input !== ".") {
      return input;
    } else if (this.isOperand(state.display) && input === ".") {
      return "0" + input;
    }

    num.forEach((element) => {
      if (element === ".") {
        counter++;
        if (counter < 2) {
          c.push(element);
        }
      } else {
        c.push(element);
      }
    });

    return c.join().replace(/,/g, "");
  }

  // Event Handler
  toggleEvent(event) {
    let e = event.target.value;

    // Reset
    if (e === "AC") {
      this.setState(CAL_STATES.DEFAULT);
    }

    // Operand handling
    else if (this.isOperand(e)) {
      this.setState((state) => {
        let s = this.updateScreen(state, e);

        // Add previous answer subsequently
        if (state.answer !== 0) {
          return {
            display: e,
            prevInput: e,
            screen: state.answer + e,
          };
        }

        // Operand handling
        return {
          display: e,
          prevInput: e,
          screen: s,
        };
      });
    }

    // Calculation handling
    else if (e === "=") {
      // grab from both display and screen
      let total = this.state.screen + this.state.display;
      let answer;

      if (total.length > 1) {
        // break string into elements, and traverse backwards, and remove last element until number is reached
        let arr = total.split("");
        for (let i = arr.length - 1; i >= 0; i--) {
          if (this.isOperand(arr[i])) {
            arr.pop();
          } else {
            break;
          }
        }
        total = arr.join().replace(/,/g, "");
        answer = Math.round(math.evaluate(total) * 1000000) / 1000000;
      } else {
        answer = Math.round(math.evaluate(total) * 1000000) / 1000000;
      }

      this.setState((state) => {
        return {
          display: answer,
          prevInput: e,
          screen: total + e + answer,
          answer: state.answer + answer,
        };
      });
    }

    // Number handling
    else {
      this.setState((state) => {
        let n = this.isValidNumber(state, e);
        return {
          display: n,
          prevInput: e,
        };
      });
    }
  }

  // Calculate function (non working with negative numbers: 5*-5)
  calculate(input) {
    //let input = "3.75+-2.25*2";
    //input = "3+5*6-2/4";
    //input = "5*-5";

    let answer = 0;
    let numIndex = 0;
    let opFound = 0;
    let num = [];
    let opp = [];

    // parse expression
    for (let i = 0; i < input.length; i++) {
      let e = input[i];

      // operands
      if (isNaN(parseInt(e)) && (e !== ".") & this.isOperand(e)) {
        //console.log(e);
        opp.push(e);

        opFound++;
        if (opFound === 1) {
          numIndex++;
        }
      }
      // numbers
      else {
        if (num[numIndex] === undefined) {
          num[numIndex] = e;
        } else {
          num[numIndex] += e;
        }

        opFound = 0;
      }
    }

    // calculate expression
    answer = parseFloat(num[0]);
    for (let i = 0; i < opp.length; i++) {
      let n = parseFloat(num[i + 1]);
      if (!isNaN(n)) {
        switch (opp[i]) {
          case "+":
            answer += n;
            break;
          case "-":
            answer -= n;
            break;
          case "*":
            answer *= n;
            break;
          case "/":
            answer /= n;
            break;
        }
      }
      //console.log("answer: " + answer + " " + opp[i]);
    }

    return answer;
  }

  render() {
    return (
      <div id="calculator">
        {/* Screen */}
        <div class="row">
          <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div id="screen" class="text-right">
              {this.state.screen}
            </div>
          </div>
        </div>

        {/* Display */}
        <div class="row">
          <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div id="display" class="text-right">
              {this.state.display}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div class="row" id="controls">
          <div class="d-none col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="left_bracket"
              onClick={this.toggleEvent}
              class="button text-center w-100"
              value="("
            >
              (
            </button>
          </div>
          <div class="d-none col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="right_bracket"
              onClick={this.toggleEvent}
              class="button text-center w-100"
              value=")"
            >
              )
            </button>
          </div>
          <div class="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
            <button
              id="clear"
              onClick={this.toggleEvent}
              class="button text-center w-100"
              value="AC"
            >
              AC
            </button>
          </div>
        </div>

        <div class="row" id="controls">
          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="seven"
              onClick={this.toggleEvent}
              class="button text-center"
              value="7"
            >
              7
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="eight"
              onClick={this.toggleEvent}
              class="button text-center"
              value="8"
            >
              8
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="nine"
              onClick={this.toggleEvent}
              class="button text-center"
              value="9"
            >
              9
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="divide"
              onClick={this.toggleEvent}
              class="button text-center"
              value="/"
            >
              ÷
            </button>
          </div>
        </div>

        <div class="row" id="controls">
          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="four"
              onClick={this.toggleEvent}
              class="button text-center"
              value="4"
            >
              4
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="five"
              onClick={this.toggleEvent}
              class="button text-center"
              value="5"
            >
              5
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="six"
              onClick={this.toggleEvent}
              class="button text-center"
              value="6"
            >
              6
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="multiply"
              onClick={this.toggleEvent}
              class="button text-center"
              value="*"
            >
              ×
            </button>
          </div>
        </div>

        <div class="row" id="controls">
          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="one"
              onClick={this.toggleEvent}
              class="button text-center"
              value="1"
            >
              1
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="two"
              onClick={this.toggleEvent}
              class="button text-center"
              value="2"
            >
              2
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="three"
              onClick={this.toggleEvent}
              class="button text-center"
              value="3"
            >
              3
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="subtract"
              onClick={this.toggleEvent}
              class="button text-center"
              value="-"
            >
              -
            </button>
          </div>
        </div>

        <div class="row" id="controls">
          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="zero"
              onClick={this.toggleEvent}
              class="button text-center"
              value="0"
            >
              0
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="decimal"
              onClick={this.toggleEvent}
              class="button text-center"
              value="."
            >
              .
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="equals"
              onClick={this.toggleEvent}
              class="button text-center"
              value="="
            >
              =
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="add"
              onClick={this.toggleEvent}
              class="button text-center"
              value="+"
            >
              +
            </button>
          </div>
        </div>

        {/* end of calculator */}
      </div>
    );
  }
}

export default App;
