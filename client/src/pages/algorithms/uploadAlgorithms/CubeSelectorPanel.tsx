import { useEffect, useState } from 'react';
import {
  selectSets2,
  useAlgorithmsStore,
} from '../../../modules/store/algorithmsStore';
import {
  EventsTypes,
  ScrambleDisplay,
} from '../../../components/ScrambleDisplay';

/*
  OBS: Part of this file is hardcoded because right now we are
  only supporting 3x3 cubes
*/

export function CubeSelectorPanel() {
  const sets2 = useAlgorithmsStore(selectSets2);

  /*useEffect(() => {
    setSelectedType(algorithmsType[0]);
  }, [algorithmsType]);*/

  useEffect(() => {
    if (sets2.length > 0) {
      setSelectedType(sets2[0].set_name);
    }
  }, [sets2]);

  const [selectedType, setSelectedType] = useState('3x3');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('');

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event;
    /*const newType = event.target.value;
    setSelectedType(newType);
    setSelectedSubtype(
      algorithmsSubtypes[newType] ? algorithmsSubtypes[newType][0] : '',
    );*/
  };

  const handleSubtypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubtype(event.target.value);
  };

  const subtypeSelectorDisabled = () => {
    /*return (
      !algorithmsSubtypes[selectedType] ||
      algorithmsSubtypes[selectedType].length === 0
    );*/
    return sets2.length === 0;
  };

  return (
    <div className="w-1/4 h-fit">
      <div className="bg-gray-100 flex flex-col px-5 py-5 rounded-md">
        <h1 className="font-bold text-accent-dark mb-5 text-2xl">
          Select your cube
        </h1>
        <ScrambleDisplay
          height="20px"
          event={selectedType as EventsTypes}
        ></ScrambleDisplay>
        <p className="text-accent-dark font-semibold">Algorithm Type</p>
        <select
          className="px-2 py-2 rounded border border-gray-300"
          value={selectedType}
          onChange={handleTypeChange}
        >
          {/*algorithmsType.map((type) => (
            <option key={type}>{type}</option>
          ))*/}
          <option key={1}>3x3</option>
        </select>
        <div className="flex flex-col w-full">
          <p className="text-accent-dark font-semibold">Algorithm Subtype</p>
          <select
            className="px-2 py-2 rounded border border-gray-300"
            value={selectedSubtype}
            onChange={handleSubtypeChange}
            disabled={subtypeSelectorDisabled()}
          >
            {/*(algorithmsSubtypes[selectedType] || []).map((subtype) => (
              <option key={subtype}>{subtype}</option>
            ))*/}
            {(sets2 || []).map((set, index) => (
              <option key={index}>{set.set_name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
