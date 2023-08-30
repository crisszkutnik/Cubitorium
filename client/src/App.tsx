import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TestPage } from "./pages/test/TestPage";
import { Navbar } from "./components/navbar/Navbar";
import { Algorithms } from "./pages/algorithms/Algorithms";
import { AllAlgorithms } from "./pages/algorithms/allAlgorithms/AllAlgorithms";
import { Practice } from "./pages/practice/Practice";
import { UserInfo } from "./pages/userInfo/UserInfo";
import { MySolves } from "./pages/userInfo/MySolves";

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
          <Route path="solves" element={<MySolves />} />
        </Route>
        <Route path="/test" element={<TestPage />} />
        <Route path="/practice" element={<Practice />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
