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
import { useEffect } from 'react';
import { useUserStore } from './modules/store/userStore';
import { Loading } from './pages/Loading';
import { Practice } from './pages/practice/Practice';
import { Home } from './pages/home/Home';
import { GetStartedGuide } from './pages/guide/GetStartedGuide';
import { MyLikes } from './pages/userInfo/MyLikes';
import { AuthenticatedRoute } from './components/AuthenticatedRoute';
import { NotFound } from './pages/NotFound';
import { HowToSubmitGuide } from './pages/guide/HowToSubmitGuide'
import { Guides } from './pages/guide/Guides';

function App() {
  const { autoConnect, connected } = useWallet();
  const anchorWallet = useAnchorWallet();
  const { login, logout, isLogged } = useUserStore();

  useEffect(() => {
    if ((autoConnect && connected) || !autoConnect) {
      if (anchorWallet) {
        login(anchorWallet);
      } else if (isLogged) {
        logout();
      }
    }
  }, [autoConnect, connected, anchorWallet]);

  if (isLogged || !autoConnect) {
    return (
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='*' element={<NotFound />}/>
          <Route path="/" element={<Home />} />
          <Route path="/guides/" element={<Guides />} />
          <Route path="/guides/get-started" element={<GetStartedGuide />} />
          <Route path="/guides/how-to-submit" element={<HowToSubmitGuide />} />
          <Route path="/algorithms" element={<Algorithms />} />
          <Route path="/algorithms/all" element={<AllAlgorithms />} />
          <Route element={<AuthenticatedRoute />}>
            <Route path="/algorithms/upload" element={<AlgorithmsUpload />} />
            <Route path="/adminpanel" element={<AdminPanel />} />
          </Route>
          <Route path="/userinfo">
            <Route element={<AuthenticatedRoute />}>
              <Route path="" element={<UserInfo />} />
              <Route path="solves" element={<MySolves />} />
              <Route path="likes" element={<MyLikes />} />
            </Route>
            <Route path=":id" element={<InfoByUserID />} />
          </Route>
          <Route path="/practice" element={<Practice />} />
        </Routes>      
      </BrowserRouter>
    );
  }

  return <Loading />;
}

export default App;
