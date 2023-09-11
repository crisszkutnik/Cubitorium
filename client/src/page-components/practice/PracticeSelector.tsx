import { useRef, useState } from "react";
import { useAlgorithmsStore } from "../../modules/store/algorithmsStore";
import { Button } from "../../components/Button";
import { CasesSelector } from "./CasesSelector";

export function PracticeSelector() {
  const container = useRef<HTMLDivElement>(null);
  const algorithmsStore = useAlgorithmsStore();

  // states
  const [selectedType, setSelectedType] = useState(0);
  const [selectedSubtype, setSelectedSubtype] = useState(0);
  const [showCases, setShowCases] = useState(false);


  // when type changes
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = event.target.value;
    const index = algorithmsStore.test.findIndex((alg) => alg.name === newType);
    setSelectedType(index);
    setSelectedSubtype(0);
  };

  
  // when subtype changes
  const handleSubtypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubtype(algorithmsStore.test[selectedType].sets.findIndex((set) => set.name === event.target.value));
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
          {algorithmsStore.test.map((puzzle) => (
            <option key={algorithmsStore.test.indexOf(puzzle)}>{puzzle.name}</option>
          ))}
        </select>
        <p className="text-accent-dark font-semibold">Algorithm Set</p>
        <select
          className="px-2 py-2 rounded border border-gray-300 mb-4" value={selectedSubtype} onChange={handleSubtypeChange}>
          {algorithmsStore.test[selectedType].sets.map((set) => (
            <option key={algorithmsStore.test[selectedType].sets.indexOf(set)}>{set.name}</option>
          ))}
        </select>
        <Button text="Select Specific Cases" onClick={handleShowCases} type="primary"></Button>
        {showCases && <CasesSelector></CasesSelector>}
      </div>
    </div>
  );
}
