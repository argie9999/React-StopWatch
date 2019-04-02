import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const initialState = {
  lapse: 0,
  isRunning: false,
  startTime: null,
  laps: []
};

function timerReducer(state, action) {
  switch (action.type) {
    case "START": {
      const { lapse } = action.value;
      return {
        ...state,
        lapse: !lapse ? 0 : lapse,
        isRunning: true,
        startTime: new Date()
      };
    }
    case "STOP": {
      const { lapse } = action.value;
      return {
        ...state,
        lapse: lapse,
        isRunning: false
      };
    }
    case "INCREMENT": {
      const { value } = action.value;
      return {
        ...state,
        lapse: value,
        isRunning: true
      };
    }
    case "LAP": {
      const { lapse, laps } = action.value;
      let newLaps = laps;
      newLaps.push(lapse);
      return {
        ...state,
        laps: newLaps
      };
    }
    case "CLEAR": {
      return {
        lapse: 0,
        isRunning: false
      };
    }
    default: {
      return initialState;
    }
  }
}

const leftPad = (width, n) => {
  if ((n + "").length > width) {
    return n;
  }
  const padding = new Array(width).join("0");
  return (padding + n).slice(-width);
};

const getUnits = lapse => {
  const seconds = lapse / 1000;
  return {
    min: Math.floor(seconds / 60).toString(),
    sec: Math.floor(seconds % 60).toString(),
    msec: (seconds % 1).toFixed(3).substring(2)
  };
};

function App() {
  const [state, dispatch] = React.useReducer(timerReducer, initialState);

  const { lapse, isRunning, startTime, laps } = state;

  function handleToggle(event) {
    if (isRunning) {
      dispatch({ type: "STOP", value: { ...state } });
    } else {
      dispatch({ type: "START", value: { ...state } });
    }
  }

  function handleClear(event) {
    dispatch({ type: "CLEAR" });
  }

  function handleLap(event) {
    dispatch({ type: "LAP", value: { ...state } });
  }

  React.useEffect(
    () => {
      if (isRunning) {
        let intervalId = setInterval(() => {
          const now = new Date();
          const delta = now.getTime() - startTime.getTime();
          dispatch({
            type: "INCREMENT",
            value: { ...state, value: lapse + delta }
          });
        }, 25);

        return () => clearInterval(intervalId);
      }
    },
    [isRunning]
  );

  const { min, sec, msec } = getUnits(lapse);

  // TODO: Pull the timer into its own component/file.

  return (
    <div className="button-container">
      <div className="timer">
        <span>{leftPad(2, min)}:</span>
        <span>{leftPad(2, sec)}.</span>
        <span>{msec}</span>
      </div>
      <button className={isRunning ? "stop" : "start"} onClick={handleToggle}>
        {isRunning ? "Stop" : "Start"}
      </button>
      <button onClick={handleClear}>Clear</button>
      <button className="lap" onClick={handleLap}>
        Lap
      </button>
      {laps &&
        laps.map(item => {
          return (
            <div className="small-timer" key={item}>
              <span>{leftPad(2, getUnits(item).min)}:</span>
              <span>{leftPad(2, getUnits(item).sec)}:</span>
              <span>{getUnits(item).msec}</span>
            </div>
          );
        })}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
