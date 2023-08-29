import { useState } from "react";
import { TextField, Button } from "@mui/material";
import "./ResolutionInput.css";


export function ResolutionInput() {
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = () => {
  
    setIsVerified(true);
  };

  const handleUpload = () => {
    if (isVerified) {
      // TODO: if verified, upload, how? IDK
    } else {
      // TODO: if not? IDK as well
    }
  };

  return (
    <div>
      <div className="flex flex-col w-4/4 ml-6" style={{marginTop: "-400px"}}>
        <div style={{ display: "grid", placeItems: "end" }}>
        <div className="note">
        You need to provide a <b>cube-solving algorithm;</b> otherwise, the upload will not be possible.
        </div>
          <TextField
            id="outlined-basic"
            label="Solve the cube!"
            variant="outlined"
            className="custom-textfield"
            style={{ width: "800px", height: "100px" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
          <Button color="secondary" size="large" variant="outlined" onClick={handleVerify}>
            Verify
          </Button>
          <Button color="success" size="large" variant="contained" style={{ marginLeft: "40px" }} onClick={handleUpload} disabled={!isVerified}>
            Upload
          </Button>
        </div>
        
      </div>
    </div>
  );
}
