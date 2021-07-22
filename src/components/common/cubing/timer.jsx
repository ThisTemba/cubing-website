import React, { Component } from "react";
import TimeDisplay from "./timeDisplay";
import ScrambleDisplay from "./scrambleDisplay";
import getTimeString from "../../../utils/formatTime";

//this.props.onNewSolve
//this.props.armingTime
//this.props.scramble
class Timer extends Component {
  state = {
    time: 0, // time in ms
    timerState: "ready",
  };

  componentDidUpdate(_, prevState) {
    const { timerState } = this.state;
    if (timerState !== prevState.timerState) {
      timerState === "on" ? this.startTimer() : this.stopTimer();
    }
  }

  componentDidMount() {
    document.addEventListener("keyup", this.handleKeyUp);
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleKeyUp);
    document.addEventListener("keydown", this.handleKeyDown);
  }

  startTimer = () => {
    this.interval = setInterval(() => {
      this.setState((state) => ({ time: state.time + 10 }));
    }, 10);
  };

  stopTimer = () => {
    clearInterval(this.interval);
  };

  getNewSolve = () => {
    const { time: timeRaw } = this.state;
    const { scramble } = this.props;
    const solve = {
      dateTime: new Date(),
      solveTime: {
        timeString: getTimeString(timeRaw),
        timeSeconds: timeRaw / 1000,
        timeRaw: timeRaw,
      },
      scramble: scramble,
    };
    return solve;
  };

  handleKeyUp = ({ key }) => {
    if (key === " ") {
      const { timerState } = this.state;
      switch (timerState) {
        case "armed":
          this.setState({ timerState: "on" });
          break;
        case "cooldown":
          this.setState({ timerState: "ready" });
          break;
        case "arming":
          clearTimeout(this.timeout);
          this.setState({ timerState: "ready", time: 0 });
          break;
        default:
      }
    }
  };

  handleKeyDown = ({ key }) => {
    const { timerState } = this.state;
    const { armingTime } = this.props;
    if (timerState === "on") {
      this.setState({ timerState: "cooldown" }); // stop the timer first
      this.props.onNewSolve(this.getNewSolve());
    }
    if (key === " " && timerState === "ready") {
      this.timeout = setTimeout(() => {
        this.setState({ timerState: "armed", time: 0 });
      }, armingTime);
      this.setState({ timerState: "arming" });
    }
  };

  render() {
    const { timerState, time } = this.state;
    return (
      <div>
        <ScrambleDisplay scramble={this.props.scramble} />
        <TimeDisplay timeString={getTimeString(time)} timerState={timerState} />
      </div>
    );
  }
}

Timer.defaultProps = {
  armingTime: 300,
  scramble: "R U R' U'(test scramble)",
  onNewSolve: () => {},
};

export default Timer;
