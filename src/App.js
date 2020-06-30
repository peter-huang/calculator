import React from "react";
import logo from "./logo.svg";

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
    this.isValidNumber = this.isValidNumber.bind(this);
    this.isOperand = this.isOperand.bind(this);
    this.cleanOperands = this.cleanOperands.bind(this);
    this.updateScreen = this.updateScreen.bind(this);
  }

  cleanOperands(ele, input) {
    let screen = [...ele];
    console.log(screen);
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

    console.log(screen);
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
      //console.log("here1");
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
          if (this.isOperand(y) && this.isOperand(z) && z != "-") {
            return total.substring(0, total.length - 2) + z;
          }

          // check if last two are operands and are BOTH "-" (special case)
          else if (
            this.isOperand(y) &&
            this.isOperand(z) &&
            z == "-" &&
            y == "-"
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

      // Add Number from display field
      else {
        total = state.screen + state.display;
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

  calculate(event) {
    let e = event.target.value;

    if (e === "AC") {
      this.setState(CAL_STATES.DEFAULT);
    } else if (this.isOperand(e)) {
      this.setState((state) => {
        let s = this.updateScreen(state, e);
        return {
          display: e,
          prevInput: e,
          screen: s,
        };
      });
    } else if (e === "=") {
    } else {
      this.setState((state) => {
        let n = this.isValidNumber(state, e);
        return {
          display: n,
          prevInput: e,
        };
      });
    }
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
              onClick={this.calculate}
              class="button text-center w-100"
              value="("
            >
              (
            </button>
          </div>
          <div class="d-none col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="right_bracket"
              onClick={this.calculate}
              class="button text-center w-100"
              value=")"
            >
              )
            </button>
          </div>
          <div class="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
            <button
              id="clear"
              onClick={this.calculate}
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
              onClick={this.calculate}
              class="button text-center"
              value="7"
            >
              7
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="eight"
              onClick={this.calculate}
              class="button text-center"
              value="8"
            >
              8
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="nine"
              onClick={this.calculate}
              class="button text-center"
              value="9"
            >
              9
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="divide"
              onClick={this.calculate}
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
              onClick={this.calculate}
              class="button text-center"
              value="4"
            >
              4
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="five"
              onClick={this.calculate}
              class="button text-center"
              value="5"
            >
              5
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="six"
              onClick={this.calculate}
              class="button text-center"
              value="6"
            >
              6
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="multiply"
              onClick={this.calculate}
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
              onClick={this.calculate}
              class="button text-center"
              value="1"
            >
              1
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="two"
              onClick={this.calculate}
              class="button text-center"
              value="2"
            >
              2
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="three"
              onClick={this.calculate}
              class="button text-center"
              value="3"
            >
              3
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="subtract"
              onClick={this.calculate}
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
              onClick={this.calculate}
              class="button text-center"
              value="0"
            >
              0
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="decimal"
              onClick={this.calculate}
              class="button text-center"
              value="."
            >
              .
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="equals"
              onClick={this.calculate}
              class="button text-center"
              value="="
            >
              =
            </button>
          </div>

          <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button
              id="add"
              onClick={this.calculate}
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
