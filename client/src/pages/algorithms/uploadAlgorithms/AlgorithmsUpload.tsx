import React, { useState } from "react";
import { useAlgorithmsStore } from "../../../modules/store/algorithmsStore";
import { useNavigate } from "react-router-dom";

export function AlgorithmsUpload() {
  // get the map of algorithms
  const algorithmsStore = useAlgorithmsStore(); 
  const navigate = useNavigate(); 

  // default state
  const [selectedType, setSelectedType] = useState(algorithmsStore.algorithmsType[0]);
  const [selectedSubtype, setSelectedSubtype] = useState(
    algorithmsStore.algorithmsSubtypes[selectedType][0]
  );

  const [notation, setNotation] = useState("");

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
    setSelectedSubtype(algorithmsStore.algorithmsSubtypes[event.target.value][0]);
  };

  const handleSubtypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubtype(event.target.value);
  };

  const handleNotationChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotation(event.target.value);
  };

  const handleUpload = () => {
    // TODO: logic for upload
    navigate("/algorithms/all"); 
  };

  return (
    <div>
      <h2>Upload Algorithm</h2>
      <label>
        Algorithm Type:
        <select value={selectedType} onChange={handleTypeChange}>
          {algorithmsStore.algorithmsType.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Algorithm Subtype:
        <select value={selectedSubtype} onChange={handleSubtypeChange}>
          {algorithmsStore.algorithmsSubtypes[selectedType].map((subtype) => (
            <option key={subtype} value={subtype}>
              {subtype}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Notation:
        <textarea rows={6} value={notation} onChange={handleNotationChange} />
      </label>
      <br />
      <button onClick={handleUpload}>Upload Algorithm</button>
    </div>
  );
}
