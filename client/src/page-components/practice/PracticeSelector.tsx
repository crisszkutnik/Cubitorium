import { useRef, useState, useEffect } from "react";
import { CasesSelector } from "./CasesSelector";
import { ButtonWrapper } from "../../components/ButtonWrapper";
import {
  selectSets2,
  useAlgorithmsStore,
} from '../../modules/store/algorithmsStore';

export function PracticeSelector() {
  const sets2 = useAlgorithmsStore(selectSets2);

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sets2.length > 0) {
      setSelectedType(sets2[0].set_name);
    }
  }, [sets2]);

  const [selectedType, setSelectedType] = useState('3x3');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('');
  const [showCases, setShowCases] = useState(false);


  // when type changes
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubtype('');
  };

  
  // when subtype changes
  const handleSubtypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubtype('');
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
          {sets2.map((puzzle) => (
            <option key={puzzle.set_name}>{puzzle.set_name}</option>
          ))}
        </select>
        <p className="text-accent-dark font-semibold">Algorithm Set</p>
        <select
          className="px-2 py-2 rounded border border-gray-300 mb-4" value={selectedSubtype} onChange={handleSubtypeChange}>
          {/*sets2.filter(set => set.set_name == selectedType)[0].case_names.map((set) => (
            <option key={set}>{set}</option>
          ))*/}
          <option key={'a'}>{'a'}</option>
        </select>
        <ButtonWrapper variant="ghost" onClick={handleShowCases} text="Select Specific Cases" />
        {showCases && <CasesSelector></CasesSelector>}
      </div>
    </div>
  );
}
