import { useState, useEffect, useCallback } from "react";
import { TwistyPlayer } from "./TwistyPlayer";

export function StopWatch() {
  // state to store time
  const [time, setTime] = useState(0);

  // state to check stopwatch running or not
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    if (isRunning) {
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  // Method to start and stop timer
  const startAndStop = () => {
    setIsRunning(!isRunning);
    if (!isRunning) setTime(0);
  };

  const keyPress = useCallback(
    (e: { key: string; }) => {
      if (e.key === " ") {
        startAndStop();
      }
    },
    [startAndStop]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  // Seconds calculation
  const seconds = Math.floor(time / 100);

  // Milliseconds calculation
  const milliseconds = time % 100;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col items-center bg-gray-300 rounded-lg w-3/4">
        <div className="flex flex-row items-center w-full p-6 border-b-4">
          <TwistyPlayer puzzle="3x3x3" algorithm="R U2 R' U' R U' R'" size="100"></TwistyPlayer>
          <h1 className="text-3xl font-bold w-full text-center">R U2 R’ U’ R U’ R’</h1>
        </div>
        <p className="text-9xl text-white font-bold py-8">
          {seconds.toString().padStart(2, "0")}:
          {milliseconds.toString().padStart(2, "0")}
        </p>
        <p className="pb-6">
          Space to {isRunning ? "stop" : "start"}
        </p>
      </div>
    </div>
  );
}
