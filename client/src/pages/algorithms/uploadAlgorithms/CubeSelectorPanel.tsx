import { useRef, useState } from "react";
import { useAlgorithmsStore } from "../../../modules/store/algorithmsStore";
import { ScrambleDisplay } from "../../../components/ScrambleDisplay";

export function CubeSelectorPanel() {
  // map
  const cubeScrambles = {
    "2x2": "222",
    "3x3": "333",
    "4x4": "444",
    "5x5": "555",
    "6x6": "666",
    "Megaminx":"minx",
    "Roux": "roux",
    "Square-1": "sq1"
  };
  

  const container = useRef<HTMLDivElement>(null);
  const algorithmsStore = useAlgorithmsStore();

  // states
  const [selectedType, setSelectedType] = useState(algorithmsStore.algorithmsType[0]);
  const [selectedSubtype, setSelectedSubtype] = useState(algorithmsStore.algorithmsSubtypes[selectedType][0]);
  const [cubeDisplay, setCubeDisplay] = useState("333"); 


  // when type changes
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = event.target.value;
    setSelectedType(newType);
    setSelectedSubtype(algorithmsStore.algorithmsSubtypes[newType][0]);
    setCubeDisplay(cubeScrambles[newType] || "333")
  };

  
  // when subtype changes
  const handleSubtypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubtype(event.target.value);
  };

  return (
    <div ref={container} className="w-1/4 h-fit">
      <div style={{ marginTop: `2px` }} className="bg-gray-100  flex flex-col px-5 py-5 rounded-md">
        <h1 className="font-bold text-accent-dark mb-5 text-2xl">
          Select your cube
        </h1>
        <ScrambleDisplay height="20px" event={cubeDisplay}></ScrambleDisplay>

        <p className="text-accent-dark font-semibold">Algorithm Type</p>
        <select
          className="px-2 py-2 rounded border border-gray-300" value={selectedType} onChange={handleTypeChange}>
          {algorithmsStore.algorithmsType.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      
        <p className="text-accent-dark font-semibold">Algorithm Subtype</p>
        <select
          className="px-2 py-2 rounded border border-gray-300" value={selectedSubtype} onChange={handleSubtypeChange}>
          {algorithmsStore.algorithmsSubtypes[selectedType].map((subtype) => (
            <option key={subtype}>{subtype}</option>
          ))}
        </select>
 
      </div>
    </div>
  );
}
