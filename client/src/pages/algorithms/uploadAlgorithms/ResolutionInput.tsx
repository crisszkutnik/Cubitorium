import { TextField, Button } from "@mui/material";
import "./ResolutionInput.css";


export function ResolutionInput() {
  return (
    <div>
      <div style={{ display: "grid", placeItems: "end" }}>
        <TextField
          id="outlined-basic"
          label="Solve the cube!"
          variant="outlined"
          className="custom-textfield"
          style={{ width: "800px", height: "100px", marginTop: "-500px" }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
        <Button color="secondary" size="large" variant="outlined">
          Verify
        </Button>
        <Button color="success" size="large" variant="contained" style={{ marginLeft: "40px" }}>
          Upload
        </Button>
      </div>
    </div>
  );
}
