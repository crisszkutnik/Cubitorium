import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TestPage } from "./pages/test/TestPage";
import { Navbar } from "./components/Navbar";
import { Algorithms } from "./pages/algorithms/Algorithms";
import { AllAlgorithms } from "./pages/algorithms/allAlgorithms/AllAlgorithms";
<<<<<<< HEAD
import { Practice } from "./pages/practice/Practice";
=======
>>>>>>> main

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Hello final-thesis</h1>} />
        <Route path="/algorithms" element={<Algorithms />} />
        <Route path="/algorithms/all" element={<AllAlgorithms />} />
        <Route path="/test" element={<TestPage />} />
<<<<<<< HEAD
        <Route path="/practice" element={<Practice />} />
=======
>>>>>>> main
      </Routes>
    </BrowserRouter>
  );
}

export default App;
