import { useState, useEffect, useCallback, Dispatch,
  SetStateAction} from "react";
import { TwistyPlayer } from "./TwistyPlayer";
import { CaseAccount } from '../../modules/types/case.interface';
import { PerformanceCase } from '../../modules/types/case.interface';



interface Props {
  selectedPuzzle: string;
  activeCases: CaseAccount[] | undefined;
  performance: PerformanceCase[];
  setPerformance:  Dispatch<SetStateAction<PerformanceCase[]>>;
}

export function StopWatch({
  selectedPuzzle, 
  activeCases,
  performance,
  setPerformance}: Props) {
  // state to store time
  const [time, setTime] = useState(0);
  
  const [selectedCase, setSelectedCase] = useState<CaseAccount>();


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
    if (!isRunning) {
      setTime(0);
    } else {
      actualizarPerformance()
      updateCase()
    };
  };

  function actualizarPerformance() {
    if(selectedCase){
      const index = performance.findIndex((c) => c.case === selectedCase);
      let newPerformance = [...performance];
      if(index != -1){
        const newPerformanceCase = performance?.at(index);
        newPerformanceCase!.history.push(seconds)
        newPerformance[index] = newPerformanceCase!;
      } else {
        const newPerformanceCase = {
          case: selectedCase,
          history: [seconds]
        } as PerformanceCase;
        newPerformance.push(newPerformanceCase);
      }
      setPerformance(newPerformance);  
    }
  }


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


  useEffect(() => {
    updateCase();
  }, [activeCases]);

  function updateCase() {
    if(activeCases){
      setSelectedCase(activeCases[Math.floor(Math.random() * activeCases.length)])
    }
  }

  // Seconds calculation
  const seconds = time / 100;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col items-center bg-gray-300 rounded-lg w-3/4">
        <div className="flex flex-row items-center w-full p-6 border-b-4">
          <TwistyPlayer puzzle={selectedPuzzle} algorithm={selectedCase?.account.setup} size="100"></TwistyPlayer>
          <h1 className="text-3xl font-bold w-full text-center">{selectedCase?.account.setup}</h1>
        </div>
        <p className="text-9xl text-white font-bold py-8">
          {seconds.toString().padStart(2, "0")}
        </p>
        <p className="pb-6">
          Space to {isRunning ? "stop" : "start"}
        </p>
      </div>
    </div>
  );
}
