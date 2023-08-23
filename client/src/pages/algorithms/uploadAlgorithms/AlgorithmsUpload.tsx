import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TopSelector } from "../../../page-components/algorithms/TopSelector"; 

enum QueryParams {
  TYPE = "type",
  SUBTYPE = "subtype",
}

export function AlgorithmsUpload() {
  const [algorithm, setAlgorithm] = useState(""); // Estado para almacenar el algoritmo
  const [searchParams, setSearchParams] = useSearchParams();

  const handleUpload = () => {
    console.log("Loaded algorithm:", algorithm);
    setAlgorithm(""); // Limpiar el área después de cargar
  };

  return (
    <div>
    
      <br />
      <TopSelector />
      
      <h1>Upload Algorithm for <b>{searchParams.get(QueryParams.TYPE)}</b> | <b>{searchParams.get(QueryParams.SUBTYPE)}</b> </h1>
      <br></br>
      <textarea
  
        rows={2}
        cols={20}
        value={algorithm}
        onChange={(e) => setAlgorithm(e.target.value)}
        style={{
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "10px",
          width: "40%",
          fontSize: "20px",
        }}
      />
      <br />
      {/* TODO, use libraries? */}
      <button
        style={{
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
        }}
        onClick={handleUpload}
      >
        Upload Algorithm
      </button>
    </div>
  );
}
