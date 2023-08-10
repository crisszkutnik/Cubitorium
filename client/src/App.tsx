import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TestPage } from "./pages/test/TestPage";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Hello final-thesis</h1>} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
