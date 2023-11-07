import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import { CaseAccount } from '../../modules/types/case.interface';
import { PerformanceCase } from '../../modules/types/case.interface';
import { useAlertContext } from '../../components/context/AlertContext';
import { ScrambleDisplay2 } from '../../components/ScrambleDisplay2';
import { decompress } from '../../modules/utils/compression';

interface Props {
  activeCases: CaseAccount[] | undefined;
  performance: PerformanceCase[];
  setPerformance: Dispatch<SetStateAction<PerformanceCase[]>>;
  setLastCase: Dispatch<SetStateAction<CaseAccount | undefined>>;
}

export function StopWatch({ activeCases, performance, setPerformance, setLastCase }: Props) {
  // state to store time
  const [time, setTime] = useState(0);
  const [redTime, setRedTime] = useState(false);
  const [showScramble, setShowScramble] = useState(true);

  const [selectedCase, setSelectedCase] = useState<CaseAccount>();

  // state to check stopwatch running or not
  const [isRunning, setIsRunning] = useState(false);

  const { error } = useAlertContext();

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
    if (!activeCases || activeCases.length == 0) {
      error('No cases selected');
      return;
    }
    setIsRunning(!isRunning);
    if (!isRunning) {
      setTime(0);
    } else {
      actualizarPerformance();
      updateCase();
    }
  };

  function actualizarPerformance() {
    if (selectedCase) {
      const index = performance.findIndex((c) => c.case === selectedCase);
      const newPerformance = [...performance];
      if (index != -1) {
        const newPerformanceCase = performance?.at(index);
        newPerformanceCase!.history.push(seconds);
        newPerformance[index] = newPerformanceCase!;
      } else {
        const newPerformanceCase = {
          case: selectedCase,
          history: [seconds],
        } as PerformanceCase;
        newPerformance.push(newPerformanceCase);
      }
      setPerformance(newPerformance);
      window.scrollTo(0, 0);
    }
  }

  const keyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (!isRunning) {
          setTime(0);
          setRedTime(true);
        }
      }
    },
    [startAndStop],
  );

  const keyUnpress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === ' ') {
        startAndStop();
        setRedTime(false);
        e.preventDefault();
      }
    },
    [startAndStop],
  );

  useEffect(() => {
    document.addEventListener('keydown', keyPress);
    (document.activeElement as HTMLElement).blur();
    return () => document.removeEventListener('keydown', keyPress);
  }, [keyPress]);

  useEffect(() => {
    document.addEventListener('keyup', keyUnpress);
    return () => document.removeEventListener('keyup', keyUnpress);
  }, [keyUnpress]);

  useEffect(() => {
    updateCase();
  }, [activeCases]);

  function updateCase() {
    if (activeCases) {
      setLastCase(selectedCase);
      setSelectedCase(
        activeCases[Math.floor(Math.random() * activeCases.length)],
      );
    }
  }

  // Seconds calculation
  const seconds = time / 100;

  return (
    <div className="w-full drop-shadow p-6 rounded bg-white">
      <div className="flex flex-col w-full justify-center items-center">
        <div className="flex flex-row items-center w-full p-6 border-b-4">
          <div className="flex flex-col w-1/4 items-center">
            <button
              onClick={() => setShowScramble(!showScramble)}
              className={'flex flex-row items-center mb-4'}
            >
              {showScramble ? (
                <>
                  <p className="text-s pr-2">Hide Scramble</p>
                  <img src="/closed_eye.png" className="w-6 h-6" />
                </>
              ) : (
                <>
                  <p className="text-s">Show Scramble</p>
                  <img src="/opened_eye.png" className="w-6 h-6" />
                </>
              )}
            </button>
            <div className={showScramble ? '' : 'invisible'}>
              <ScrambleDisplay2
                scramble={decompress(selectedCase?.account.setup) || ''}
                set={selectedCase?.account.set || ''}
                height="h-32"
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold w-full text-center">
            {decompress(selectedCase?.account.setup)}
          </h1>
        </div>
        <p
          className={
            'text-9xl font-bold py-8 ' +
            (redTime ? 'text-red-600' : 'text-black')
          }
        >
          {seconds.toFixed(2)}
        </p>
        <p className="pb-6">Space to {isRunning ? 'stop' : 'start'}</p>
      </div>
    </div>
  );
}
