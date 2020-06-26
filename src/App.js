import React from "react";
import logo from "./logo.svg";

const CAL_STATES = {
  DEFAULT: {
    screen: [],
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
    this.isOperation = this.isOperation.bind(this);
    this.updateScreen = this.updateScreen.bind(this);
  }

  updateScreen(state, input) {}

  isOperation(e) {
    if (/^(\+|\-|\*|\/)/.test(e)) {
      return true;
    }

    return false;
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
    } else if (e === "+" || e === "-" || e === "*" || e === "/") {
    } else if (e === "=") {
    } else {
      // handles numbers and decimals only

      console.log(e);
      this.setState((state) => ({
        display: this.isValidNumber(state, e),
        prevInput: e,
      }));
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
