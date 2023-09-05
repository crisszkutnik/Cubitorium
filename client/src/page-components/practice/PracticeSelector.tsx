import { useRef, useState } from "react";
import { useAlgorithmsStore } from "../../modules/store/algorithmsStore";
import { Button } from "../../components/Button";

export function PracticeSelector() {
  const container = useRef<HTMLDivElement>(null);
  const algorithmsStore = useAlgorithmsStore();

  // states
  const [selectedType, setSelectedType] = useState(algorithmsStore.algorithmsType[0]);
  const [selectedSubtype, setSelectedSubtype] = useState(algorithmsStore.algorithmsSubtypes[selectedType][0]);
  const [showCases, setShowCases] = useState(false);


  // when type changes
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = event.target.value;
    setSelectedType(newType);
    setSelectedSubtype(algorithmsStore.algorithmsSubtypes[newType][0]);
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
          {algorithmsStore.algorithmsType.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
        <p className="text-accent-dark font-semibold">Algorithm Set</p>
        <select
          className="px-2 py-2 rounded border border-gray-300 mb-4" value={selectedSubtype} onChange={handleSubtypeChange}>
          {algorithmsStore.algorithmsSubtypes[selectedType].map((subtype) => (
            <option key={subtype}>{subtype}</option>
          ))}
        </select>
        <Button text="Select Specific Cases" onClick={handleShowCases} type="primary"></Button>
        {showCases && <p>a</p>}
      </div>
    </div>
  );
}
