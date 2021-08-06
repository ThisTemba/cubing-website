import React, { Component } from "react";
import TimeDisplay from "./timeDisplay";
import ScrambleDisplay from "./scrambleDisplay";

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
    document.addEventListener("touchstart", this.handleTouchStart);
    document.addEventListener("touchend", this.handleTouchEnd);

    document.addEventListener("keyup", this.handleKeyUp);
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("touchstart", this.handleTouchStart);
    document.removeEventListener("touchend", this.handleTouchEnd);

    document.removeEventListener("keyup", this.handleKeyUp);
    document.removeEventListener("keydown", this.handleKeyDown);
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
    const solve = {
      dateTime: new Date().toString(),
      scramble: this.props.scramble,
      dur: this.state.time / 1000,
      durStatic: this.state.time / 1000,
    };
    return solve;
  };

  handleTouchStart = (e) => {
    const { timerState } = this.state;
    const timerElement = document.getElementById("timer-div");
    const isTouchingTimer = timerElement.contains(e.target);
    const starting =
      timerState === "ready" ||
      timerState === "arming" ||
      timerState === "armed";
    const stopping = timerState === "on";

    if ((starting && isTouchingTimer) || stopping) {
      this.handleKeyDown({ key: " " });
    }
  };

  handleTouchEnd = (e) => {
    const { timerState } = this.state;
    const cancelling = timerState === "armed";
    const coolingDown = timerState === "cooldown";

    if (cancelling || coolingDown) {
      this.handleKeyUp({ key: " " });
    }
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
      <div
        id="timer-div"
        style={{
          userSelect: "none",
        }}
      >
        <ScrambleDisplay scramble={this.props.scramble} />
        <TimeDisplay timeMilliseconds={time} timerState={timerState} />
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
