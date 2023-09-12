import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/navbar/Navbar';
import { Algorithms } from './pages/algorithms/Algorithms';
import { AllAlgorithms } from './pages/algorithms/allAlgorithms/AllAlgorithms';
import { AlgorithmsUpload } from './pages/algorithms/uploadAlgorithms/AlgorithmsUpload';
import { UserInfo } from './pages/userInfo/UserInfo';
import { MySolves } from './pages/userInfo/MySolves';
import { InfoByUserID } from './pages/userInfo/InfoByUserID';
import { AdminPanel } from './pages/adminPanel/AdminPanel';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { useUserStore } from './modules/store/userStore';

function App() {
  const { autoConnect, connected } = useWallet();
  const anchorWallet = useAnchorWallet();
  const [showPage, setShowPage] = useState(false);
  const { login, logout, isLogged } = useUserStore();

  useEffect(() => {
    if ((autoConnect && connected) || !autoConnect) {
      if (anchorWallet) {
        login(anchorWallet);
      } else if (isLogged) {
        logout();
      }

      setShowPage(true);
    }
  }, [autoConnect, connected, anchorWallet]);

  if (showPage) {
    return (
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<h1>Hello final-thesis</h1>} />
          <Route path="/algorithms" element={<Algorithms />} />
          <Route path="/algorithms/all" element={<AllAlgorithms />} />
          <Route path="/algorithms/upload" element={<AlgorithmsUpload />} />
          <Route path="/adminpanel" element={<AdminPanel />} />
          <Route path="/userinfo">
            <Route path="" element={<UserInfo />} />
            <Route path="solves" element={<MySolves />} />
            <Route path=":id" element={<InfoByUserID />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }

  return 'Loading...';
}

export default App;
