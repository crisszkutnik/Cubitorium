import { useRef, useState, useEffect } from "react";
import { CasesSelector } from "./CasesSelector";
import { ButtonWrapper } from "../../components/ButtonWrapper";
import { shallow } from 'zustand/shallow';

import {
  selectSets,
  PuzzleTypeKey,
  PuzzleTypeKeys,
  useAlgorithmsStore,
} from '../../modules/store/algorithmsStore';

export function PracticeSelector() {
  const setsMap = useAlgorithmsStore(
    (state) => state.setsMap,
    shallow,
  );

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(setsMap);
    if (setsMap[PuzzleTypeKeys[0]].length > 0) {
      setSelectedPuzzle(PuzzleTypeKeys[0]);
    }
  }, [setsMap]);

  const [selectedPuzzle, setSelectedPuzzle] = useState(PuzzleTypeKeys[0]);
  const [selectedSet, setSelectedSet] = useState("");
  const [showCases, setShowCases] = useState(false);


  // when type changes
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPuzzle(event.target.value as PuzzleTypeKey);
    setSelectedSet(setsMap[event.target.value as PuzzleTypeKey][0].set_name)
  };

  
  // when subtype changes
  const handleSubtypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSet(event.target.value);
  };

  const handleShowCases = () => {
    setShowCases(!showCases);
  };

  return (
    <div ref={container} className="basis-1/4 h-fit">
      <div className="bg-gray-100 flex flex-col px-5 py-5 rounded-md">
        <h1 className="font-bold text-accent-dark mb-5 text-2xl">
          Select your cube
        </h1>
        <p className="text-accent-dark font-semibold">Puzzle</p>
        <select
          className="px-2 py-2 rounded border border-gray-300" value={selectedPuzzle} onChange={handleTypeChange}>
          {PuzzleTypeKeys.map((puzzle) => (
            <option key={puzzle}>{puzzle}</option>
          ))}
        </select>
        <p className="text-accent-dark font-semibold">Algorithm Set</p>
        <select
          className="px-2 py-2 rounded border border-gray-300 mb-4" value={selectedSet} onChange={handleSubtypeChange}>
          {setsMap[selectedPuzzle].map((set) => (
            <option key={set.set_name}>{set.set_name}</option>
          ))}
        </select>
        <ButtonWrapper variant="ghost" onClick={handleShowCases} text="Select Specific Cases" />
        {showCases && <CasesSelector selectedPuzzle={selectedPuzzle} selectedSet={selectedSet}></CasesSelector>}
      </div>
    </div>
  );
}
