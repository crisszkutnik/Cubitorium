import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TestPage } from "./pages/test/TestPage";
import { Navbar } from "./components/navbar/Navbar";
import { Algorithms } from "./pages/algorithms/Algorithms";
import { AllAlgorithms } from "./pages/algorithms/allAlgorithms/AllAlgorithms";
import { UserInfo } from "./pages/userInfo/UserInfo";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Hello final-thesis</h1>} />
        <Route path="/algorithms" element={<Algorithms />} />
        <Route path="/algorithms/all" element={<AllAlgorithms />} />
        <Route path="/userinfo">
          <Route path="" element={<UserInfo />} />
        </Route>
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
