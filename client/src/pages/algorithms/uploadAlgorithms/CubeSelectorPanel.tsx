import { useEffect, useState } from 'react';
import {
  selectTypesAndSubtypes,
  useAlgorithmsStore,
} from '../../../modules/store/algorithmsStore';
import {
  EventsTypes,
  ScrambleDisplay,
} from '../../../components/ScrambleDisplay';

export function CubeSelectorPanel() {
  const { algorithmsType, algorithmsSubtypes } = useAlgorithmsStore(
    selectTypesAndSubtypes,
  );

  useEffect(() => {
    setSelectedType(algorithmsType[0]);
  }, [algorithmsType]);

  const [selectedType, setSelectedType] = useState(algorithmsType[0] || '');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('');

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = event.target.value;
    setSelectedType(newType);
    setSelectedSubtype(
      algorithmsSubtypes[newType] ? algorithmsSubtypes[newType][0] : '',
    );
  };

  const handleSubtypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubtype(event.target.value);
  };

  const subtypeSelectorDisabled = () => {
    return (
      !algorithmsSubtypes[selectedType] ||
      algorithmsSubtypes[selectedType].length === 0
    );
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
          {algorithmsType.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
        <div className="flex flex-col w-full">
          <p className="text-accent-dark font-semibold">Algorithm Subtype</p>
          <select
            className="px-2 py-2 rounded border border-gray-300"
            value={selectedSubtype}
            onChange={handleSubtypeChange}
            disabled={subtypeSelectorDisabled()}
          >
            {(algorithmsSubtypes[selectedType] || []).map((subtype) => (
              <option key={subtype}>{subtype}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
