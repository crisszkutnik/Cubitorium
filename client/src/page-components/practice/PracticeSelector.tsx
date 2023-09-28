import { useRef, useState, useEffect } from "react";
import { CasesSelector } from "./CasesSelector";
import { ButtonWrapper } from "../../components/ButtonWrapper";
import { shallow } from 'zustand/shallow';

import {
  selectSets,
  PuzzleTypeKeys,
  useAlgorithmsStore,
} from '../../modules/store/algorithmsStore';
import { selectCases, useCaseStore } from "../../modules/store/caseStore";

export function PracticeSelector() {
  const setsMap = useAlgorithmsStore(
    (state) => state.setsMap,
    shallow,
  );

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(setsMap);
    if (setsMap[PuzzleTypeKeys[0]].length > 0) {
      setSelectedType(PuzzleTypeKeys[0]);
    }
  }, [setsMap]);

  const [selectedType, setSelectedType] = useState(PuzzleTypeKeys[0]);
  const [selectedSubtype, setSelectedSubtype] = useState("");
  const [showCases, setShowCases] = useState(false);


  // when type changes
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubtype(event.target.value);
  };

  
  // when subtype changes
  const handleSubtypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubtype(event.target.value);
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
          className="px-2 py-2 rounded border border-gray-300" value={selectedType} onChange={handleTypeChange}>
          {PuzzleTypeKeys.map((puzzle) => (
            <option key={puzzle}>{puzzle}</option>
          ))}
        </select>
        <p className="text-accent-dark font-semibold">Algorithm Set</p>
        <select
          className="px-2 py-2 rounded border border-gray-300 mb-4" value={selectedSubtype} onChange={handleSubtypeChange}>
          {setsMap[selectedType].map((set) => (
            <option key={set.set_name}>{set.set_name}</option>
          ))}
        </select>
        <ButtonWrapper variant="ghost" onClick={handleShowCases} text="Select Specific Cases" />
        {showCases && <CasesSelector></CasesSelector>}
      </div>
    </div>
  );
}
